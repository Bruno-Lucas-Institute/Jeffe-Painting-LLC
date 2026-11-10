import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { themeStyle } from "@/config/theme";
import { pageMetadata, siteOrigin } from "@/lib/seo";
import { client } from "@/config/client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "@/components/owner/owner.css";
import "./hero.css";
import "@/components/button-styles.css";

const inter = localFont({
	src: "./fonts/inter-variable.ttf",
	variable: "--font-inter",
	weight: "100 900",
	display: "swap",
});

const outfit = localFont({
	src: "./fonts/outfit-variable.ttf",
	variable: "--font-outfit",
	weight: "100 900",
	display: "swap",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: client.theme.primary,
};
export const metadata: Metadata = {
	manifest: "/manifest.webmanifest",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: client.shortName,
	},
	icons: { apple: "/apple-icon" },
	metadataBase: new URL(siteOrigin),
	...pageMetadata(client.seo.title, client.seo.description, "/"),
	title: { default: client.seo.title, template: `%s | ${client.shortName}` },
	robots: { index: client.seo.indexable, follow: client.seo.indexable },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			style={themeStyle(client)}
			lang={client.locale.split("-")[0]}
			className={`${inter.variable} ${outfit.variable}`}
		>
			<body>
				<a className="skip-link" href="#main-content">
					{client.content.skipLink}
				</a>
				{client.demo && (
					<div className="template-demo-notice">
						{client.content.demoNotice}
					</div>
				)}
				<SiteHeader />
				<main id="main-content">{children}</main>
				<SiteFooter />
			</body>
		</html>
	);
}
