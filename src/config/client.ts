import { profiles, defaultProfile } from "./profiles";
import { businessSchema } from "./schema";
export const profileName =
	process.env.NEXT_PUBLIC_CLIENT_PROFILE || defaultProfile;
if (!profiles[profileName])
	throw new Error(`Unknown client profile: ${profileName}`);
export const client = businessSchema.parse(profiles[profileName]);
export const ownerCopy = client.owner.copy;
export function pageEnabled(page: string) {
	return page !== "projects" || client.features.projects;
}
