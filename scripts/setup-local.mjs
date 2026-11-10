import { scryptSync } from "node:crypto";
import { writeFileSync, existsSync } from "node:fs";
import webpush from "web-push";
const password = process.env.JEFFE_ADMIN_PASSWORD;
if (!password)
	throw new Error("Set JEFFE_ADMIN_PASSWORD to the desired admin password.");
if (existsSync(".env.local"))
	throw new Error(".env.local already exists; refusing to overwrite it.");
const keys = webpush.generateVAPIDKeys();
writeFileSync(
	".env.local",
	`ADMIN_USERNAME=jef\nADMIN_PASSWORD_HASH=${scryptSync(password, "jeffe-admin-v1", 64).toString("hex")}\nDATABASE_PATH=data/jeffe.sqlite\nVAPID_PUBLIC_KEY=${keys.publicKey}\nVAPID_PRIVATE_KEY=${keys.privateKey}\nVAPID_SUBJECT=mailto:jeffe8138@gmail.com\n`,
	{ mode: 0o600 },
);
console.log("Local configuration created. Keep .env.local private.");
