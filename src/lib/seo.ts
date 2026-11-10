import type { Metadata } from "next";
import { client } from "@/config/client";
export const siteOrigin = (
	process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export function pageMetadata(
	title: string,
	description: string,
	path: string,
): Metadata {
	return {
		title,
		description,
		alternates: { canonical: path },
		openGraph: {
			title,
			description,
			url: path,
			siteName: client.businessName,
			locale: client.locale.replace("-", "_"),
			type: "website",
			images: [client.seo.socialImage],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [client.seo.socialImage],
		},
	};
}
