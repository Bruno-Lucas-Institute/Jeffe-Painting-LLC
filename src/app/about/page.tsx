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
			<section className="page-hero">
				<p className="eyebrow">
					<span className="eyebrow-line" />{" "}
					A little about us
				</p>
				<h1>
					Good people.
					<br />
					<em>Work done with care.</em>
				</h1>
				<p>
					Jeffe Painting is a local team built around a simple idea:
					treat every home with respect, and take pride in the work
					you leave behind.
				</p>
				<Link className="button" href="/contact">
					Meet us at your home <ActionIcon name="calendar" />
				</Link>
			</section>

			<section className="about-story">
				<div className="about-image relative min-h-[500px] overflow-hidden bg-paper-deep">
					<Image
						src={client.about.image}
						alt={client.about.imageAlt}
						fill
						sizes="(max-width:760px) 100vw,48vw"
					/>
					<span className="image-index">
						{client.about.imageLabel}
						DANBURY, CONNECTICUT
					</span>
				</div>
				<div className="about-copy">
					<p className="eyebrow">
						{client.content.aboutStoryEyebrow}
						<span className="eyebrow-line" />{" "}
						Built on experience
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
					<p className="eyebrow">
						<span className="eyebrow-line" />{" "}
						What matters to us
					</p>
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
				<div className="values-grid grid">
					{[
						[
							"01",
							"Respect for your home",
							"We work neatly, protect the things around us, and leave the space cared for.",
						],
						[
							"02",
							"The prep is the work",
							"A lasting finish starts with patient surface preparation and attention to detail.",
						],
						[
							"03",
							"Straightforward communication",
							"Clear expectations and reliable scheduling help your project feel easier.",
						],
						[
							"04",
							"Pride in the finish",
							"We want every edge, surface, and room to feel considered when the job is done.",
						],
					].map(([number, title, description]) => (
						<article className="value-card pt-[15px]" key={number}>
							<span>{number}</span>
							<h3>{title}</h3>
							<p>{description}</p>
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

			<section className="about-facts">
				<div>
					<strong>{client.yearsExperience}</strong>
					<span>years of experience</span>
				</div>
				<div>
					<strong>{client.reviewRating}</strong>
					<span>average local rating</span>
				</div>
				<div>
					<strong>{client.location}</strong>
					<span>locally owned &amp; operated</span>
				</div>
			</section>

			<section className="cta-section">
				<div>
					<p className="eyebrow eyebrow-light">
						<span className="eyebrow-line" />{" "}
						Here when you&rsquo;re ready
					</p>
					<h2>
						Tell us what
						<br />
						you have in mind.
					</h2>
				</div>
				<div className="cta-actions flex items-start flex-col gap-[15px]">
					<Link className="button button-light" href="/contact">
						Start a conversation <ActionIcon name="message" />
					</Link>
					<a href={client.phoneHref}>
						<ActionIcon name="phone" /> Prefer to talk?{" "}
						{client.phone}
					</a>
				</div>
			</section>
		</>
	);
}
