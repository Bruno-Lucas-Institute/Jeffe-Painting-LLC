import { test } from "node:test";
import assert from "node:assert/strict";
import { pushBlock, type PushEnvironment } from "../src/lib/push-capabilities";
const ready: PushEnvironment = {
	secure: true,
	apisAvailable: true,
	ios: false,
	installed: false,
	permission: "default",
};
test("HTTP on a phone is diagnosed before permission or API support", () => {
	assert.equal(
		pushBlock({ ...ready, secure: false, apisAvailable: false })?.kind,
		"https",
	);
});
test("iPhone needs the installed app before permission is requested", () => {
	assert.equal(
		pushBlock({ ...ready, ios: true, apisAvailable: false })?.kind,
		"install",
	);
	assert.equal(pushBlock({ ...ready, ios: true, installed: true }), null);
});
test("unsupported browsers and denied permissions have distinct next steps", () => {
	assert.equal(
		pushBlock({ ...ready, apisAvailable: false })?.kind,
		"unsupported",
	);
	assert.equal(pushBlock({ ...ready, permission: "denied" })?.kind, "denied");
});
test("secure supported devices can enroll without installing on Android", () => {
	assert.equal(pushBlock(ready), null);
	assert.equal(pushBlock({ ...ready, permission: "granted" }), null);
});
