import { client } from "@/config/client";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
	client.privacy.title,
	`Data handling for ${client.businessName}`,
	"/privacy",
);
export default function Privacy() {
	return (
		<section className="page-hero privacy-copy">
			<p className="eyebrow">{client.businessName}</p>
			<h1>{client.privacy.title}</h1>
			<p>{client.privacy.reviewNotice}</p>
			{client.privacy.paragraphs.map((paragraph) => (
				<p key={paragraph}>{paragraph}</p>
			))}
			<a href={`mailto:${client.email}`}>{client.email}</a>
		</section>
	);
}
