import { ActionIcon } from "@/components/action-icon";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";

export const metadata: Metadata = {
	title: "Painting Services in Danbury, CT",
	description:
		"Explore interior and exterior painting, cabinet refinishing, and closet painting from Jeffe Painting in Danbury and Fairfield County, Connecticut.",
};

export default function ServicesPage() {
	return (
		<>
			<section className="page-hero">
				<p className="eyebrow">
					<span className="eyebrow-line" />{" "}
					Services · Danbury &amp; Fairfield County
				</p>
				<h1>
					Thoughtful work,
					<br />
					<em>beautifully finished.</em>
				</h1>
				<p>
					From a room that needs a reset to a kitchen ready for a new
					chapter, we bring experience, careful prep, and pride in the
					details.
				</p>
				<Link className="button" href="/contact">
					Tell us about your project <ActionIcon name="message" />
				</Link>
			</section>

			<section className="service-list-section">
				{client.services.map((service, index) => (
					<article
						className="service-detail"
						id={service.href.split("#")[1]}
						key={service.title}
					>
						<div className="service-detail-image relative min-h-[340px] overflow-hidden bg-paper-deep">
							<Image
								alt={service.imageAlt}
								fill
								loading={index === 0 ? "eager" : "lazy"}
								sizes="(max-width: 760px) 100vw, 50vw"
								src={service.image}
							/>
							<span className="image-index">
								0{index + 1}
							</span>
						</div>
						<div className="service-detail-copy">
							<p className="eyebrow">
								<span className="eyebrow-line" />{" "}
								{service.label}
							</p>
							<h2>{service.title}</h2>
							<p>{service.description}</p>
							<ul className="check-list flex p-0 flex-col gap-[8px] list-none text-[12px]">
								{[
									"Careful surface preparation",
									"Clear communication from start to finish",
									"Respectful, tidy work in your home",
								].map((item) => (
									<li key={item}>
										<span aria-hidden="true">✓</span> {item}
									</li>
								))}
							</ul>
							<Link className="text-link" href="/contact">
								Get an estimate <ActionIcon name="estimate" />
							</Link>
						</div>
					</article>
				))}
			</section>

			<section className="service-area-band">
				<div>
					<p className="eyebrow eyebrow-light">
						<span className="eyebrow-line" />{" "}
						Rooted in Danbury
					</p>
					<h2>
						Local work.
						<br />A personal touch.
					</h2>
				</div>
				<div className="service-area-copy">
					<p>
						Jeffe Painting is locally owned and operated in{" "}
						{client.location}, serving homeowners throughout{" "}
						{client.serviceArea}.
					</p>
					<p>{client.serviceTowns.join(" · ")}</p>
					<Link className="button button-light" href="/contact">
						Check availability <ActionIcon name="calendar" />
					</Link>
				</div>
			</section>
		</>
	);
}
