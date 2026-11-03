import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";
import { client } from "@/config/client";

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="footer-main">
				<div className="footer-brand">
					<Link className="wordmark wordmark-light" href="/">
						<BrandLogo />
					</Link>
					<p>
						Considered painting and refinishing for homes across{" "}
						{client.serviceArea}.
					</p>
					<div className="footer-socials">
						{client.socialLinks.map((social) => (
							<a
								href={social.href}
								key={social.label}
								rel="noreferrer"
								target="_blank"
							>
								{social.label}
							</a>
						))}
					</div>
				</div>

				<div className="footer-column">
					<h2>Explore</h2>
					<Link href="/services">Services</Link>
					<Link href="/projects">Our work</Link>
					<Link href="/about">About Jefferson</Link>
					<Link href="/contact">Request an estimate</Link>
				</div>

				<div className="footer-column">
					<h2>Get in touch</h2>
					<a href={client.phoneHref}>{client.phone}</a>
					<a href={`mailto:${client.email}`}>{client.email}</a>
					<span>
						{client.location}
						<br />
						Serving {client.serviceArea}
					</span>
				</div>
			</div>
			<div className="footer-bottom">
				<span>
					© {client.copyrightYear} {client.businessName}. All rights
					reserved.
				</span>
				<span>Made for homes that feel like yours.</span>
			</div>
		</footer>
	);
}
