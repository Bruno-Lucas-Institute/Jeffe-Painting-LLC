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
    <span className={`jeffe-logo ${roundedLogo.variable}`} aria-label={client.businessName} role="img">
      <span className="jeffe-logo-name" aria-hidden="true">
        {Array.from(client.logo.name).map((letter, index) => (
          <span key={index}>{letter}</span>
        ))}
      </span>
      <span className="jeffe-logo-tagline" aria-hidden="true">
        {Array.from(client.logo.tagline).map((letter, index) => (
          <span key={index}>{letter}</span>
        ))}
      </span>
    </span>
  );
}
