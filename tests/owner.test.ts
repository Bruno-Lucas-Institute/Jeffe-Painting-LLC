import { client } from "../src/config/client";
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join, sep } from "node:path";
import { scryptSync, randomBytes } from "node:crypto";
import {
	closeStore,
	db,
	saveInquiry,
	listInquiries,
	markRead,
	addSubscription,
	removeSubscription,
	persistentLimit,
	inquiryCounts,
} from "../src/lib/owner/store";
import {
	verifyCredentials,
	createSession,
	sessionValid,
	destroySession,
} from "../src/lib/owner/auth";
import { allowedPushEndpoint } from "../src/lib/owner/push-validation";
import { flushPushJobs } from "../src/lib/owner/push";
import webpush from "web-push";
const folder = mkdtempSync(join(tmpdir(), "owner-tests-"));
process.env.OWNER_DATA_DIR = folder;
process.env.OWNER_USERNAME = "TestOwner";
const password = randomBytes(18).toString("hex");
const salt = randomBytes(16).toString("hex");
process.env.OWNER_PASSWORD_HASH = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
after(() => {
	closeStore();
	assert.ok(resolve(folder).startsWith(resolve(tmpdir()) + sep));
	rmSync(folder, { recursive: true, force: true });
});
const payload = {
	name: "Test Customer",
	email: "customer@example.com",
	phone: "",
	service: client.services[0].id,
	message: "Please estimate a room refresh.",
	location: "Sample city",
	timeline: "Next month",
};
const sub = {
	endpoint: "https://fcm.googleapis.com/fcm/send/test-device",
	keys: { p256dh: "B".repeat(87), auth: "A".repeat(22) },
};
test("password is verified on the server and sessions revoke", async () => {
	assert.equal(await verifyCredentials("TestOwner", "wrong"), false);
	assert.equal(await verifyCredentials("other", password), false);
	assert.equal(await verifyCredentials("TestOwner", password), true);
	assert.equal(sessionValid("random"), false);
	const token = createSession();
	assert.equal(sessionValid(token), true);
	assert.equal(sessionValid(token + "x"), false);
	destroySession(token);
	assert.equal(sessionValid(token), false);
	const rotated = createSession();
	const originalHash = process.env.OWNER_PASSWORD_HASH;
	process.env.OWNER_PASSWORD_HASH = `scrypt:${salt}:${"a".repeat(128)}`;
	assert.equal(sessionValid(rotated), false);
	process.env.OWNER_PASSWORD_HASH = originalHash;
	const expired = createSession();
	db().exec("UPDATE sessions SET expires=1");
	assert.equal(sessionValid(expired), false);
});
test("inquiries survive connection restarts and support read status", () => {
	const saved = saveInquiry(payload);
	assert.ok(saved.id);
	closeStore();
	assert.equal(listInquiries()[0].name, payload.name);
	assert.equal(listInquiries()[0].read, false);
	assert.equal(markRead(saved.id), true);
	assert.equal(listInquiries()[0].read, true);
	assert.equal(inquiryCounts().total, 1);
});
test("persistent abuse limits survive restart", () => {
	assert.equal(persistentLimit("test", 2, 10000), true);
	closeStore();
	assert.equal(persistentLimit("test", 2, 10000), true);
	assert.equal(persistentLimit("test", 2, 10000), false);
});
test("push subscriptions cannot target private network or arbitrary URLs", () => {
	for (const url of [
		"http://fcm.googleapis.com/x",
		"https://127.0.0.1/x",
		"https://fcm.googleapis.com.attacker.test/x",
		"https://user@fcm.googleapis.com/x",
		"https://fcm.googleapis.com:444/x",
	])
		assert.equal(allowedPushEndpoint(url), false);
	for (const url of [
		sub.endpoint,
		"https://web.push.apple.com/token",
		"https://updates.push.services.mozilla.com/wpush/token",
	])
		assert.equal(allowedPushEndpoint(url), true);
});
test("durable outbox retries failures and prunes expired devices", async () => {
	process.env.VAPID_PUBLIC_KEY = "test";
	process.env.VAPID_PRIVATE_KEY = "test";
	process.env.VAPID_SUBJECT = "https://example.com";
	addSubscription(sub);
	saveInquiry(payload);
	assert.equal(
		(
			db().prepare("SELECT COUNT(*) AS n FROM push_jobs").get() as {
				n: number;
			}
		).n,
		1,
	);
	const original = webpush.sendNotification;
	try {
		webpush.sendNotification = async () => {
			throw Object.assign(new Error("offline"), { statusCode: 503 });
		};
		await flushPushJobs();
		assert.equal(
			(
				db().prepare("SELECT attempts FROM push_jobs").get() as {
					attempts: number;
				}
			).attempts,
			1,
		);
		assert.equal(inquiryCounts().total, 2);
		db().exec("UPDATE push_jobs SET next_attempt=0");
		webpush.sendNotification = async () => ({
			statusCode: 201,
			body: "",
			headers: {},
		});
		await flushPushJobs();
		assert.equal(
			(
				db().prepare("SELECT COUNT(*) AS n FROM push_jobs").get() as {
					n: number;
				}
			).n,
			0,
		);
		saveInquiry(payload);
		webpush.sendNotification = async () => {
			throw Object.assign(new Error("expired"), { statusCode: 410 });
		};
		await flushPushJobs();
		assert.equal(
			(
				db()
					.prepare("SELECT COUNT(*) AS n FROM subscriptions")
					.get() as { n: number }
			).n,
			0,
		);
		assert.equal(
			(
				db().prepare("SELECT COUNT(*) AS n FROM push_jobs").get() as {
					n: number;
				}
			).n,
			0,
		);
	} finally {
		webpush.sendNotification = original;
		removeSubscription(sub.endpoint);
	}
});
