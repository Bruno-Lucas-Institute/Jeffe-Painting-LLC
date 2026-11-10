import type { MetadataRoute } from "next";
import { client } from "@/config/client";
import { siteOrigin } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		"",
		"/services",
		"/about",
		"/contact",
		"/privacy",
		...(client.features.projects ? ["/projects"] : []),
	].map((path) => ({ url: siteOrigin.replace(/\/$/, "") + path }));
}
