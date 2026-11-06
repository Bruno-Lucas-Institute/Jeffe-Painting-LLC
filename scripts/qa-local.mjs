import assert from "node:assert/strict";
import { createInterface } from "node:readline/promises";
import { client } from "../src/config/client.ts";
const origin =
	process.env.QA_ORIGIN ||
	process.env.NEXT_PUBLIC_SITE_URL ||
	"http://localhost:3000";
const input = createInterface({ input: process.stdin });
const password = await input.question("");
input.close();
const username = process.env.OWNER_USERNAME;
if (!username)
	throw new Error("Set OWNER_USERNAME in your private environment.");
for (const page of ["/", "/login", "/contact"]) {
	const response = await fetch(origin + page);
	assert.equal(response.status, 200);
	const html = await response.text();
	for (const match of html.matchAll(/<script[^>]*src="([^"]+)/g)) {
		const script = await fetch(new URL(match[1], origin), {
			headers: { origin, referer: origin + page },
		});
		assert.equal(script.status, 200, "Frontend script blocked");
	}
	console.log(page, "and frontend assets OK");
}
assert.equal((await fetch(origin + "/api/owner/inquiries")).status, 401);
const headers = { origin, "Content-Type": "application/json" };
const login = await fetch(origin + "/api/owner/login", {
	method: "POST",
	headers,
	body: JSON.stringify({ username, password }),
});
assert.equal(login.status, 200);
const cookie = login.headers.get("set-cookie").split(";")[0];
assert.equal(
	(await fetch(origin + "/api/owner/inquiries", { headers: { cookie } }))
		.status,
	200,
);
assert.equal(
	(
		await fetch(origin + "/api/owner/logout", {
			method: "POST",
			headers: { ...headers, cookie },
			body: "{}",
		})
	).status,
	200,
);
assert.equal(
	(await fetch(origin + "/api/owner/inquiries", { headers: { cookie } }))
		.status,
	401,
);
console.log(
	client.businessName +
		": owner session flow OK. No customer request was created.",
);
