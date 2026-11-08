import { client } from "@/config/client";

export function TrustStrip() {
	return (
		<section
			aria-label="Why homeowners choose Jeffe Painting"
			className="trust-strip"
		>
			<div className="trust-item flex flex-col gap-[4px]">
				<strong>{client.reviewRating} / 5</strong>
				<span>{client.reviewCount} local reviews</span>
			</div>
			<span className="trust-divider w-[1px] h-[39px] bg-line" />
			<div className="trust-item flex flex-col gap-[4px]">
				<strong>Licensed &amp; insured</strong>
				<span>Peace of mind, start to finish</span>
			</div>
			<span className="trust-divider w-[1px] h-[39px] bg-line" />
			<div className="trust-item flex flex-col gap-[4px]">
				<strong>Locally owned</strong>
				<span>Danbury &amp; Fairfield County</span>
			</div>
		</section>
	);
}
