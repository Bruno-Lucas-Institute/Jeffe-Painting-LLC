import test from "node:test";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL;
const password = process.env.TEST_ADMIN_PASSWORD;
if (!base || !password)
	throw new Error(
		"Set TEST_BASE_URL and TEST_ADMIN_PASSWORD for an isolated test server.",
	);
const send = (path, body, extra = {}) =>
	fetch(base + path, {
		method: "POST",
		headers: { Origin: base, "Content-Type": "application/json", ...extra },
		body: JSON.stringify(body),
	});
test("protected inbox, login, submission, retrieval and logout", async () => {
	assert.equal((await fetch(base + "/api/appointments")).status, 401);
	assert.equal(
		(await send("/api/auth", { name: "jef", password: "wrong" })).status,
		401,
	);
	assert.equal((await send("/api/appointments", {})).status, 400);
	assert.equal(
		(
			await fetch(base + "/api/appointments", {
				method: "POST",
				headers: { Origin: "https://untrusted.example" },
			})
		).status,
		403,
	);
	const login = await send("/api/auth", { name: "jef", password });
	assert.equal(login.status, 200);
	const cookie = login.headers.get("set-cookie").split(";")[0];
	assert.match(login.headers.get("set-cookie"), /HttpOnly/i);
	const data = {
		name: "Integration test",
		email: "integration@example.com",
		phone: "555-0100",
		town: "Danbury",
		service: "Interior painting",
		details: "Synthetic integration request",
	};
	assert.equal((await send("/api/appointments", data)).status, 201);
	const inbox = await fetch(base + "/api/appointments", {
		headers: { Cookie: cookie },
	});
	assert.equal(inbox.status, 200);
	assert.ok(
		(await inbox.json()).appointments.some(
			(item) => item.email === data.email,
		),
	);
	assert.equal(
		(
			await send(
				"/api/push",
				{
					endpoint: "http://127.0.0.1",
					keys: { auth: "x", p256dh: "x" },
				},
				{ Cookie: cookie },
			)
		).status,
		400,
	);
	assert.equal(
		(
			await fetch(base + "/api/auth", {
				method: "DELETE",
				headers: { Origin: base, Cookie: cookie },
			})
		).status,
		200,
	);
	assert.equal(
		(
			await fetch(base + "/api/appointments", {
				headers: { Cookie: cookie },
			})
		).status,
		401,
	);
});
