import { EstimateForm } from "@/components/estimate-form";
import { client } from "@/config/client";
import { PageHero, Lines } from "@/components/business-sections";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
	client.content.contactTitle,
	client.content.contactDescription,
	"/contact",
);
export default function Contact() {
	return (
		<>
			<PageHero prefix="contact" />
			<section className="contact-section">
				<div className="contact-form-panel">
					<div className="form-heading">
						<p className="eyebrow">{client.content.formEyebrow}</p>
						<h2>
							<Lines text={client.content.formTitle} />
						</h2>
						<p>{client.content.formDescription}</p>
					</div>
					<EstimateForm />
				</div>
				<aside className="contact-aside">
					<div className="contact-aside-block">
						<p className="eyebrow">
							{client.content.contactHeading}
						</p>
						{client.phone && (
							<a
								className="contact-detail"
								href={client.phoneHref}
							>
								{client.phone}
							</a>
						)}
						<a
							className="contact-detail"
							href={`mailto:${client.email}`}
						>
							{client.email}
						</a>
					</div>
					{client.features.areas && (
						<div className="contact-aside-block">
							<p className="eyebrow">
								{client.content.areasHeading}
							</p>
							<p>
								{client.location}
								<br />
								{client.serviceArea}
							</p>
							<p className="town-list">
								{client.serviceTowns.join(" · ")}
							</p>
						</div>
					)}
					<div className="contact-aside-block">
						<p className="eyebrow">{client.content.hoursHeading}</p>
						{client.hours.map((item) => (
							<div className="hours-row" key={item.days}>
								<span>{item.days}</span>
								<span>{item.hours}</span>
							</div>
						))}
					</div>
					<div className="contact-note">
						<p>{client.content.contactNote}</p>
					</div>
				</aside>
			</section>
		</>
	);
}
