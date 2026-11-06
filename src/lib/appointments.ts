export const fields = [
	"name",
	"email",
	"phone",
	"town",
	"service",
	"details",
] as const;
export type AppointmentInput = Record<(typeof fields)[number], string>;
export type Appointment = AppointmentInput & { id: string; createdAt: string };
export function validateAppointment(value: unknown): AppointmentInput | null {
	if (!value || typeof value !== "object") return null;
	const input = value as Record<string, unknown>;
	const result = {} as AppointmentInput;
	for (const key of fields) {
		const field = input[key];
		if (
			typeof field !== "string" ||
			!field.trim() ||
			field.length > (key === "details" ? 5000 : 200)
		)
			return null;
		result[key] = field.trim();
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) return null;
	return result;
}
