import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";
import { ActionIcon } from "./action-icon";
import { ExperienceSignature } from "./experience-signature";
import type { BusinessConfig } from "@/config/schema";
const c = client.content;
export function Lines({ text }: { text: string }) {
	return (
		<>
			{text.split("\n").map((line, index) => (
				<span className="heading-line" key={index}>
					{line}
				</span>
			))}
		</>
	);
}
export function PrimaryCTA({ light = false }: { light?: boolean }) {
	return (
		<Link
			className={`button ${light ? "button-light" : ""}`}
			href={client.cta.href}
		>
			{client.cta.label}
			<ActionIcon name="estimate" />
		</Link>
	);
}
export function PageHero({
	prefix,
}: {
	prefix: "servicesPage" | "projectsPage" | "about" | "contact";
}) {
	return (
		<section className="page-hero">
			<p className="eyebrow">
				<span className="eyebrow-line" />
				{c[prefix + "Eyebrow"]}
			</p>
			<h1>
				{c[prefix + "Title"]}
				<br />
				<em>{c[prefix + "Accent"]}</em>
			</h1>
			<p>{c[prefix + "Description"]}</p>
			<PrimaryCTA />
		</section>
	);
}
export function Conversion() {
	return (
		<section className="cta-section">
			<div>
				<p className="eyebrow eyebrow-light">
					<span className="eyebrow-line" />
					{c.ctaEyebrow}
				</p>
				<h2>
					<Lines text={c.ctaTitle} />
				</h2>
			</div>
			<div className="cta-actions">
				<PrimaryCTA light />
				{client.phone && (
					<a href={client.phoneHref}>
						<ActionIcon name="phone" />
						{c.preferCall} {client.phone}
					</a>
				)}
			</div>
		</section>
	);
}
export function ServiceCards() {
	return (
		<div className="service-grid">
			{client.services.map((service, index) => (
				<Link
					className="service-card"
					href={service.href}
					key={service.id}
				>
					<div className="service-card-image">
						<Image
							src={service.image}
							alt={service.imageAlt}
							fill
							sizes="(max-width:700px) 100vw, (max-width:1000px) 50vw, 25vw"
						/>
						<span className="image-index">
							{String(index + 1).padStart(2, "0")}
						</span>
					</div>
					<div className="service-card-copy">
						<span className="card-kicker">{service.label}</span>
						<h3>{service.title}</h3>
						<p>{service.description}</p>
						<span className="card-arrow" aria-hidden="true">
							↗
						</span>
					</div>
				</Link>
			))}
		</div>
	);
}
export function ProjectCards({
	limit = client.projects.length,
}: {
	limit?: number;
}) {
	return (
		<div className="project-grid">
			{client.projects.slice(0, limit).map((project, index) => (
				<Link
					className={`project-card project-card-${(index % 3) + 1}`}
					href="/projects"
					key={project.title}
				>
					<div className="project-card-image">
						<Image
							src={project.image}
							alt={project.imageAlt}
							fill
							sizes="(max-width:700px) 100vw, 33vw"
						/>
					</div>
					<div className="project-caption">
						<span>{project.category}</span>
						<h3>{project.title}</h3>
					</div>
					<span className="project-arrow" aria-hidden="true">
						↗
					</span>
				</Link>
			))}
		</div>
	);
}
export function Process() {
	return (
		<section className="section process-section">
			<div className="process-heading">
				<p className="eyebrow">
					<span className="eyebrow-line" />
					{c.processEyebrow}
				</p>
				<h2>
					{c.processTitle}
					<br />
					<em>{c.processAccent}</em>
				</h2>
				<p>{c.processDescription}</p>
			</div>
			<div className="process-steps">
				{client.process.map((step, index) => (
					<div className="process-step" key={step.title}>
						<span className="step-number">
							{String(index + 1).padStart(2, "0")}
						</span>
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
export function BusinessSection({
	type,
}: {
	type: BusinessConfig["home"]["sections"][number];
}) {
	switch (type) {
		case "hero":
			return (
				<section className="hero viewport-hero">
					<div className="hero-visual">
						<Image
							alt={client.home.heroAlt}
							className="hero-image"
							fill
							loading="eager"
							sizes="100vw"
							src={client.home.heroImage}
						/>
						<div className="hero-image-wash" />
					</div>
					<div className="hero-copy">
						<h1>
							{c.heroTitle}
							<br />
							<em>{c.heroAccent}</em>
						</h1>
						<p className="hero-description">{c.heroDescription}</p>
						<div className="hero-actions">
							<PrimaryCTA />
							{client.phone && (
								<a
									className="text-link"
									href={client.phoneHref}
								>
									<ActionIcon name="phone" />
									{c.callLabel} {client.phone}
								</a>
							)}
						</div>
						{client.reviewRating && client.reviewCount && (
							<div className="hero-proof">
								<span
									className="proof-stars"
									aria-label={client.reviewRating}
								>
									★★★★★
								</span>
								<span>
									{client.reviewRating} · {client.reviewCount}
								</span>
							</div>
						)}
					</div>
					{client.features.experience &&
						client.yearsExperience !== null && (
							<ExperienceSignature />
						)}
					<span className="hero-image-caption">{c.heroCaption}</span>
					<div className="hero-side-note">{c.heroSide}</div>
				</section>
			);
		case "trust":
			return (
				<section
					className="trust-strip"
					aria-label={client.businessName}
				>
					{client.trust.map((item, index) => (
						<div className="trust-item" key={index}>
							<strong>{item.value}</strong>
							<span>{item.caption}</span>
						</div>
					))}
				</section>
			);
		case "services":
			return (
				<section className="section section-services">
					<div className="section-heading">
						<div>
							<p className="eyebrow">
								<span className="eyebrow-line" />
								{c.servicesEyebrow}
							</p>
							<h2>
								<Lines text={c.servicesTitle} />
							</h2>
						</div>
						<div className="section-intro">
							<p>{c.servicesDescription}</p>
							<Link className="text-link" href="/services">
								{c.servicesLink}
								<ActionIcon name="arrow" />
							</Link>
						</div>
					</div>
					<ServiceCards />
				</section>
			);
		case "transformation":
			return (
				<section className="section transformation-section">
					<div className="transformation-copy">
						<p className="eyebrow">
							<span className="eyebrow-line" />
							{c.transformationEyebrow}
						</p>
						<h2>
							{c.transformationTitle}
							<br />
							<em>{c.transformationAccent}</em>
						</h2>
						<p>{c.transformationDescription}</p>
						<Link className="button button-light" href="/projects">
							{c.transformationLink}
							<ActionIcon name="gallery" />
						</Link>
					</div>
					<div className="transformation-images">
						<figure className="transformation-after">
							<Image
								alt={client.transformation.afterAlt}
								fill
								sizes="(max-width:760px) 100vw,40vw"
								src={client.transformation.after}
							/>
							<figcaption>{c.afterLabel}</figcaption>
						</figure>
						<figure className="transformation-before">
							<Image
								alt={client.transformation.beforeAlt}
								fill
								sizes="(max-width:760px) 50vw,20vw"
								src={client.transformation.before}
							/>
							<figcaption>{c.beforeLabel}</figcaption>
						</figure>
						<span className="transformation-stamp">
							<Lines text={c.transformationStamp} />
						</span>
					</div>
				</section>
			);
		case "projects":
			return (
				<section className="section projects-section">
					<div className="section-heading">
						<div>
							<p className="eyebrow">
								<span className="eyebrow-line" />
								{c.projectsEyebrow}
							</p>
							<h2>
								<Lines text={c.projectsTitle} />
							</h2>
						</div>
						<Link className="text-link" href="/projects">
							{c.projectsLink}
							<ActionIcon name="gallery" />
						</Link>
					</div>
					{client.projects.length ? (
						<ProjectCards limit={3} />
					) : (
						<p>{c.emptyProjects}</p>
					)}
				</section>
			);
		case "process":
			return <Process />;
		case "testimonials":
			return (
				<section className="section testimonials-section">
					<div className="testimonial-heading">
						<p className="eyebrow">
							<span className="eyebrow-line" />
							{c.testimonialsEyebrow}
						</p>
						<h2>
							<Lines text={c.testimonialsTitle} />
						</h2>
					</div>
					<div className="testimonial-cards">
						{client.testimonials.map((item) => (
							<figure
								className="testimonial-card"
								key={item.name}
							>
								<span className="quote-mark" aria-hidden="true">
									“
								</span>
								<blockquote>{item.quote}</blockquote>
								<figcaption>
									<strong>{item.name}</strong>
									<span>{item.location}</span>
								</figcaption>
							</figure>
						))}
					</div>
				</section>
			);
		case "cta":
			return <Conversion />;
	}
}
