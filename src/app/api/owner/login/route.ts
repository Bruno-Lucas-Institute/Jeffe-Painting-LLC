import { NextResponse } from "next/server";
import { z } from "zod";
import {
	json,
	readFormOrJson,
	isNativeForm,
	formFeedback,
	sameOrigin,
	requestIdentity,
} from "@/lib/owner/http";
import {
	ownerConfigured,
	verifyCredentials,
	createSession,
	sessionCookie,
	cookieOptions,
} from "@/lib/owner/auth";
import { persistentLimit } from "@/lib/owner/store";

export async function POST(request: Request) {
	const native = isNativeForm(request);
	const respond = (body: { error: string }, status: number) =>
		native
			? formFeedback(
					"Não foi possível entrar",
					body.error,
					status,
					"/login",
				)
			: json(body, status);
	if (!sameOrigin(request))
		return respond({ error: "Request origin is not allowed." }, 403);
	try {
		if (!ownerConfigured())
			return respond(
				{ error: "Owner access has not been configured." },
				503,
			);
		if (!persistentLimit(`login:${requestIdentity(request)}`, 10, 900000))
			return respond(
				{ error: "Too many attempts. Try again in 15 minutes." },
				429,
			);
		const input = z
			.object({
				username: z.string().min(1).max(100),
				password: z.string().min(1).max(256),
			})
			.safeParse(await readFormOrJson(request, 2000));
		if (!input.success)
			return respond({ error: "Enter your username and password." }, 400);
		if (
			!(await verifyCredentials(input.data.username, input.data.password))
		)
			return respond(
				{ error: "Username or password is incorrect." },
				401,
			);
		const response = native
			? new NextResponse(null, {
					status: 303,
					headers: {
						Location: "/owner",
						"Cache-Control": "no-store",
					},
				})
			: json({ ok: true });
		response.cookies.set(sessionCookie, createSession(), cookieOptions);
		return response;
	} catch {
		return respond(
			{ error: "Unable to sign in right now. Please try again." },
			503,
		);
	}
}
