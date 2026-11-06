import { cookies } from "next/headers";
import {
	authenticated,
	credentialsValid,
	createSession,
	sameOrigin,
	sessionCookie,
	tokenHash,
} from "@/lib/auth";
import { allow, db } from "@/lib/store";
export async function POST(request: Request) {
	if (!sameOrigin(request))
		return Response.json({ error: "Invalid origin" }, { status: 403 });
	try {
		if (!allow("login", 30))
			return Response.json(
				{ error: "Too many attempts. Try again in 15 minutes." },
				{ status: 429 },
			);
		const { name, password } = await request.json();
		if (!credentialsValid(name, password))
			return Response.json(
				{ error: "Incorrect name or password." },
				{ status: 401 },
			);
		(await cookies()).set(sessionCookie, createSession(), {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 30 * 86400,
		});
		return Response.json({ ok: true });
	} catch {
		return Response.json(
			{ error: "Login unavailable. Please try again." },
			{ status: 503 },
		);
	}
}
export async function GET() {
	return Response.json(
		{ authenticated: await authenticated() },
		{ headers: { "Cache-Control": "no-store" } },
	);
}
export async function DELETE(request: Request) {
	if (!sameOrigin(request)) return new Response(null, { status: 403 });
	const jar = await cookies();
	const token = jar.get(sessionCookie)?.value;
	if (token)
		db()
			.prepare("DELETE FROM sessions WHERE token = ?")
			.run(tokenHash(token));
	jar.delete(sessionCookie);
	return Response.json({ ok: true });
}
