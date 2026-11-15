import { guard, json, readJson } from "@/lib/owner/http";
import { saveSettings } from "@/lib/owner/settings";
import { settingsSchema } from "@/lib/validation/settings";

export async function PUT(request: Request) {
	const blocked = await guard(request, true);
	if (blocked) return blocked;
	let input: unknown;
	try {
		input = await readJson(request, 24000);
	} catch {
		return json({ error: "Invalid settings request." }, 400);
	}
	const result = settingsSchema.safeParse(input);
	if (!result.success)
		return json(
			{
				error: result.error.issues
					.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
					.join("; "),
			},
			400,
		);
	try {
		return json({ settings: saveSettings(result.data) });
	} catch {
		return json(
			{ error: "Could not save settings. Please try again." },
			500,
		);
	}
}
