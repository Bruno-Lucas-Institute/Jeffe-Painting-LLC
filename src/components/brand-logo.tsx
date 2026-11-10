import localFont from "next/font/local";
import { client } from "@/config/client";

const roundedLogo = localFont({
	src: "../app/fonts/nunito-variable.ttf",
	variable: "--font-logo-rounded",
	weight: "200 1000",
	display: "swap",
});

export function BrandLogo({ variant = "footer" }: { variant?: "header" | "footer" }) {
	return (
		<span
			className={`font-body inline-flex w-[3.5em] flex-col items-stretch leading-none whitespace-nowrap transition-[font-size] duration-200 ${variant === "header" ? "text-[2rem] text-[#bc0000] max-[760px]:text-[1.875rem]" : "text-cream gap-1.25 text-[2.5rem] max-[760px]:text-[2.125rem]"} ${roundedLogo.variable}`}
			aria-label={client.businessName}
			role="img"
		>
			<span className="font-heading flex justify-between font-black" aria-hidden="true">
				{Array.from(client.logo.name).map((letter, index) => (
					<span key={index}>{letter}</span>
				))}
			</span>
			<span
				className="flex justify-between font-[family-name:var(--font-logo-rounded),var(--sans)] text-[0.48em] font-bold whitespace-pre"
				aria-hidden="true"
			>
				{Array.from(client.logo.tagline).map((letter, index) => (
					<span key={index}>{letter}</span>
				))}
			</span>
		</span>
	);
}
