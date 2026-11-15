import { z } from "zod";
import { client } from "../../config/client";

const text = z.string().trim().min(1).max(160);
const url = z
	.string()
	.trim()
	.max(2000)
	.refine((value) => {
		if (!value) return true;
		try {
			return new URL(value).protocol === "https:";
		} catch {
			return false;
		}
	}, "Use an HTTPS URL.");
export const settingsSchema = z.object({
	businessName: text,
	shortName: text,
	logoName: text,
	logoTagline: z.string().trim().max(100),
	logoUrl: url,
	phone: z
		.string()
		.trim()
		.min(7)
		.max(40)
		.regex(/^[+\d\s().-]+$/),
	email: z.email().max(254),
	location: text,
	serviceArea: text,
	serviceTowns: z.array(text).min(1).max(50),
	yearsExperience: z.number().int().min(0).max(100),
	hours: z
		.array(z.object({ days: text, hours: text }))
		.min(1)
		.max(14),
	facebook: url,
	instagram: url,
});
export type BusinessSettings = z.infer<typeof settingsSchema>;
export const defaultSettings: BusinessSettings = {
	businessName: client.businessName,
	shortName: client.shortName,
	logoName: client.logo.name,
	logoTagline: client.logo.tagline,
	logoUrl: "",
	phone: client.phone,
	email: client.email,
	location: client.location,
	serviceArea: client.serviceArea,
	serviceTowns: [...client.serviceTowns],
	yearsExperience: client.yearsExperience,
	hours: client.hours.map((hour) => ({ ...hour })),
	facebook: client.socialLinks[0].href,
	instagram: client.socialLinks[1].href,
};
export function configuredClient(settings: BusinessSettings) {
	return {
		...client,
		...settings,
		logo: { name: settings.logoName, tagline: settings.logoTagline },
		phoneHref: `tel:${settings.phone.replace(/[^+\d]/g, "")}`,
		socialLinks: [
			{ label: "Facebook", href: settings.facebook },
			{ label: "Instagram", href: settings.instagram },
		].filter((link) => link.href),
	};
}
export type SiteClient = ReturnType<typeof configuredClient>;
