import { ActionIcon } from "@/components/action-icon";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";
import {
	eyebrow,
	section,
	sectionHeading,
	sectionTitle,
	textLink,
} from "@/app/styles";

export function Projects() {
	return (
		<section className={`${section} bg-paper`}>
			<div className={sectionHeading}>
				<div>
					<p className={eyebrow}>
						<span className="inline-block h-px w-6.25 bg-current" />{" "}
						A few favorites
					</p>
					<h2 className={sectionTitle}>
						Made with care.
						<br />
						Made to feel like home.
					</h2>
				</div>
				<Link className={textLink} href="/projects">
					View all projects <ActionIcon name="gallery" />
				</Link>
			</div>
			<div className="grid grid-cols-[1.1fr_0.9fr_1fr] gap-4.5 max-[1000px]:grid-cols-2 max-[700px]:grid-cols-1">
				{client.projects.slice(0, 3).map((project, index) => (
					<Link
						className={`group relative min-h-85 overflow-hidden bg-[#62675b] text-white after:absolute after:inset-[30%_0_0] after:bg-[linear-gradient(0deg,rgba(18,21,17,0.76),transparent)] after:content-[''] max-[700px]:min-h-70 ${index === 1 ? "mt-11.25 max-[700px]:mt-0" : index === 2 ? "mt-22 max-[700px]:mt-0" : ""}`}
						href="/projects"
						key={project.title}
					>
						<div className="absolute inset-0 overflow-hidden">
							<Image
								alt={project.imageAlt}
								className="object-cover brightness-[0.82] transition-transform duration-500 group-hover:scale-[1.035]"
								fill
								sizes="(max-width: 700px) 100vw, 33vw"
								src={project.image}
							/>
						</div>
						<div className="absolute right-6 bottom-6.25 left-6 z-2">
							<span className="text-2.25 font-bold tracking-[0.13em] text-[#e8c8b7] uppercase">
								{project.category}
							</span>
							<h3 className="font-heading text-5.5 mt-1.5 mb-0 font-normal">
								{project.title}
							</h3>
						</div>
						<span
							className="absolute top-4.5 right-4.5 z-2 grid h-8.75 w-8.75 place-items-center rounded-full border border-white/65"
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
