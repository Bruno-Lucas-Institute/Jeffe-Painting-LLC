import { test } from "node:test";
import assert from "node:assert/strict";
import { client } from "../src/config/client";
import { estimateSchema } from "../src/lib/validation/estimate";
import {
	sameOrigin,
	readJson,
	readFormOrJson,
	formFeedback,
} from "../src/lib/owner/http";
export function sample() {
	const data: Record<string, string> = {
		website: "",
		service: client.services[0].id,
	};
	for (const field of client.form.fields)
		data[field.id] =
			field.type === "email"
				? "customer@example.com"
				: field.type === "tel"
					? "2025550147"
					: field.type === "date"
						? "2027-03-12"
						: field.type === "number"
							? "100"
							: field.type === "select"
								? field.options![0].value
								: "Sample customer request details";
	return data;
}
test("active business fields and services are validated", () => {
	const valid = sample();
	assert.ok(estimateSchema.safeParse(valid).success);
	assert.equal(
		estimateSchema.safeParse({ ...valid, service: "not-a-service" })
			.success,
		false,
	);
	assert.equal(
		estimateSchema.safeParse({ ...valid, email: "invalid" }).success,
		false,
	);
});
test("LAN origins are allowed only in development", () => {
	const previous = {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
		OWNER_DEV_ORIGINS: process.env.OWNER_DEV_ORIGINS,
	};
	Object.assign(process.env, {
		NODE_ENV: "development",
		NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
		OWNER_DEV_ORIGINS: "http://192.168.1.10:3000",
	});
	try {
		const request = (origin: string) =>
			new Request("http://localhost/api/quote", { headers: { origin } });
		assert.equal(sameOrigin(request("http://192.168.1.10:3000")), true);
		assert.equal(sameOrigin(request("https://untrusted.example")), false);
		Object.assign(process.env, { NODE_ENV: "production" });
		assert.equal(sameOrigin(request("http://192.168.1.10:3000")), false);
	} finally {
		for (const [key, value] of Object.entries(previous))
			if (value === undefined) delete process.env[key];
			else process.env[key] = value;
	}
});
test("bounded JSON and native POST support", async () => {
	const body = sample();
	assert.deepEqual(
		await readFormOrJson(
			new Request("http://localhost/api/quote", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams(body),
			}),
		),
		body,
	);
	await assert.rejects(
		readJson(
			new Request("http://localhost/api/quote", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: "x".repeat(100) }),
			}),
			10,
		),
	);
});
test("native feedback is branded HTML and escapes text", async () => {
	const response = formFeedback(
		client.form.successTitle,
		"<script>bad()</script>",
	);
	const html = await response.text();
	assert.ok(html.includes('role="alertdialog"'));
	assert.ok(!html.includes("<script>bad()"));
	assert.ok(html.includes("&lt;script&gt;"));
	assert.ok(html.includes(client.theme.primary));
});

test("required fields cannot be skipped by omitting JSON properties", () => {
	const valid = sample();
	for (const field of client.form.fields.filter((field) => field.required)) {
		const missing = { ...valid };
		delete missing[field.id];
		assert.equal(
			estimateSchema.safeParse(missing).success,
			false,
			field.id,
		);
	}
});
