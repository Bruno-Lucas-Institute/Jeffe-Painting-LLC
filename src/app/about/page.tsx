import Image from "next/image";
import { client } from "@/config/client";
import { PageHero, Conversion, Lines } from "@/components/business-sections";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
	client.content.aboutTitle,
	client.content.aboutDescription,
	"/about",
);
export default function About() {
	return (
		<>
			<PageHero prefix="about" />
			<section className="about-story">
				<div className="about-image">
					<Image
						src={client.about.image}
						alt={client.about.imageAlt}
						fill
						sizes="(max-width:760px) 100vw,48vw"
					/>
					<span className="image-index">
						{client.about.imageLabel}
					</span>
				</div>
				<div className="about-copy">
					<p className="eyebrow">
						{client.content.aboutStoryEyebrow}
					</p>
					<h2>
						{client.content.aboutStoryTitle}
						<br />
						<em>{client.content.aboutStoryAccent}</em>
					</h2>
					<p>{client.content.aboutStoryBody}</p>
					<p>{client.content.aboutStorySecond}</p>
				</div>
			</section>
			<section className="values-section">
				<div className="values-intro">
					<p className="eyebrow">{client.content.valuesEyebrow}</p>
					<h2>
						<Lines text={client.content.valuesTitle} />
					</h2>
				</div>
				<div className="values-grid">
					{client.values.map((value, index) => (
						<article className="value-card" key={value.title}>
							<span>{String(index + 1).padStart(2, "0")}</span>
							<h3>{value.title}</h3>
							<p>{value.description}</p>
						</article>
					))}
				</div>
			</section>
			{client.features.experience && client.yearsExperience !== null && (
				<section className="about-facts">
					<div>
						<strong>{client.yearsExperience}</strong>
						<span>{client.content.experienceCaption}</span>
					</div>
					<div>
						<strong>{client.location}</strong>
						<span>{client.serviceArea}</span>
					</div>
				</section>
			)}
			<Conversion />
		</>
	);
}
