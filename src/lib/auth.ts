import {
	createHash,
	randomBytes,
	scryptSync,
	timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./store";

export const sessionCookie = "jeffe_session";
export const tokenHash = (value: string) =>
	createHash("sha256").update(value).digest("hex");
export function credentialsValid(name: unknown, password: unknown) {
	if (
		typeof name !== "string" ||
		typeof password !== "string" ||
		password.length > 200
	)
		return false;
	const expected = process.env.ADMIN_PASSWORD_HASH;
	if (!expected || !/^[a-f0-9]{128}$/.test(expected)) return false;
	const hash = scryptSync(password, "jeffe-admin-v1", 64);
	return (
		timingSafeEqual(hash, Buffer.from(expected, "hex")) &&
		name === (process.env.ADMIN_USERNAME || "jef")
	);
}
export function createSession() {
	const token = randomBytes(32).toString("hex");
	db().prepare("DELETE FROM sessions WHERE expires < ?").run(Date.now());
	db()
		.prepare("INSERT INTO sessions VALUES (?, ?)")
		.run(tokenHash(token), Date.now() + 30 * 86400000);
	return token;
}
export async function authenticated() {
	const token = (await cookies()).get(sessionCookie)?.value;
	if (!token) return false;
	return Boolean(
		db()
			.prepare(
				"SELECT token FROM sessions WHERE token = ? AND expires > ?",
			)
			.get(tokenHash(token), Date.now()),
	);
}
export function sameOrigin(request: Request) {
	const origin = request.headers.get("origin");
	if (!origin) return false;
	try {
		const expected = process.env.APP_ORIGIN;
		if (expected) return origin === new URL(expected).origin;
		const parsed = new URL(origin);
		return (
			["http:", "https:"].includes(parsed.protocol) &&
			parsed.host === request.headers.get("host")
		);
	} catch {
		return false;
	}
}
