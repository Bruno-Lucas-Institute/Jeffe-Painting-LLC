import { client } from "@/config/client";

export function Testimonials() {
	return (
		<section className="section testimonials-section">
			<div className="testimonial-heading">
				<p className="eyebrow">
					<span className="eyebrow-line" /> Kind words
				</p>
				<h2>
					Better homes.
					<br />
					Happier homeowners.
				</h2>
				<p className="review-summary">
					<span className="proof-stars">★★★★★</span>
					<strong>{client.reviewRating}</strong> from{" "}
					{client.reviewCount} local reviews
				</p>
			</div>
			<div className="testimonial-cards">
				{client.testimonials.map((testimonial) => (
					<figure className="testimonial-card" key={testimonial.name}>
						<span className="quote-mark" aria-hidden="true">
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
