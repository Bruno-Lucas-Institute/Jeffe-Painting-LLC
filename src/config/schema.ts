import { z } from "zod";
import paletteDefaults from "./palette.json";
import contentDefaults from "./content-defaults.json";
import ownerDefaults from "./owner-defaults.json";
const text = z.string().min(1).max(10000);
const localAsset = z
	.string()
	.regex(/^\/(?!\/)[^?#]*$/, "Use an approved local asset path.");
const href = z
	.string()
	.refine(
		(value) => /^\/(?!\/)/.test(value) || /^https:\/\//.test(value),
		"Use a local path or HTTPS URL.",
	);
const copy = (defaults: Record<string, string>) =>
	z
		.record(z.string(), z.string())
		.refine(
			(value) =>
				Object.keys(defaults).every(
					(key) => typeof value[key] === "string",
				),
			"A required copy key is missing.",
		);
export const fieldSchema = z
	.object({
		id: z
			.string()
			.regex(/^[a-z][a-z0-9_]{1,39}$/)
			.refine(
				(id) =>
					![
						"service",
						"website",
						"__proto__",
						"constructor",
						"prototype",
					].includes(id),
			),
		label: text,
		type: z.enum([
			"text",
			"email",
			"tel",
			"textarea",
			"select",
			"date",
			"number",
		]),
		required: z.boolean(),
		minLength: z.number().int().min(0).max(4000).optional(),
		maxLength: z.number().int().min(1).max(4000).default(200),
		width: z.enum(["half", "full"]).default("half"),
		autoComplete: z.string().optional(),
		placeholder: z.string().optional(),
		options: z.array(z.object({ value: text, label: text })).optional(),
	})
	.superRefine((field, ctx) => {
		if (field.type === "select" && !field.options?.length)
			ctx.addIssue({
				code: "custom",
				message: "Select fields need options.",
			});
		if ((field.minLength || 0) > field.maxLength)
			ctx.addIssue({
				code: "custom",
				message: "Field length range is invalid.",
			});
	});
export const sectionSchema = z.enum([
	"hero",
	"trust",
	"services",
	"transformation",
	"projects",
	"process",
	"testimonials",
	"cta",
]);
const colors = z.string().regex(/^#[a-fA-F0-9]{6}$/);
export const businessSchema = z
	.object({
		legacyDatabaseId: z.string().default(""),
		privacy: z.object({
			title: text,
			reviewNotice: text,
			paragraphs: z.array(text).min(1),
		}),
		id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		industry: text,
		businessName: text,
		shortName: text,
		locale: text,
		demo: z.boolean(),
		description: text,
		logo: z.object({
			name: text,
			tagline: z.string(),
			mark: z.string().min(1).max(3),
			image: z.union([localAsset, z.literal("")]),
		}),
		phone: z.string(),
		phoneHref: z.string().regex(/^tel:[+0-9]+$/),
		email: z.email(),
		location: z.string(),
		serviceArea: z.string(),
		serviceTowns: z.array(z.string()),
		yearsExperience: z.number().nonnegative().nullable(),
		reviewRating: z.string().nullable(),
		reviewCount: z.string().nullable(),
		copyrightYear: z.number().int(),
		hours: z.array(z.object({ days: text, hours: text })),
		socialLinks: z.array(
			z.object({
				label: text,
				href: z.url().refine((url) => url.startsWith("https://")),
			}),
		),
		navigation: z.array(z.object({ label: text, href })),
		cta: z.object({ label: text, href, free: z.boolean() }),
		theme: z.object({
			sectionSpace: z.string().regex(/^\d+(px|rem)$/),
			containerWidth: z.string().regex(/^\d+(px|rem)$/),
			primary: colors,
			primaryDark: colors,
			paper: colors,
			paperDeep: colors,
			ink: colors,
			muted: colors,
			line: colors,
			forest: colors,
			white: colors,
			heading: z.enum(["outfit", "inter", "serif"]),
			body: z.enum(["inter", "serif"]),
			radius: z.string().regex(/^\d+(px|rem)$/),
			palette: z.record(
				z.string(),
				z.string().regex(/^#[a-fA-F0-9]{3,8}$/),
			),
		}),
		features: z.object({
			inquiry: z.boolean(),
			projects: z.boolean(),
			testimonials: z.boolean(),
			transformation: z.boolean(),
			experience: z.boolean(),
			areas: z.boolean(),
			owner: z.boolean(),
			push: z.boolean(),
		}),
		home: z.object({
			sections: z.array(sectionSchema).min(1),
			layout: z.enum(["editorial", "compact"]),
			heroImage: localAsset,
			heroAlt: text,
		}),
		transformation: z.object({
			before: localAsset,
			beforeAlt: text,
			after: localAsset,
			afterAlt: text,
		}),
		about: z.object({
			image: localAsset,
			imageAlt: text,
			imageLabel: z.string(),
		}),
		content: copy(contentDefaults),
		trust: z.array(z.object({ value: text, caption: text })),
		process: z.array(z.object({ title: text, description: text })),
		values: z.array(z.object({ title: text, description: text })),
		services: z
			.array(
				z.object({
					id: z.string().regex(/^[a-z0-9-]+$/),
					title: text,
					description: text,
					href,
					label: text,
					image: localAsset,
					imageAlt: text,
					bullets: z.array(text),
				}),
			)
			.min(1),
		projects: z.array(
			z.object({
				title: text,
				category: text,
				image: localAsset,
				imageAlt: text,
			}),
		),
		testimonials: z.array(
			z.object({ quote: text, name: text, location: z.string() }),
		),
		form: z.object({
			contactMethod: z.enum(["email", "phone", "either"]),
			fields: z.array(fieldSchema).min(2),
			serviceLabel: text,
			serviceRequired: z.boolean(),
			allowOther: z.boolean(),
			otherLabel: text,
			submitLabel: text,
			sendingLabel: text,
			successTitle: text,
			successMessage: text,
			closeLabel: text,
			note: text,
			errorSummary: text,
		}),
		owner: z.object({
			enabled: z.boolean(),
			locale: text,
			timezone: text,
			sessionDays: z.number().int().min(1).max(90),
			maxDevices: z.number().int().min(1).max(30),
			copy: copy(ownerDefaults),
			pushTitle: text,
			testTitle: text,
			testBody: text,
		}),
		seo: z.object({
			title: text,
			description: text,
			indexable: z.boolean(),
			socialImage: localAsset,
		}),
	})
	.superRefine((value, ctx) => {
		if (
			value.features.inquiry &&
			(!value.features.owner || !value.owner.enabled)
		)
			ctx.addIssue({
				code: "custom",
				message:
					"The built-in inbox needs owner access when inquiries are enabled.",
			});
		if (
			!Object.keys(paletteDefaults).every(
				(key) => value.theme.palette[key],
			)
		)
			ctx.addIssue({
				code: "custom",
				path: ["theme", "palette"],
				message: "A required decorative color is missing.",
			});
		const name = value.form.fields.find((field) => field.id === "name");
		if (!name?.required || name.type !== "text")
			ctx.addIssue({
				code: "custom",
				message: "Use a required text field for the customer name.",
			});
		for (const [id, type] of [
			["email", "email"],
			["phone", "tel"],
		]) {
			const field = value.form.fields.find((field) => field.id === id);
			if (field && field.type !== type)
				ctx.addIssue({
					code: "custom",
					message: `Use the ${type} type for ${id}.`,
				});
		}
		const ids = value.form.fields.map((f) => f.id);
		if (new Set(ids).size !== ids.length)
			ctx.addIssue({
				code: "custom",
				path: ["form", "fields"],
				message: "Field IDs must be unique.",
			});
		if (!ids.includes("name"))
			ctx.addIssue({
				code: "custom",
				message: "A name field is required.",
			});
		for (const method of value.form.contactMethod === "either"
			? []
			: [value.form.contactMethod])
			if (!ids.includes(method))
				ctx.addIssue({
					code: "custom",
					message: `The ${method} contact field is missing.`,
				});
		if (
			value.form.contactMethod === "either" &&
			!ids.includes("email") &&
			!ids.includes("phone")
		)
			ctx.addIssue({
				code: "custom",
				message: "At least one contact field is required.",
			});
		if (
			new Set(value.services.map((s) => s.id)).size !==
			value.services.length
		)
			ctx.addIssue({
				code: "custom",
				message: "Service IDs must be unique.",
			});
		if (!value.cta.free && /\bfree\b/i.test(value.cta.label))
			ctx.addIssue({
				code: "custom",
				path: ["cta"],
				message: "Free claims require explicit configuration.",
			});
		try {
			new Intl.DateTimeFormat(value.owner.locale, {
				timeZone: value.owner.timezone,
			});
			new Intl.DateTimeFormat(value.locale);
		} catch {
			ctx.addIssue({
				code: "custom",
				message: "Invalid locale or timezone.",
			});
		}
	});
export type BusinessConfig = z.infer<typeof businessSchema>;
export type InquiryField = z.infer<typeof fieldSchema>;
