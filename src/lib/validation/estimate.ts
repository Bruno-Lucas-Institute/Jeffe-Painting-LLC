import { z } from "zod";
import { client } from "@/config/client";
import type { BusinessConfig } from "@/config/schema";
export function createEstimateSchema(config: BusinessConfig) {
	const shape: Record<string, z.ZodType<string>> = {
		website: z.string().max(200).default(""),
		service: z
			.string()
			.default("")
			.refine(
				(value) =>
					(!config.form.serviceRequired && !value) ||
					config.services.some(
						(s) => s.id === value || s.title === value,
					) ||
					(config.form.allowOther && value === "other") ||
					(config.form.allowOther &&
						value === config.form.otherLabel),
				"Please select a service.",
			)
			.transform(
				(value) =>
					config.services.find((s) => s.title === value)?.id ||
					(value === config.form.otherLabel ? "other" : value),
			),
	};
	for (const field of config.form.fields) {
		let validator = z
			.string()
			.trim()
			.max(field.maxLength, `${field.label} is too long.`);
		if (field.required)
			validator = validator.min(
				Math.max(1, field.minLength || 0),
				`Please complete ${field.label.toLowerCase()}.`,
			);
		const minimum = field.required ? undefined : field.minLength;
		const fieldValidator = validator
			.refine(
				(value) => !value || !minimum || value.length >= minimum,
				`Please add more detail for ${field.label.toLowerCase()}.`,
			)
			.refine(
				(value) =>
					!value ||
					field.type !== "email" ||
					z.email().safeParse(value).success,
				"Please enter a valid email address.",
			)
			.refine(
				(value) =>
					!value ||
					field.type !== "tel" ||
					/^[+()\d\s.\-]{7,30}$/.test(value),
				"Please enter a valid phone number.",
			)
			.refine(
				(value) =>
					!value ||
					field.type !== "select" ||
					!!field.options?.some((option) => option.value === value),
				"Choose an available option.",
			)
			.refine(
				(value) =>
					!value ||
					field.type !== "number" ||
					Number.isFinite(Number(value)),
				"Please enter a valid number.",
			)
			.refine((value) => {
				if (!value || field.type !== "date") return true;
				const date = new Date(value);
				return (
					/^\d{4}-\d{2}-\d{2}$/.test(value) &&
					!Number.isNaN(date.valueOf()) &&
					date.toISOString().slice(0, 10) === value
				);
			}, "Please enter a valid date.");
		shape[field.id] = field.required
			? fieldValidator
			: fieldValidator.default("");
	}
	return z.object(shape).superRefine((data, context) => {
		const method = config.form.contactMethod;
		if (
			(method === "email" && !data.email) ||
			(method === "phone" && !data.phone) ||
			(method === "either" && !data.email && !data.phone)
		)
			context.addIssue({
				code: "custom",
				path: [method === "phone" ? "phone" : "email"],
				message:
					method === "either"
						? "Provide an email or phone number."
						: `Provide your ${method}.`,
			});
	});
}
export const estimateSchema = createEstimateSchema(client);
export function normalizeInquiry(
	data: Record<string, string>,
	config: BusinessConfig,
) {
	return {
		name: data.name,
		email: data.email || "",
		phone: data.phone || "",
		service: data.service,
		serviceLabel:
			config.services.find((service) => service.id === data.service)
				?.title ||
			(data.service === "other" ? config.form.otherLabel : data.service),
		message: data.details || "",
		location: data.town || data.location || "",
		fields: Object.fromEntries(
			config.form.fields
				.filter(
					(field) =>
						![
							"name",
							"email",
							"phone",
							"details",
							"town",
							"location",
						].includes(field.id),
				)
				.map((field) => [field.id, data[field.id] || ""]),
		),
	};
}
