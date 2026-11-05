import { guard, json, readJson } from "@/lib/owner/http";
import { subscriptionSchema } from "@/lib/owner/push-validation";
import { sendPush } from "@/lib/owner/push";
import { hasSubscription, persistentLimit } from "@/lib/owner/store";

export async function POST(request: Request) {
	const blocked = await guard(request, true);
	if (blocked) return blocked;
	if (!persistentLimit("push-test", 10, 600000))
		return json({ error: "Please wait before another test." }, 429);
	try {
		const sub = subscriptionSchema.parse(await readJson(request, 5000));
		if (!hasSubscription(sub.endpoint))
			return json({ error: "Enable this device first." }, 400);
		await sendPush(sub, {
			title: "Notificações ativadas",
			body: "Jef, este aparelho está pronto para receber novos pedidos.",
			tag: "owner-test",
			url: "/owner",
		});
		return json({ ok: true });
	} catch {
		return json(
			{
				error: "The push service did not accept the test. Try enabling notifications again.",
			},
			503,
		);
	}
}
