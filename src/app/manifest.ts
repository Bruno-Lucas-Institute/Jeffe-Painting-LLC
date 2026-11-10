import type { MetadataRoute } from "next";
import { client } from "@/config/client";
export default function manifest(): MetadataRoute.Manifest {
	return {
		id: "/",
		name: client.businessName,
		short_name: client.shortName,
		description: client.description,
		start_url: client.features.owner ? "/owner" : "/",
		scope: "/",
		display: "standalone",
		theme_color: client.theme.primary,
		background_color: client.theme.paper,
		lang: client.locale,
		icons: [
			{
				src: "/icon",
				sizes: "512x512",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icon",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}
