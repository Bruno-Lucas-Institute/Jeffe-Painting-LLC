import Image from "next/image";
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
	if (client.logo.image)
		return (
			<Image
				src={client.logo.image}
				alt={client.businessName}
				width={180}
				height={60}
				className="custom-business-logo"
			/>
		);
	return (
		<span
			className={`business-logo ${roundedLogo.variable}`}
			aria-label={client.businessName}
			role="img"
		>
			<span className="business-logo-name" aria-hidden="true">
				{Array.from(client.logo.name).map((letter, index) => (
					<span key={index}>{letter}</span>
				))}
			</span>
			<span className="business-logo-tagline" aria-hidden="true">
				{Array.from(client.logo.tagline).map((letter, index) => (
					<span key={index}>{letter}</span>
				))}
			</span>
		</span>
	);
}
