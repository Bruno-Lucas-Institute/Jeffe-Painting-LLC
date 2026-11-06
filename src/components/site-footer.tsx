import Link from "next/link";
import { client } from "@/config/client";
import { visibleNavigation } from "@/lib/composition";
import { BrandLogo } from "./brand-logo";
export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="footer-main">
				<div className="footer-brand">
					<Link href="/" className="wordmark wordmark-light">
						<BrandLogo />
					</Link>
					<p>{client.content.footerDescription}</p>
					<div className="footer-socials">
						{client.socialLinks.map((social) => (
							<a
								key={social.href}
								href={social.href}
								target="_blank"
								rel="noreferrer"
							>
								{social.label}
							</a>
						))}
					</div>
				</div>
				<div className="footer-column">
					<h2>{client.content.footerExplore}</h2>
					{visibleNavigation(client).map((item) => (
						<Link key={item.href} href={item.href}>
							{item.label}
						</Link>
					))}
					<Link href="/privacy">{client.content.privacyLink}</Link>
				</div>
				<div className="footer-column">
					<h2>{client.content.footerContact}</h2>
					{client.phone && (
						<a href={client.phoneHref}>{client.phone}</a>
					)}
					<a href={`mailto:${client.email}`}>{client.email}</a>
					<span>
						{client.location}
						<br />
						{client.serviceArea}
					</span>
				</div>
			</div>
			<div className="footer-bottom">
				<span>
					© {client.copyrightYear} {client.businessName}.{" "}
					{client.content.footerRights}
				</span>
				<span>{client.content.footerTagline}</span>
			</div>
		</footer>
	);
}
