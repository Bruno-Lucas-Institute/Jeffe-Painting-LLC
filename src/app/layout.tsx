import type { Metadata } from "next";
import { client } from "@/config/client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
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
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
