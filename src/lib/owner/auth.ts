import "server-only";
import { client } from "@/config/client";
import { randomBytes, scrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { db } from "./store";
const scryptAsync = promisify(scrypt);
export const sessionCookie =
	process.env.NODE_ENV === "production"
		? "__Host-owner-session"
		: "owner-session";
export const sessionAge = 60 * 60 * 24 * client.owner.sessionDays;
export function ownerConfigured() {
	return (
		client.features.owner &&
		client.owner.enabled &&
		!!process.env.OWNER_USERNAME &&
		/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(
			process.env.OWNER_PASSWORD_HASH || "",
		)
	);
}
export async function verifyCredentials(username: string, password: string) {
	const hash = process.env.OWNER_PASSWORD_HASH;
	if (!ownerConfigured() || !hash) return false;
	const [, salt, expected] = hash.split(":");
	const actual = (await scryptAsync(password, salt, 64)) as Buffer;
	const nameA = createHash("sha256").update(username).digest();
	const nameB = createHash("sha256")
		.update(process.env.OWNER_USERNAME!)
		.digest();
	return (
		timingSafeEqual(actual, Buffer.from(expected, "hex")) &&
		timingSafeEqual(nameA, nameB)
	);
}
function tokenHash(token: string) {
	return createHash("sha256")
		.update(token)
		.update(process.env.OWNER_PASSWORD_HASH || "")
		.update(client.id)
		.digest("hex");
}
export function createSession() {
	const token = randomBytes(32).toString("hex");
	db()
		.prepare("INSERT INTO sessions(token_hash,expires) VALUES(?,?)")
		.run(tokenHash(token), Date.now() + sessionAge * 1000);
	return token;
}
export function sessionValid(token?: string) {
	if (!token || !/^[a-f0-9]{64}$/.test(token) || !ownerConfigured())
		return false;
	const database = db();
	database.prepare("DELETE FROM sessions WHERE expires<=?").run(Date.now());
	return !!database
		.prepare(
			"SELECT token_hash FROM sessions WHERE token_hash=? AND expires>?",
		)
		.get(tokenHash(token), Date.now());
}
export function destroySession(token?: string) {
	if (token)
		db()
			.prepare("DELETE FROM sessions WHERE token_hash=?")
			.run(tokenHash(token));
}
export async function isOwner() {
	return sessionValid((await cookies()).get(sessionCookie)?.value);
}
export const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict" as const,
	path: "/",
	maxAge: sessionAge,
};
