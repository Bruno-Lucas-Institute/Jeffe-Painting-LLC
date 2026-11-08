import localFont from "next/font/local";
import { client } from "@/config/client";
import "./brand-logo.css";

const roundedLogo = localFont({
	src: "../app/fonts/nunito-variable.ttf",
	variable: "--font-logo-rounded",
	weight: "200 1000",
	display: "swap",
});

export function BrandLogo() {
	return (
		<span
			className={`jeffe-logo inline-flex w-[3.5em] flex-col items-stretch gap-[5px] font-body text-[40px] leading-[1] whitespace-nowrap ${roundedLogo.variable}`}
			aria-label={client.businessName}
			role="img"
		>
			<span
				className="flex justify-between font-heading font-black"
				aria-hidden="true"
			>
				{Array.from(client.logo.name).map((letter, index) => (
					<span key={index}>{letter}</span>
				))}
			</span>
			<span
				className="jeffe-logo-tagline flex justify-between text-[0.48em] font-bold"
				aria-hidden="true"
			>
				{Array.from(client.logo.tagline).map((letter, index) => (
					<span key={index}>{letter}</span>
				))}
			</span>
		</span>
	);
}
