import { ActionIcon } from "@/components/action-icon";
import type { Metadata } from "next";
import Image from "next/image";
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
				<h1 className={pageHeroTitle}>
					Good people.
					<br />
					<em className={contentHeadingEm}>Work done with care.</em>
				</h1>
				<p className={pageHeroCopy}>
					Jeffe Painting is a local team built around a simple idea:
					treat every home with respect, and take pride in the work
					you leave behind.
				</p>
				<Link className={`button ${buttonStyles}`} href="/contact">
					Meet us at your home <ActionIcon name="calendar" />
				</Link>
			</section>

			<section className="grid grid-cols-[1fr_0.85fr] items-center gap-[9vw] px-[max(44px,calc((100vw-1200px)/2))] pb-26.25 max-[1000px]:gap-10 max-[760px]:grid-cols-1 max-[760px]:px-6.25 max-[760px]:pb-17.5">
				<div className="bg-paper-deep relative min-h-125 overflow-hidden">
					<Image
						alt="A carefully painted interior by Jeffe Painting"
						fill
						sizes="(max-width:760px) 100vw,48vw"
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
						<article
							className="border-t border-[#c8c6ba] pt-3.75"
							key={number}
						>
							<span className="text-2.75 text-brand-red font-bold tracking-widest">
								{number}
							</span>
							<h3 className="font-heading text-5.5 mt-2.25 mb-1.75 font-normal tracking-tight">
								{title}
							</h3>
							<p className="text-3 text-muted m-0 leading-[1.7]">
								{description}
							</p>
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

			<section className="flex justify-between gap-5 px-[max(44px,calc((100vw-1100px)/2))] py-14 text-center max-[700px]:flex-col max-[700px]:gap-7">
				<div>
					<strong className="font-heading text-9.5 text-brand-red block font-normal">
						{client.yearsExperience}
					</strong>
					<span className="text-2.75 text-muted">
						years of experience
					</span>
				</div>
				<div>
					<strong className="font-heading text-9.5 text-brand-red block font-normal">
						{client.reviewRating}
					</strong>
					<span className="text-2.75 text-muted">
						average local rating
					</span>
				</div>
				<div>
					<strong className="font-heading text-9.5 text-brand-red block font-normal">
						{client.location}
					</strong>
					<span className="text-2.75 text-muted">
						locally owned &amp; operated
					</span>
				</div>
			</section>

			<section className={ctaSection}>
				<div>
					<p className={`${eyebrow} mb-4.5 text-[#f0d7b3]`}>
						<span className="inline-block h-px w-6.25 bg-current" />{" "}
						Here when you&rsquo;re ready
					</p>
					<h2 className={ctaTitle}>
						Tell us what
						<br />
						you have in mind.
					</h2>
				</div>
				<div className={ctaActions}>
					<Link
						className={`button ${buttonStyles} ${lightButtonStyles}`}
						href="/contact"
					>
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
