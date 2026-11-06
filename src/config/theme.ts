import type { CSSProperties } from "react";
import type { BusinessConfig } from "./schema";
export function themeStyle(config: BusinessConfig): CSSProperties {
	const t = config.theme;
	const heading =
		t.heading === "serif"
			? 'Georgia, "Times New Roman", serif'
			: t.heading === "inter"
				? "var(--font-inter), Arial, sans-serif"
				: "var(--font-outfit), Arial, sans-serif";
	return {
		"--red": t.primary,
		"--red-dark": t.primaryDark,
		"--primary": t.primary,
		"--paper": t.paper,
		"--paper-deep": t.paperDeep,
		"--ink": t.ink,
		"--muted": t.muted,
		"--line": t.line,
		"--forest": t.forest,
		"--white": t.white,
		"--heading": heading,
		"--sans":
			t.body === "serif"
				? "Georgia, serif"
				: "var(--font-inter), Arial, sans-serif",
		"--radius": t.radius,
		"--section-space": t.sectionSpace,
		"--container-width": t.containerWidth,
		...Object.fromEntries(
			Object.entries(t.palette).map(([key, value]) => [
				`--tone-${key}`,
				value,
			]),
		),
	} as CSSProperties;
}
