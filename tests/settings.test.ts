import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { closeStore } from "../src/lib/owner/store";
import { readSettings, saveSettings } from "../src/lib/owner/settings";
import {
	configuredClient,
	defaultSettings,
	settingsSchema,
} from "../src/lib/validation/settings";
const folder = mkdtempSync(join(tmpdir(), "settings-tests-"));
process.env.OWNER_DATA_DIR = folder;
after(() => {
	closeStore();
	rmSync(folder, { recursive: true });
});
test("settings default to current branding and persist across connections", () => {
	assert.deepEqual(readSettings(), defaultSettings);
	const updated = {
		...defaultSettings,
		businessName: "New Painting",
		phone: "+1 (203) 555-0199",
		logoUrl: "https://example.com/logo.png",
		facebook: "",
	};
	saveSettings(updated);
	closeStore();
	assert.deepEqual(readSettings(), updated);
	const client = configuredClient(readSettings());
	assert.equal(client.businessName, updated.businessName);
	assert.equal(client.phoneHref, "tel:+12035550199");
	assert.equal(client.logoUrl, updated.logoUrl);
	assert.equal(client.socialLinks.length, 1);
	assert.equal(client.services[0].title, "Interior painting");
});
test("invalid settings cannot overwrite saved settings", () => {
	const before = readSettings();
	for (const patch of [
		{ email: "invalid" },
		{ logoUrl: "javascript:alert(1)" },
		{ facebook: "http://example.com" },
		{ yearsExperience: -1 },
		{ hours: [] },
		{ serviceTowns: [] },
		{ phone: "abcdefghi" },
		{ businessName: " " },
	]) {
		assert.equal(
			settingsSchema.safeParse({ ...before, ...patch }).success,
			false,
		);
		assert.throws(() => saveSettings({ ...before, ...patch }));
		assert.deepEqual(readSettings(), before);
	}
});

test("settings API rejects cross-origin changes before touching storage", async () => {
	const { PUT } = await import("../src/app/api/owner/settings/route");
	const before = readSettings();
	const response = await PUT(
		new Request("https://painting.example/api/owner/settings", {
			method: "PUT",
			headers: {
				Origin: "https://attacker.example",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...before,
				businessName: "Unauthorized change",
			}),
		}),
	);
	assert.equal(response.status, 403);
	assert.deepEqual(readSettings(), before);
});
