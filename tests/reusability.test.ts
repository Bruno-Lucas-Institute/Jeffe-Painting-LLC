import { test, after } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import {
	mkdtempSync,
	existsSync,
	readFileSync,
	readdirSync,
	rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join, sep } from "node:path";
import { businessSchema } from "../src/config/schema";
import { profiles } from "../src/config/profiles";
import { homeSections, visibleNavigation } from "../src/lib/composition";
import {
	createEstimateSchema,
	normalizeInquiry,
} from "../src/lib/validation/estimate";
import { assertDatabaseIdentity } from "../src/lib/owner/database-identity";
import { createClient } from "../scripts/new-client.mjs";
const painting = businessSchema.parse(profiles.jeffe);
const cleaning = businessSchema.parse(profiles.cleaning);
test("cleaning changes identity, theme, services, fields, composition, CTA, SEO and confirmation", () => {
	assert.notEqual(cleaning.businessName, painting.businessName);
	assert.notEqual(cleaning.theme.primary, painting.theme.primary);
	assert.notEqual(cleaning.theme.heading, painting.theme.heading);
	assert.notDeepEqual(homeSections(cleaning), homeSections(painting));
	assert.notEqual(cleaning.cta.label, painting.cta.label);
	assert.notEqual(cleaning.seo.title, painting.seo.title);
	assert.notEqual(cleaning.form.successTitle, painting.form.successTitle);
	assert.equal(
		cleaning.form.fields.some((f) => f.id === "phone"),
		false,
	);
	assert.ok(cleaning.form.fields.some((f) => f.id === "frequency"));
	assert.equal(
		visibleNavigation(cleaning).some((n) => n.href === "/projects"),
		false,
	);
});
test("cleaning validates its own choices and preserves custom answers in the inbox", () => {
	const schema = createEstimateSchema(cleaning);
	const raw = {
		name: "Sample Customer",
		email: "customer@example.com",
		town: "Example City",
		details: "A regular cleaning request.",
		service: "home-cleaning",
		frequency: "weekly",
		preferred_date: "2027-03-12",
		website: "",
		unapproved: "drop me",
	};
	const parsed = schema.parse(raw);
	assert.equal(parsed.unapproved, undefined);
	const inquiry = normalizeInquiry(parsed, cleaning);
	assert.equal(inquiry.fields.frequency, "weekly");
	assert.equal(inquiry.serviceLabel, "Home cleaning");
	assert.equal(
		schema.safeParse({ ...raw, frequency: "invalid" }).success,
		false,
	);
	assert.equal(
		schema.safeParse({ ...raw, preferred_date: "2027-02-30" }).success,
		false,
	);
	assert.equal(
		schema.safeParse({ ...raw, service: "interior" }).success,
		false,
	);
});
test("invalid duplicate fields, missing copy and unapproved free claims fail before build", () => {
	const duplicate = structuredClone(cleaning);
	duplicate.form.fields.push(duplicate.form.fields[0]);
	assert.equal(businessSchema.safeParse(duplicate).success, false);
	const missing = structuredClone(cleaning);
	delete missing.content.heroTitle;
	assert.equal(businessSchema.safeParse(missing).success, false);
	assert.equal(
		businessSchema.safeParse({
			...cleaning,
			cta: { ...cleaning.cta, label: "Free service", free: false },
		}).success,
		false,
	);
});
test("database identity rejects accidental cross-client reuse and unapproved legacy adoption", () => {
	const db = new DatabaseSync(":memory:");
	assertDatabaseIdentity(db, "business-one");
	assert.doesNotThrow(() => assertDatabaseIdentity(db, "business-one"));
	assert.throws(() => assertDatabaseIdentity(db, "business-two"));
	db.close();
	const legacy = new DatabaseSync(":memory:");
	legacy.exec(
		"CREATE TABLE inquiries(id TEXT);INSERT INTO inquiries VALUES('existing')",
	);
	assert.throws(() => assertDatabaseIdentity(legacy, "new-business"));
	assert.doesNotThrow(() =>
		assertDatabaseIdentity(legacy, "legacy-business", true),
	);
	assert.equal(
		(
			legacy.prepare("SELECT COUNT(*) AS count FROM inquiries").get() as {
				count: number;
			}
		).count,
		1,
	);
	legacy.close();
});
const folder = mkdtempSync(join(tmpdir(), "business-export-"));
after(() => {
	assert.ok(resolve(folder).startsWith(resolve(tmpdir()) + sep));
	rmSync(folder, { recursive: true, force: true });
});
test("new client export is independent and excludes prior clients, credentials, requests and build state", () => {
	const destination = join(folder, "garden-care");
	const result = createClient({
		id: "garden-care",
		name: "Garden Care",
		industry: "landscaping",
		destination,
	});
	assert.equal(result.id, "garden-care");
	for (const path of [
		".git",
		".env.local",
		".local-data",
		"node_modules",
		".next",
		"src/config/profiles/jeffe.json",
		"src/config/profiles/cleaning.json",
		"public/images/hero-interior.webp",
	])
		assert.equal(existsSync(join(destination, path)), false, path);
	const profile = businessSchema.parse(
		JSON.parse(
			readFileSync(
				join(destination, "src/config/profiles/current.json"),
				"utf8",
			),
		),
	);
	assert.equal(profile.businessName, "Garden Care");
	assert.ok(
		readFileSync(join(destination, "README.md"), "utf8").startsWith(
			"# Garden Care",
		),
	);
	assert.equal(profile.id, "garden-care");
	assert.equal(profile.demo, true);
	assert.equal(profile.testimonials.length, 0);
	assert.equal(profile.projects.length, 0);
	assert.ok(!JSON.stringify(profile).includes("jeffe8138"));
	assert.ok(
		existsSync(join(destination, "public/images/template/space.svg")),
	);
	assert.equal(
		readdirSync(join(destination, "src/config/profiles")).length,
		2,
	);
	assert.throws(() =>
		createClient({ id: "garden-care", name: "Overwrite", destination }),
	);
	assert.equal(
		JSON.parse(readFileSync(join(destination, "package.json"), "utf8"))
			.name,
		"garden-care",
	);
});
