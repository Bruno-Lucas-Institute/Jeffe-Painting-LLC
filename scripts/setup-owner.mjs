import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import webpush from "web-push";
const args = process.argv.slice(2);
const at = args.indexOf("--username");
const requested = at >= 0 ? args[at + 1] : undefined;
let env = existsSync(".env.local") ? readFileSync(".env.local", "utf8") : "";
const existing = env.match(/^OWNER_USERNAME=(.*)$/m)?.[1]?.trim();
const username = requested || existing;
if (
	!username ||
	!username.trim() ||
	username.includes("\n") ||
	username.length > 100
)
	throw new Error(
		"Supply --username OwnerName, or configure OWNER_USERNAME privately.",
	);
const input = createInterface({ input: process.stdin });
const password = await input.question(
	process.stdin.isTTY ? "Owner password (12+ characters): " : "",
);
input.close();
if (password.length < 12 || password.length > 256)
	throw new Error("Use a password between 12 and 256 characters.");
const salt = randomBytes(16).toString("hex");
const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
function set(key, value) {
	const expression = new RegExp(`^${key}=.*$`, "m");
	const line = `${key}=${value}`;
	env = expression.test(env)
		? env.replace(expression, () => line)
		: env + `\n${line}`;
}
set("OWNER_USERNAME", username.trim());
set("OWNER_PASSWORD_HASH", hash);
if (!/^NEXT_PUBLIC_SITE_URL=.+/m.test(env))
	set("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
if (!/^VAPID_PUBLIC_KEY=.+/m.test(env)) {
	const keys = webpush.generateVAPIDKeys();
	set("VAPID_PUBLIC_KEY", keys.publicKey);
	set("VAPID_PRIVATE_KEY", keys.privateKey);
}
if (!/^VAPID_SUBJECT=.+/m.test(env))
	set("VAPID_SUBJECT", "mailto:replace@example.com");
if (!/^PUSH_RETRY_SECRET=.+/m.test(env))
	set("PUSH_RETRY_SECRET", randomBytes(32).toString("hex"));
writeFileSync(".env.local", env.trim() + "\n", { mode: 0o600 });
console.log(
	"Owner configured. Only the salted password hash was saved to ignored .env.local. Set a real HTTPS origin and VAPID contact before launch.",
);
