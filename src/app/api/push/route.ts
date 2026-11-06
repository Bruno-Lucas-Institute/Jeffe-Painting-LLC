import { authenticated, sameOrigin } from "@/lib/auth";
import { db } from "@/lib/store";
export async function GET() {
	if (!(await authenticated())) return new Response(null, { status: 401 });
	return Response.json(
		{ publicKey: process.env.VAPID_PUBLIC_KEY || null },
		{ headers: { "Cache-Control": "no-store" } },
	);
}
export async function POST(request: Request) {
	if (!sameOrigin(request) || !(await authenticated()))
		return new Response(null, { status: 403 });
	try {
		const text = await request.text();
		if (text.length > 6000) return new Response(null, { status: 413 });
		const subscription = JSON.parse(text);
		const url = new URL(subscription.endpoint);
		// Only known push services; prevents arbitrary server-side outbound requests.
		const allowed = [
			"fcm.googleapis.com",
			"updates.push.services.mozilla.com",
			"web.push.apple.com",
			"wns.windows.com",
		];
		if (
			url.protocol !== "https:" ||
			url.port ||
			url.username ||
			url.password ||
			!allowed.some(
				(host) =>
					url.hostname === host || url.hostname.endsWith("." + host),
			) ||
			!/^[A-Za-z0-9_-]{80,200}$/.test(subscription.keys?.p256dh) ||
			!/^[A-Za-z0-9_-]{20,30}$/.test(subscription.keys?.auth)
		)
			return new Response(null, { status: 400 });
		db()
			.prepare("INSERT OR REPLACE INTO subscriptions VALUES (?, ?)")
			.run(subscription.endpoint, JSON.stringify(subscription));
		return Response.json({ ok: true });
	} catch {
		return Response.json(
			{ error: "Could not enable notifications." },
			{ status: 400 },
		);
	}
}
