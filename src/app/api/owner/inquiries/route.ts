import { guard, json, readJson } from "@/lib/owner/http";
import { listInquiries, inquiryCounts, markRead } from "@/lib/owner/store";
import { pendingPushCount } from "@/lib/owner/push";
import { z } from "zod";

export async function GET(request: Request) {
	const blocked = await guard(request);
	if (blocked) return blocked;
	const page = Math.max(
		0,
		Math.min(
			100000,
			Number(new URL(request.url).searchParams.get("page")) || 0,
		),
	);
	return json({
		items: listInquiries(25, Math.floor(page) * 25),
		...inquiryCounts(),
		pendingNotifications: pendingPushCount(),
	});
}
export async function PATCH(request: Request) {
	const blocked = await guard(request, true);
	if (blocked) return blocked;
	try {
		const input = z
			.object({ id: z.uuid() })
			.parse(await readJson(request, 2000));
		return markRead(input.id)
			? json({ ok: true })
			: json({ error: "Request not found." }, 404);
	} catch {
		return json({ error: "Invalid request." }, 400);
	}
}
