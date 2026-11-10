import type { BusinessConfig } from "@/config/schema";
export function homeSections(config: BusinessConfig) {
	return config.home.sections
		.filter((section) => section !== "projects" || config.features.projects)
		.filter(
			(section) =>
				section !== "testimonials" || config.features.testimonials,
		)
		.filter(
			(section) =>
				section !== "transformation" || config.features.transformation,
		);
}
export function visibleNavigation(config: BusinessConfig) {
	return config.navigation.filter(
		(item) => item.href !== "/projects" || config.features.projects,
	);
}
