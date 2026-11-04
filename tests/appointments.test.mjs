import test from "node:test";
import assert from "node:assert/strict";
import { validateAppointment } from "../src/lib/appointments.ts";
const valid = {
	name: "Jane",
	email: "jane@example.com",
	phone: "555-0100",
	town: "Danbury",
	service: "Interior painting",
	details: "Paint living room",
};
test("accepts and trims a complete request", () => {
	assert.deepEqual(validateAppointment({ ...valid, name: " Jane " }), valid);
});
test("rejects missing, malformed and oversized input", () => {
	for (const value of [
		null,
		[],
		{},
		{ ...valid, email: "invalid" },
		{ ...valid, name: " " },
		{ ...valid, details: "x".repeat(5001) },
		{ ...valid, phone: 5 },
	])
		assert.equal(validateAppointment(value), null);
});
