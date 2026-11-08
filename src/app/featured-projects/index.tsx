import { ActionIcon } from "@/components/action-icon";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";

export function Projects() {
	return (
		<section className="section projects-section">
			<div className="section-heading">
				<div>
					<p className="eyebrow">
						<span className="eyebrow-line" />{" "}
						A few favorites
					</p>
					<h2>
						Made with care.
						<br />
						Made to feel like home.
					</h2>
				</div>
				<Link className="text-link" href="/projects">
					View all projects <ActionIcon name="gallery" />
				</Link>
			</div>
			<div className="project-grid">
				{client.projects.slice(0, 3).map((project, index) => (
					<Link
						className={`project-card project-card-${index + 1}`}
						href="/projects"
						key={project.title}
					>
						<div className="project-card-image absolute inset-0 overflow-hidden">
							<Image
								alt={project.imageAlt}
								fill
								sizes="(max-width: 700px) 100vw, 33vw"
								src={project.image}
							/>
						</div>
						<div className="project-caption absolute z-2 right-[24px] bottom-[25px] left-[24px]">
							<span>{project.category}</span>
							<h3>{project.title}</h3>
						</div>
						<span
							className="project-arrow absolute z-2 top-[18px] right-[18px] grid w-[35px] h-[35px] place-items-center"
							aria-hidden="true"
						>
							↗
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
