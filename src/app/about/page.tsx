import { ActionIcon } from "@/components/action-icon";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";

export const metadata: Metadata = {
	title: "About Jeffe Painting",
	description:
		"Meet the local painting team serving Danbury and Fairfield County, Connecticut, with 25 years of experience and a focus on careful work.",
};

export default function AboutPage() {
	return (
		<>
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
						alt="A carefully painted interior by Jeffe Painting"
						fill
						loading="eager"
						sizes="(max-width: 760px) 100vw, 48vw"
						src="/images/hero-interior.webp"
					/>
					<span className="image-index">
						DANBURY, CONNECTICUT
					</span>
				</div>
				<div className="about-copy">
					<p className="eyebrow">
						<span className="eyebrow-line" />{" "}
						Built on experience
					</p>
					<h2>
						A familiar face.
						<br />
						<em>A finish you can feel good about.</em>
					</h2>
					<p>
						With {client.yearsExperience} years in the trade,
						Jefferson and his crew understand that a painting
						project is about more than color. It is about how a home
						feels when the work is finished—and how it is treated
						along the way.
					</p>
					<p>
						From the first conversation through the final
						walkthrough, the focus stays on thoughtful preparation,
						dependable scheduling, and clean, careful work.
					</p>
					<Link className="text-link" href="/projects">
						Take a look at our work <ActionIcon name="gallery" />
					</Link>
				</div>
			</section>

			<section className="values-section">
				<div className="values-intro">
					<p className="eyebrow">
						<span className="eyebrow-line" />{" "}
						What matters to us
					</p>
					<h2>
						The kind of care
						<br />
						we&rsquo;d want at home.
					</h2>
				</div>
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
