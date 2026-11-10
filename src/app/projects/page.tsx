import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/config/client";
import { PageHero, Conversion } from "@/components/business-sections";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
	client.content.projectsPageTitle,
	client.content.projectsPageDescription,
	"/projects",
);
export default function Projects() {
	if (!client.features.projects) notFound();
	return (
		<>
			<PageHero prefix="projectsPage" />
			<section className="gallery-section">
				<div className="gallery-grid grid">
					{client.projects.map((project, index) => (
						<figure
							className={`gallery-card gallery-card-${(index % 6) + 1}`}
							key={project.title}
						>
							<div className="gallery-image relative overflow-hidden bg-paper-deep">
								<Image
									src={project.image}
									alt={project.imageAlt}
									fill
									loading={index === 0 ? "eager" : "lazy"}
									sizes="(max-width:700px) 100vw,(max-width:1000px) 50vw,33vw"
								/>
							</div>
							<figcaption>
								<span>{project.category}</span>
								<strong>{project.title}</strong>
							</figcaption>
						</figure>
					))}
				</div>
				<p className="gallery-note">
					{client.projects.length
						? client.content.projectsNote
						: client.content.emptyProjects}
				</p>
			</section>
			<Conversion />
		</>
	);
}
