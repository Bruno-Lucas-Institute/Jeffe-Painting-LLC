import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateSchema } from "../src/lib/validation/estimate";
import {
	sameOrigin,
	readJson,
	readFormOrJson,
	formFeedback,
} from "../src/lib/owner/http";
const valid = {
	name: "Sample Customer",
	email: "customer@example.com",
	phone: "(202) 555-0147",
	town: "Danbury",
	service: "Interior painting",
	details: "Please estimate our living room.",
	website: "",
};
test("the actual Jeffe form accepts configured services and validates all submitted fields", () => {
	assert.ok(estimateSchema.safeParse(valid).success);
	for (const patch of [
		{ email: "not-email" },
		{ phone: "" },
		{ town: "" },
		{ service: "unknown" },
		{ details: "short" },
	])
		assert.equal(
			estimateSchema.safeParse({ ...valid, ...patch }).success,
			false,
		);
});
test("LAN and localhost origins are explicit development exceptions only", () => {
	const previous = {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
		OWNER_DEV_ORIGINS: process.env.OWNER_DEV_ORIGINS,
	};
	Object.assign(process.env, {
		NODE_ENV: "development",
		NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
		OWNER_DEV_ORIGINS: "http://192.168.4.197:3000",
	});
	try {
		const request = (origin: string) =>
			new Request("http://localhost:3000/api/quote", {
				headers: { origin },
			});
		assert.equal(sameOrigin(request("http://localhost:3000")), true);
		assert.equal(sameOrigin(request("http://192.168.4.197:3000")), true);
		assert.equal(sameOrigin(request("https://untrusted.example")), false);
		Object.assign(process.env, { NODE_ENV: "production" });
		assert.equal(sameOrigin(request("http://192.168.4.197:3000")), false);
	} finally {
		for (const [key, value] of Object.entries(previous)) {
			if (value === undefined) delete process.env[key];
			else process.env[key] = value;
		}
	}
});
test("JSON reader rejects oversized bodies", async () => {
	const request = new Request("http://localhost/api/quote", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ value: "x".repeat(200) }),
	});
	await assert.rejects(readJson(request, 30));
});

test("native form POST is bounded and supported without JavaScript", async () => {
	const request = new Request("http://localhost/api/quote", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(valid),
	});
	assert.deepEqual(await readFormOrJson(request), valid);
	const tooLarge = new Request("http://localhost/api/quote", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: "name=" + "x".repeat(100),
	});
	await assert.rejects(readFormOrJson(tooLarge, 20));
});
test("native confirmation is visible HTML and escapes text", async () => {
	const response = formFeedback(
		"Solicitação enviada com sucesso!",
		"<script>bad()</script>",
	);
	assert.equal(response.status, 200);
	assert.match(response.headers.get("content-type") || "", /text\/html/);
	const html = await response.text();
	assert.ok(html.includes('role="alertdialog"'));
	assert.ok(html.includes("Solicitação enviada com sucesso!"));
	assert.ok(!html.includes("<script>bad()"));
	assert.ok(html.includes("&lt;script&gt;"));
});
