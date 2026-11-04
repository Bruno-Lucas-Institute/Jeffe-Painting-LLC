import webpush from "web-push";
import { db } from "./store";
export async function notifyAdmin() {
	if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;
	webpush.setVapidDetails(
		process.env.VAPID_SUBJECT || "mailto:jeffe8138@gmail.com",
		process.env.VAPID_PUBLIC_KEY,
		process.env.VAPID_PRIVATE_KEY,
	);
	const rows = db()
		.prepare("SELECT endpoint, value FROM subscriptions")
		.all();
	await Promise.all(
		rows.map(async (row) => {
			try {
				await webpush.sendNotification(
					JSON.parse(String(row.value)),
					JSON.stringify({
						title: "New estimate request",
						body: "A customer sent project details. Open your secure inbox.",
					}),
					{ TTL: 86400, timeout: 5000 },
				);
			} catch (error) {
				if (
					error instanceof webpush.WebPushError &&
					[404, 410].includes(error.statusCode)
				)
					db()
						.prepare("DELETE FROM subscriptions WHERE endpoint = ?")
						.run(String(row.endpoint));
				else
					console.error(
						"Push delivery failed; request remains in inbox.",
					);
			}
		}),
	);
}
