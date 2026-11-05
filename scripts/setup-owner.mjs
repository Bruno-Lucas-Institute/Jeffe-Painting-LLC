import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import webpush from "web-push";
// Password arrives through stdin, never command-line arguments or tracked files.
const input = createInterface({ input: process.stdin });
const password = await input.question("");
input.close();
if (password.length < 12)
	throw new Error("Use a password with at least 12 characters.");
const salt = randomBytes(16).toString("hex");
const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
let env = existsSync(".env.local") ? readFileSync(".env.local", "utf8") : "";
function set(key, value) {
	const line = `${key}=${value}`;
	const expression = new RegExp(`^${key}=.*$`, "m");
	env = expression.test(env)
		? env.replace(expression, line)
		: env + `\n${line}`;
}
set("OWNER_USERNAME", "Jef");
set("OWNER_PASSWORD_HASH", hash);
set("OWNER_DATA_DIR", ".local-data");
if (!/^NEXT_PUBLIC_SITE_URL=/m.test(env))
	set("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
if (!/^VAPID_PUBLIC_KEY=.+/m.test(env)) {
	const keys = webpush.generateVAPIDKeys();
	set("VAPID_PUBLIC_KEY", keys.publicKey);
	set("VAPID_PRIVATE_KEY", keys.privateKey);
}
if (!/^VAPID_SUBJECT=.+/m.test(env))
	set("VAPID_SUBJECT", "https://example.com");
if (!/^PUSH_RETRY_SECRET=.+/m.test(env))
	set("PUSH_RETRY_SECRET", randomBytes(32).toString("hex"));
set("QUOTE_MODE", "owner");
writeFileSync(".env.local", env.trim() + "\n", { mode: 0o600 });
console.log(
	"Owner configured. Secrets written only to ignored .env.local. Set the real HTTPS origin and VAPID contact before deployment.",
);
