import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Jeffe Painting",
		short_name: "Jeffe",
		description: "Painting estimates and customer inbox",
		start_url: "/admin",
		display: "standalone",
		background_color: "#f7f5ef",
		theme_color: "#293d34",
		icons: [
			{ src: "/app-icon-192.png", sizes: "192x192", type: "image/png" },
			{
				src: "/app-icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}
