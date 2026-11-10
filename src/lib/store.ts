import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

let database: DatabaseSync;
export function db() {
	if (!database) {
		const path = resolve(
			/* turbopackIgnore: true */
			process.env.DATABASE_PATH || "data/jeffe.sqlite",
		);
		mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
		database = new DatabaseSync(path);
		database.exec(`PRAGMA journal_mode=WAL;
   CREATE TABLE IF NOT EXISTS appointments (id TEXT PRIMARY KEY, createdAt TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, town TEXT NOT NULL, service TEXT NOT NULL, details TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
   CREATE TABLE IF NOT EXISTS subscriptions (endpoint TEXT PRIMARY KEY, value TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);`);
	}
	return database;
}
export function allow(key: string, maximum: number, duration = 900000) {
	const now = Date.now();
	db().prepare("DELETE FROM limits WHERE expires < ?").run(now);
	db()
		.prepare(
			"INSERT INTO limits VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1",
		)
		.run(key, now + duration);
	const row = db().prepare("SELECT count FROM limits WHERE key = ?").get(key);
	return Number(row?.count) <= maximum;
}
