import { client } from "@/config/client";

export function TrustStrip() {
	return (
		<section
			aria-label="Why homeowners choose Jeffe Painting"
			className="trust-strip"
		>
			<div className="trust-item">
				<strong>{client.reviewRating} / 5</strong>
				<span>{client.reviewCount} local reviews</span>
			</div>
			<span className="trust-divider" />
			<div className="trust-item">
				<strong>Licensed &amp; insured</strong>
				<span>Peace of mind, start to finish</span>
			</div>
			<span className="trust-divider" />
			<div className="trust-item">
				<strong>Locally owned</strong>
				<span>Danbury &amp; Fairfield County</span>
			</div>
		</section>
	);
}
