import { cookies } from "next/headers";
import { z } from "zod";
import { destroySession, sessionCookie, cookieOptions } from "@/lib/owner/auth";
import { guard, json, readJson } from "@/lib/owner/http";
import { removeSubscription } from "@/lib/owner/store";

export async function POST(request: Request) {
	const blocked = await guard(request, true);
	if (blocked) return blocked;
	try {
		const input = z
			.object({ endpoint: z.string().max(2048).optional() })
			.parse(await readJson(request, 3000));
		if (input.endpoint) removeSubscription(input.endpoint);
		const token = (await cookies()).get(sessionCookie)?.value;
		destroySession(token);
		const response = json({ ok: true });
		response.cookies.set(sessionCookie, "", {
			...cookieOptions,
			maxAge: 0,
		});
		return response;
	} catch {
		return json({ error: "Unable to sign out. Try again." }, 400);
	}
}
