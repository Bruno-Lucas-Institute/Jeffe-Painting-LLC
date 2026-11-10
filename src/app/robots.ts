import type { MetadataRoute } from "next";
import { client } from "@/config/client";
import { siteOrigin } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			disallow: client.seo.indexable
				? ["/owner", "/login", "/api/"]
				: "/",
		},
		sitemap: siteOrigin + "/sitemap.xml",
	};
}
