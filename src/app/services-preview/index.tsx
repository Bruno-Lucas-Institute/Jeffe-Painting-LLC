import { ActionIcon } from "@/components/action-icon";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";

export function Services() {
	return (
		<section className="section section-services">
			<div className="section-heading">
				<div>
					<p className="eyebrow">
						<span className="eyebrow-line" />{" "}
						What we do
					</p>
					<h2>
						Good work lives
						<br />
						in the details.
					</h2>
				</div>
				<div className="section-intro max-w-[365px]">
					<p>
						From a single room to a full exterior refresh, we bring
						the same careful preparation and pride in the finish to
						every project.
					</p>
					<Link className="text-link" href="/services">
						Explore all services <ActionIcon name="arrow" />
					</Link>
				</div>
			</div>
			<div className="service-grid grid grid-cols-4 gap-[18px]">
				{client.services.map((service, index) => (
					<Link
						className="service-card"
						href={service.href}
						key={service.title}
					>
						<div className="service-card-image relative overflow-hidden bg-paper-deep">
							<Image
								alt={service.imageAlt}
								fill
								sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 25vw"
								src={service.image}
							/>
							<span className="image-index">
								0{index + 1}
							</span>
						</div>
						<div className="service-card-copy relative min-h-[216px]">
							<span className="card-kicker">{service.label}</span>
							<h3>{service.title}</h3>
							<p>{service.description}</p>
							<span
								className="absolute right-[20px] bottom-[17px] text-brand-red text-[17px]"
								aria-hidden="true"
							>
								↗
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
