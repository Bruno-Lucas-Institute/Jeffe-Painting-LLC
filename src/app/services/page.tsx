import Image from "next/image";
import { client } from "@/config/client";
import { pageMetadata } from "@/lib/seo";
import {
	PageHero,
	Conversion,
	Lines,
	PrimaryCTA,
} from "@/components/business-sections";
export const metadata = pageMetadata(
	client.content.servicesPageTitle,
	client.content.servicesPageDescription,
	"/services",
);
export default function Services() {
	return (
		<>
			<PageHero prefix="servicesPage" />
			<section className="service-list-section">
				{client.services.map((service, index) => (
					<article
						className="service-detail"
						id={service.id}
						key={service.id}
					>
						<div className="service-detail-image relative min-h-[340px] overflow-hidden bg-paper-deep">
							<Image
								src={service.image}
								alt={service.imageAlt}
								fill
								loading={index === 0 ? "eager" : "lazy"}
								sizes="(max-width:760px) 100vw,50vw"
							/>
							<span className="image-index">
								{String(index + 1).padStart(2, "0")}
							</span>
						</div>
						<div className="service-detail-copy">
							<p className="eyebrow">{service.label}</p>
							<h2>{service.title}</h2>
							<p>{service.description}</p>
							<ul className="check-list">
								{service.bullets.map((item) => (
									<li key={item}>
										<span aria-hidden="true">✓</span>
										{item}
									</li>
								))}
							</ul>
							<PrimaryCTA />
						</div>
					</article>
				))}
			</section>
			{client.features.areas && (
				<section className="service-area-band">
					<div>
						<p className="eyebrow eyebrow-light">
							{client.content.areaEyebrow}
						</p>
						<h2>
							<Lines text={client.content.areaTitle} />
						</h2>
					</div>
					<div className="service-area-copy">
						<p>{client.content.areaDescription}</p>
						<p>{client.serviceTowns.join(" · ")}</p>
						<PrimaryCTA light />
					</div>
				</section>
			)}
			<Conversion />
		</>
	);
}
