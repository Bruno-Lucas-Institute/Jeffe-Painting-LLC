import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID, createHash } from "node:crypto";
export type Inquiry = {
	id: string;
	createdAt: string;
	read: boolean;
	name: string;
	email: string;
	phone: string;
	service: string;
	message: string;
	location?: string;
	timeline?: string;
	budget?: string;
};
export type StoredSubscription = {
	endpoint: string;
	keys: { p256dh: string; auth: string };
};
let connection: DatabaseSync | undefined;
export function db() {
	if (connection) return connection;
	if (process.env.NODE_ENV === "production" && !process.env.OWNER_DATA_DIR)
		throw new Error("OWNER_DATA_DIR must point to a persistent volume");
	const folder = resolve(
		/*turbopackIgnore: true*/ process.env.OWNER_DATA_DIR || ".local-data",
	);
	mkdirSync(folder, { recursive: true, mode: 0o700 });
	const database = new DatabaseSync(resolve(folder, "owner.sqlite"));
	database.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS inquiries(id TEXT PRIMARY KEY,created_at TEXT NOT NULL,payload TEXT NOT NULL,is_read INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS subscriptions(endpoint TEXT PRIMARY KEY,payload TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS push_jobs(id TEXT PRIMARY KEY,inquiry_id TEXT NOT NULL REFERENCES inquiries(id),endpoint TEXT NOT NULL REFERENCES subscriptions(endpoint) ON DELETE CASCADE,attempts INTEGER NOT NULL DEFAULT 0,next_attempt INTEGER NOT NULL DEFAULT 0,lease_until INTEGER NOT NULL DEFAULT 0,UNIQUE(inquiry_id,endpoint));
 CREATE TABLE IF NOT EXISTS limits(bucket TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);`);
	connection = database;
	return database;
}
export function saveInquiry(data: Omit<Inquiry, "id" | "createdAt" | "read">) {
	const record = {
		...data,
		id: randomUUID(),
		createdAt: new Date().toISOString(),
		read: false,
	};
	const database = db();
	database.exec("BEGIN IMMEDIATE");
	try {
		database
			.prepare(
				"INSERT INTO inquiries(id,created_at,payload) VALUES(?,?,?)",
			)
			.run(record.id, record.createdAt, JSON.stringify(data));
		database
			.prepare(
				"INSERT INTO push_jobs(id,inquiry_id,endpoint) SELECT ? || endpoint,?,endpoint FROM subscriptions",
			)
			.run(record.id, record.id);
		database.exec("COMMIT");
		return record;
	} catch (error) {
		database.exec("ROLLBACK");
		throw error;
	}
}
export function listInquiries(limit = 50, offset = 0): Inquiry[] {
	return (
		db()
			.prepare(
				"SELECT * FROM inquiries ORDER BY created_at DESC LIMIT ? OFFSET ?",
			)
			.all(limit, offset) as {
			id: string;
			created_at: string;
			payload: string;
			is_read: number;
		}[]
	).map((row) => ({
		...JSON.parse(row.payload),
		id: row.id,
		createdAt: row.created_at,
		read: !!row.is_read,
	}));
}
export function inquiryCounts() {
	return db()
		.prepare(
			"SELECT COUNT(*) AS total,COALESCE(SUM(CASE WHEN is_read=0 THEN 1 ELSE 0 END),0) AS unread FROM inquiries",
		)
		.get() as { total: number; unread: number };
}
export function markRead(id: string) {
	return (
		db().prepare("UPDATE inquiries SET is_read=1 WHERE id=?").run(id)
			.changes > 0
	);
}
export function addSubscription(sub: StoredSubscription) {
	const database = db();
	const exists = database
		.prepare("SELECT endpoint FROM subscriptions WHERE endpoint=?")
		.get(sub.endpoint);
	const count = database
		.prepare("SELECT COUNT(*) AS count FROM subscriptions")
		.get() as { count: number };
	if (!exists && count.count >= 10) throw new Error("Device limit reached");
	database
		.prepare(
			"INSERT INTO subscriptions(endpoint,payload,created_at) VALUES(?,?,?) ON CONFLICT(endpoint) DO UPDATE SET payload=excluded.payload",
		)
		.run(sub.endpoint, JSON.stringify(sub), new Date().toISOString());
}
export function removeSubscription(endpoint: string) {
	db().prepare("DELETE FROM subscriptions WHERE endpoint=?").run(endpoint);
}
export function hasSubscription(endpoint: string) {
	return !!db()
		.prepare("SELECT endpoint FROM subscriptions WHERE endpoint=?")
		.get(endpoint);
}
export function clearSubscriptions() {
	db().exec("DELETE FROM subscriptions");
}
export function persistentLimit(
	bucket: string,
	max: number,
	windowMs: number,
	now = Date.now(),
) {
	const database = db();
	database.prepare("DELETE FROM limits WHERE expires<=?").run(now);
	const key = createHash("sha256").update(bucket).digest("hex");
	const result = database
		.prepare(
			"INSERT INTO limits(bucket,count,expires) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count",
		)
		.get(key, now + windowMs) as { count: number };
	return result.count <= max;
}
export function closeStore() {
	connection?.close();
	connection = undefined;
}
