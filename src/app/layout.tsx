import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { client } from "@/config/client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

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
		default: `${client.businessName}`,
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
			<body className="bg-background font-body text-3.75 text-foreground leading-[1.65] antialiased max-[760px]:text-sm">
				<SiteHeader />
				<main>{children}</main>
				<SiteFooter />
			</body>
		</html>
	);
}
