import { ActionIcon } from "@/components/action-icon";
import { buttonStyles, lightButtonStyles } from "@/components/button";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";
import {
	contentHeadingEm,
	ctaActions,
	ctaSection,
	ctaTitle,
	eyebrow,
	pageHero,
	pageHeroCopy,
	pageHeroTitle,
} from "@/app/styles";

export const metadata: Metadata = {
	title: "Painting Project Gallery",
	description:
		"Browse painting, cabinet refinishing, and home refresh projects completed by Jeffe Painting across Danbury and Fairfield County, CT.",
};

export default function ProjectsPage() {
	return (
		<>
			<section className={pageHero}>
				<p className={eyebrow}>
					<span className="inline-block h-px w-6.25 bg-current" />{" "}
					Selected work · Fairfield County, CT
				</p>
				<h1 className={pageHeroTitle}>
					Real homes.
					<br />
					<em className={contentHeadingEm}>Carefully refreshed.</em>
				</h1>
				<p className={pageHeroCopy}>
					A look at some of the painting, cabinet refinishing, and
					detail work we have completed for local homeowners.
				</p>
				<Link
					className="text-3.25 hover:text-brand-red inline-flex items-center gap-2.75 border-b border-current pb-0.75 font-semibold transition-colors duration-160"
					href="/contact"
				>
					Have a project in mind? <ActionIcon name="message" />
				</Link>
			</section>
			<section className="px-[max(44px,calc((100vw-1300px)/2))] pb-25 max-[760px]:px-6.25 max-[760px]:pb-17.5">
				<div className="grid grid-cols-3 gap-x-5 gap-y-8.75 max-[1000px]:grid-cols-2 max-[700px]:grid-cols-1">
					{client.projects.map((project, index) => (
						<figure className="m-0" key={project.title}>
							<div
								className={`bg-paper-deep relative overflow-hidden ${index % 3 === 1 ? "aspect-[0.98]" : "aspect-[1.15]"} max-[700px]:aspect-[1.15]`}
							>
								<Image
									alt={project.imageAlt}
									className="object-cover transition-transform duration-500"
									fill
									loading={index === 0 ? "eager" : "lazy"}
									sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
									src={project.image}
								/>
							</div>
							<figcaption className="flex flex-col gap-1.25 pt-3.5">
								<span className="text-2.25 text-brand-red font-bold tracking-[0.13em] uppercase">
									{project.category}
								</span>
								<strong className="font-heading text-5 font-normal">
									{project.title}
								</strong>
							</figcaption>
						</figure>
					))}
				</div>
				<p className="font-heading text-4.25 text-muted mt-12 mb-0 text-center">
					Every home and project is different. Ask us what is possible
					for yours.
				</p>
			</section>
			<section className={ctaSection}>
				<div>
					<p className={`${eyebrow} mb-4.5 text-[#f0d7b3]`}>
						<span className="inline-block h-px w-6.25 bg-current" />{" "}
						Your project could be next
					</p>
					<h2 className={ctaTitle}>
						Let&rsquo;s make your
						<br />
						home feel new again.
					</h2>
				</div>
				<div className={ctaActions}>
					<Link
						className={`button ${buttonStyles} ${lightButtonStyles}`}
						href="/contact"
					>
						Request a free estimate <ActionIcon name="estimate" />
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
