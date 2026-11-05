import { z } from "zod";
export function allowedPushEndpoint(value: string) {
	try {
		const url = new URL(value);
		const host = url.hostname;
		return (
			url.protocol === "https:" &&
			!url.username &&
			!url.password &&
			(!url.port || url.port === "443") &&
			(host === "fcm.googleapis.com" ||
				host === "updates.push.services.mozilla.com" ||
				host.endsWith(".push.services.mozilla.com") ||
				host === "web.push.apple.com" ||
				host.endsWith(".notify.windows.com"))
		);
	} catch {
		return false;
	}
}
export const subscriptionSchema = z.object({
	endpoint: z.string().max(2048).refine(allowedPushEndpoint),
	keys: z.object({
		p256dh: z
			.string()
			.regex(/^[A-Za-z0-9_-]+$/)
			.min(80)
			.max(120),
		auth: z
			.string()
			.regex(/^[A-Za-z0-9_-]+$/)
			.min(20)
			.max(30),
	}),
});
