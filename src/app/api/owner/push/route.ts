import { z } from "zod";
import { guard, json, readJson } from "@/lib/owner/http";
import { pushConfigured } from "@/lib/owner/push";
import { subscriptionSchema } from "@/lib/owner/push-validation";
import {
	addSubscription,
	removeSubscription,
	hasSubscription,
	clearSubscriptions,
} from "@/lib/owner/store";

export async function GET(request: Request) {
	const blocked = await guard(request);
	if (blocked) return blocked;
	return json({
		configured: pushConfigured(),
		publicKey: pushConfigured() ? process.env.VAPID_PUBLIC_KEY : null,
	});
}
export async function POST(request: Request) {
	const blocked = await guard(request, true);
	if (blocked) return blocked;
	if (!pushConfigured())
		return json(
			{ error: "Notifications are not configured on the server." },
			503,
		);
	try {
		const sub = subscriptionSchema.parse(await readJson(request, 5000));
		addSubscription(sub);
		return json({ ok: true, registered: hasSubscription(sub.endpoint) });
	} catch {
		return json(
			{
				error: "Unable to register this device. Check browser support or the 10-device limit.",
			},
			400,
		);
	}
}
export async function DELETE(request: Request) {
	const blocked = await guard(request, true);
	if (blocked) return blocked;
	try {
		const input = z
			.object({
				endpoint: z.string().max(2048).optional(),
				all: z.boolean().optional(),
			})
			.parse(await readJson(request, 3000));
		if (input.all) clearSubscriptions();
		else if (input.endpoint) removeSubscription(input.endpoint);
		else return json({ error: "Choose a device." }, 400);
		return json({ ok: true });
	} catch {
		return json({ error: "Invalid request." }, 400);
	}
}
