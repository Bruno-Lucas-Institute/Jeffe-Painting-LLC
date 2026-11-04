import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { client } from "@/config/client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
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
	themeColor: "#293d34",
};

export const metadata: Metadata = {
	appleWebApp: {
		capable: true,
		title: "Jeffe Painting",
		statusBarStyle: "default",
	},
	icons: { apple: "/app-icon-192.png" },
	title: {
		default: `${client.businessName} | Painting in Danbury & Fairfield County, CT`,
		template: `%s | ${client.shortName}`,
	},
	description:
		"Interior and exterior painting, cabinet refinishing, and closet painting from Jefferson's trusted local team in Danbury and Fairfield County, Connecticut.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} ${outfit.variable}`}>
			<body>
				<SiteHeader />
				<main>{children}</main>
				<SiteFooter />
			</body>
		</html>
	);
}
