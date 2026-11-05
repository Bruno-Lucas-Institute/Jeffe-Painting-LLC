import { timingSafeEqual } from "node:crypto";
import { flushPushJobs } from "@/lib/owner/push";
import { json } from "@/lib/owner/http";

export async function POST(request: Request) {
	const secret = process.env.PUSH_RETRY_SECRET;
	if (!secret || secret.length < 32)
		return json({ error: "Not configured" }, 503);
	const expected = Buffer.from(`Bearer ${secret}`);
	const actual = Buffer.from(request.headers.get("authorization") || "");
	if (expected.length !== actual.length || !timingSafeEqual(expected, actual))
		return json({ error: "Unauthorized" }, 401);
	await flushPushJobs();
	return json({ ok: true });
}
