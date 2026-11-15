import type { MetadataRoute } from "next";
import { getClient } from "@/lib/owner/settings";
export default async function manifest(): Promise<MetadataRoute.Manifest> {
	const client = await getClient();
	return {
		id: "/",
		name: client.businessName,
		short_name: client.shortName,
		start_url: "/owner",
		scope: "/",
		display: "standalone",
		theme_color: "#a82d27",
		background_color: "#f7f5ef",
		icons: [
			{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
			{
				src: "/icons/maskable-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}
