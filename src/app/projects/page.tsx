import { ActionIcon } from "@/components/action-icon";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/config/client";

export const metadata: Metadata = {
	title: "Painting Project Gallery",
	description:
		"Browse painting, cabinet refinishing, and home refresh projects completed by Jeffe Painting across Danbury and Fairfield County, CT.",
};

export default function ProjectsPage() {
	return (
		<>
			<section className="page-hero">
				<p className="eyebrow">
					<span className="eyebrow-line" />{" "}
					Selected work · Fairfield County, CT
				</p>
				<h1>
					Real homes.
					<br />
					<em>Carefully refreshed.</em>
				</h1>
				<p>
					A look at some of the painting, cabinet refinishing, and
					detail work we have completed for local homeowners.
				</p>
				<Link className="text-link" href="/contact">
					Have a project in mind? <ActionIcon name="message" />
				</Link>
			</section>
			<section className="gallery-section">
				<div className="gallery-grid grid">
					{client.projects.map((project, index) => (
						<figure
							className={`gallery-card gallery-card-${index + 1}`}
							key={project.title}
						>
							<div className="gallery-image relative overflow-hidden bg-paper-deep">
								<Image
									src={project.image}
									alt={project.imageAlt}
									className="object-cover transition-transform duration-500"
									fill
									loading={index === 0 ? "eager" : "lazy"}
									sizes="(max-width:700px) 100vw,(max-width:1000px) 50vw,33vw"
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
				<p className="gallery-note">
					Every home and project is different. Ask us what is possible
					for yours.
				</p>
			</section>
			<section className="cta-section">
				<div>
					<p className="eyebrow eyebrow-light">
						<span className="eyebrow-line" />{" "}
						Your project could be next
					</p>
					<h2>
						Let&rsquo;s make your
						<br />
						home feel new again.
					</h2>
				</div>
				<div className="cta-actions flex items-start flex-col gap-[15px]">
					<Link className="button button-light" href="/contact">
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
