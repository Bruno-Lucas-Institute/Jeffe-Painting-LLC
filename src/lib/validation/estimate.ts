import { z } from "zod";
import { client } from "@/config/client";
const serviceTitles = new Set<string>([
	...client.services.map((service) => service.title),
	"Other painting project",
]);
export const estimateSchema = z.object({
	name: z.string().trim().min(2, "Please enter your name.").max(100),
	email: z.email("Please enter a valid email address.").max(200),
	phone: z
		.string()
		.trim()
		.min(7, "Please enter a phone number.")
		.max(30)
		.regex(/^[+()\d\s.\-]+$/, "Please enter a valid phone number."),
	town: z
		.string()
		.trim()
		.min(2, "Please enter your town or ZIP code.")
		.max(200),
	service: z
		.string()
		.refine(
			(value) => serviceTitles.has(value),
			"Please select a service.",
		),
	details: z
		.string()
		.trim()
		.min(10, "Tell us a little more (at least 10 characters).")
		.max(4000),
	website: z.string().max(200).default(""),
});
