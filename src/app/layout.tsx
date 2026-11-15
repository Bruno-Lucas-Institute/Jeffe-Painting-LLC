import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getClient } from "@/lib/owner/settings";
import { Suspense } from "react";
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
	themeColor: "#a82d27",
};
export async function generateMetadata(): Promise<Metadata> {
	const client = await getClient();
	return {
		manifest: "/manifest.webmanifest",
		appleWebApp: {
			capable: true,
			statusBarStyle: "default",
			title: client.shortName,
		},
		icons: { apple: "/icons/apple-touch-icon.png" },
		title: {
			default: `${client.businessName} | Painting in ${client.serviceArea}`,
			template: `%s | ${client.shortName}`,
		},
		description:
			"Interior and exterior painting, cabinet refinishing, and closet painting from Jefferson's trusted local team in Danbury and Fairfield County, Connecticut.",
	};
}
async function Header() {
	const client = await getClient();
	return <SiteHeader client={client} />;
}
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} ${outfit.variable}`}>
			<body>
				<Suspense>
					<Header />
				</Suspense>
				<main>
					<Suspense>{children}</Suspense>
				</main>
				<Suspense>
					<SiteFooter />
				</Suspense>
			</body>
		</html>
	);
}
