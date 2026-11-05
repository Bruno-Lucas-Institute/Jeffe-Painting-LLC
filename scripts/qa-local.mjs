import assert from "node:assert/strict";
import { createInterface } from "node:readline/promises";
const input = createInterface({ input: process.stdin });
const password = await input.question("");
input.close();
const origin = "http://192.168.4.197:3000";
const headers = { "Content-Type": "application/json", origin };
async function check(path, expected, options) {
	const r = await fetch(origin + path, {
		signal: AbortSignal.timeout(20000),
		...options,
	});
	assert.equal(r.status, expected, path);
	console.log(path, r.status);
	return r;
}
// Request frontend assets with browser Origin/Referer headers, not just the HTML.
for (const pagePath of ["/login", "/contact"]) {
	const html = await (await check(pagePath, 200)).text();
	const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)/g)].map(
		(match) => match[1],
	);
	assert.ok(scripts.length > 0);
	for (const asset of scripts) {
		const response = await fetch(origin + asset, {
			headers: {
				origin,
				referer: origin + pagePath,
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
			},
		});
		assert.equal(response.status, 200, `Frontend asset blocked: ${asset}`);
		assert.match(response.headers.get("content-type") || "", /javascript/);
	}
	console.log(
		`${pagePath}: ${scripts.length} frontend scripts load over LAN`,
	);
	const external = await fetch(origin + scripts[0], {
		headers: { origin: "https://untrusted.example" },
	});
	assert.equal(
		external.status,
		403,
		"Unknown development origins must stay blocked",
	);
}
await check("/login", 200);
await check("/api/owner/inquiries", 401);
await check("/api/owner/login", 401, {
	method: "POST",
	headers,
	body: JSON.stringify({ username: "Jef", password: "incorrect" }),
});
const login = await check("/api/owner/login", 200, {
	method: "POST",
	headers,
	body: JSON.stringify({ username: "Jef", password }),
});
const cookie = login.headers.get("set-cookie").split(";")[0];
assert.ok(login.headers.get("set-cookie").includes("HttpOnly"));
const privateHeaders = { ...headers, cookie };
const page = await check("/owner", 200, { headers: { cookie } });
assert.ok((await page.text()).includes("Pedidos dos clientes"));
await check("/api/quote", 400, { method: "POST", headers, body: "{}" });
const id = crypto.randomUUID();
const name = `Local QA ${id}`;
const response = await check("/api/quote", 200, {
	method: "POST",
	headers,
	body: JSON.stringify({
		name,
		email: "local-qa@example.com",
		phone: "(202) 555-0147",
		town: "Danbury",
		service: "Interior painting",
		details:
			"Automated local integration test; not a real customer request.",
		website: "",
	}),
});
assert.equal((await response.json()).mode, "saved");
const data = await (
	await check("/api/owner/inquiries", 200, { headers: privateHeaders })
).json();
const item = data.items.find((x) => x.name === name);
assert.ok(item);
assert.equal(item.location, "Danbury");
assert.equal(item.service, "Interior painting");
await check("/api/owner/inquiries", 200, {
	method: "PATCH",
	headers: privateHeaders,
	body: JSON.stringify({ id: item.id }),
});
await check("/api/owner/push", 403, {
	method: "POST",
	headers: { ...privateHeaders, origin: "https://untrusted.example" },
	body: "{}",
});
await check("/manifest.webmanifest", 200);
await check("/sw.js", 200);
await check("/icons/icon-192.png", 200);
await check("/api/owner/logout", 200, {
	method: "POST",
	headers: privateHeaders,
	body: "{}",
});
await check("/api/owner/inquiries", 401, { headers: privateHeaders });
const local = await fetch("http://localhost:3000/api/owner/login", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		origin: "http://localhost:3000",
	},
	body: JSON.stringify({ username: "Jef", password }),
});
assert.equal(local.status, 200);
console.log("localhost login", local.status);
const localCookie = local.headers.get("set-cookie").split(";")[0];
await fetch("http://localhost:3000/api/owner/logout", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		origin: "http://localhost:3000",
		cookie: localCookie,
	},
	body: "{}",
});
// Remove only the generated request by its verified UUID and exact fixture identity.
const { DatabaseSync } = await import("node:sqlite");
const database = new DatabaseSync(
	(await import("node:url")).fileURLToPath(
		new URL("../.local-data/owner.sqlite", import.meta.url),
	),
);
const record = database
	.prepare("SELECT payload FROM inquiries WHERE id=?")
	.get(item.id);
const payload = JSON.parse(record.payload);
assert.equal(payload.name, name);
assert.equal(payload.email, "local-qa@example.com");
database.prepare("DELETE FROM push_jobs WHERE inquiry_id=?").run(item.id);
database.prepare("DELETE FROM inquiries WHERE id=?").run(item.id);
database.close();
console.log("LAN and localhost flows passed; generated QA request removed.");
