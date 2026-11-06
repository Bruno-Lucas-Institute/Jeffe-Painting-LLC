import jeffe from "./jeffe.json";
import cleaning from "./cleaning.json";
import starter from "./starter.json";
export const profiles: Record<string, unknown> = { jeffe, cleaning, starter };
export const defaultProfile = "jeffe";
