import "server-only";
import { connection } from "next/server";
import { db } from "./store";
import {
	configuredClient,
	defaultSettings,
	settingsSchema,
	type BusinessSettings,
} from "../validation/settings";

export function readSettings(): BusinessSettings {
	const row = db()
		.prepare("SELECT payload FROM site_settings WHERE id=1")
		.get() as { payload: string } | undefined;
	return row
		? settingsSchema.parse(JSON.parse(row.payload))
		: defaultSettings;
}
export function saveSettings(input: unknown) {
	const settings = settingsSchema.parse(input);
	db()
		.prepare(
			"INSERT INTO site_settings(id,payload) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload",
		)
		.run(JSON.stringify(settings));
	return settings;
}
export async function getClient() {
	await connection();
	return configuredClient(readSettings());
}
