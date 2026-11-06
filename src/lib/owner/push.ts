import "server-only";
import { client } from "@/config/client";
import webpush from "web-push";
import { db, removeSubscription, type StoredSubscription } from "./store";
export function pushConfigured() {
	return !!(
		client.features.push &&
		process.env.VAPID_PUBLIC_KEY &&
		process.env.VAPID_PRIVATE_KEY &&
		process.env.VAPID_SUBJECT
	);
}
export async function sendPush(sub: StoredSubscription, payload: object) {
	if (!pushConfigured()) throw new Error("Push not configured");
	return webpush.sendNotification(sub, JSON.stringify(payload), {
		TTL: 86400,
		urgency: "high",
		timeout: 5000,
		vapidDetails: {
			subject: process.env.VAPID_SUBJECT!,
			publicKey: process.env.VAPID_PUBLIC_KEY!,
			privateKey: process.env.VAPID_PRIVATE_KEY!,
		},
	});
}
export async function flushPushJobs() {
	if (!pushConfigured()) return;
	const database = db();
	const jobs = database
		.prepare(
			"SELECT j.id,j.endpoint,j.attempts,i.payload,s.payload AS subscription FROM push_jobs j JOIN inquiries i ON i.id=j.inquiry_id JOIN subscriptions s ON s.endpoint=j.endpoint WHERE j.next_attempt<=? AND j.lease_until<=? ORDER BY i.created_at LIMIT 20",
		)
		.all(Date.now(), Date.now()) as {
		id: string;
		endpoint: string;
		attempts: number;
		payload: string;
		subscription: string;
	}[];
	await Promise.allSettled(
		jobs.map(async (job) => {
			const lease = database
				.prepare(
					"UPDATE push_jobs SET lease_until=? WHERE id=? AND lease_until<=?",
				)
				.run(Date.now() + 60000, job.id, Date.now());
			if (!lease.changes) return;
			try {
				const inquiry = JSON.parse(job.payload);
				const excerpt = [
					inquiry.name,
					inquiry.service,
					inquiry.email,
					inquiry.phone,
					inquiry.location,
					inquiry.timeline,
					inquiry.budget,
					inquiry.message,
					...Object.entries(inquiry.fields || {}).map(
						([key, value]) => `${key}: ${value}`,
					),
				]
					.filter(Boolean)
					.join(" · ");
				await sendPush(JSON.parse(job.subscription), {
					title: client.owner.pushTitle,
					body: Array.from(excerpt).slice(0, 550).join(""),
					tag: job.id,
					url: "/owner",
				});
				database
					.prepare("DELETE FROM push_jobs WHERE id=?")
					.run(job.id);
			} catch (error) {
				const code = (error as { statusCode?: number }).statusCode;
				if (code === 404 || code === 410)
					removeSubscription(job.endpoint);
				else
					database
						.prepare(
							"UPDATE push_jobs SET attempts=attempts+1,next_attempt=?,lease_until=0 WHERE id=?",
						)
						.run(
							Date.now() +
								Math.min(
									3600000,
									60000 * 2 ** Math.min(job.attempts, 6),
								),
							job.id,
						);
			}
		}),
	);
}
export function pendingPushCount() {
	return (
		db().prepare("SELECT COUNT(*) AS count FROM push_jobs").get() as {
			count: number;
		}
	).count;
}
