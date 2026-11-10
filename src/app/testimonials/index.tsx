import { client } from "@/config/client";

export function Testimonials() {
	return (
		<section className="section testimonials-section">
			<div className="testimonial-heading">
				<p className="eyebrow">
					<span className="eyebrow-line" />{" "}
					Kind words
				</p>
				<h2>
					Better homes.
					<br />
					Happier homeowners.
				</h2>
				<p className="review-summary flex items-center gap-[9px] text-muted text-[11px]">
					<span className="proof-stars text-[13px] whitespace-nowrap">
						★★★★★
					</span>
					<strong>{client.reviewRating}</strong> from{" "}
					{client.reviewCount} local reviews
				</p>
			</div>
			<div className="testimonial-cards grid gap-[17px]">
				{client.testimonials.map((testimonial) => (
					<figure
						className="testimonial-card relative flex min-h-[260px] m-0 flex-col bg-cream"
						key={testimonial.name}
					>
						<span
							className="text-brand-red font-heading text-[49px] leading-[0.8]"
							aria-hidden="true"
						>
							“
						</span>
						<blockquote>{testimonial.quote}</blockquote>
						<figcaption>
							<strong>{testimonial.name}</strong>
							<span>{testimonial.location}</span>
						</figcaption>
					</figure>
				))}
			</div>
		</section>
	);
}
