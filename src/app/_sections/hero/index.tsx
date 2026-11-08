import { ExperienceSignature } from "@/components/experience-signature";
import { ActionIcon } from "@/components/action-icon";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";

export function Hero() {
	return (
		<section className="hero viewport-hero">
			<div className="hero-visual">
				<Image
					alt=""
					className="hero-image"
					fill
					loading="eager"
					sizes="100vw"
					src="/images/hero-interior.webp"
				/>
				<div className="hero-image-wash" />
			</div>
			<div className="hero-copy">
				<h1>
					A fresh coat.
					<br />
					<em>A feeling of home.</em>
				</h1>
				<p className="hero-description">
					Thoughtful painting and refinishing, done with care for the
					home you love. Proudly serving homeowners across Fairfield
					County.
				</p>
				<div className="hero-actions">
					<Link className="button" href="/contact">
						Request a free estimate <ActionIcon name="estimate" />
					</Link>
					<a className="text-link" href={client.phoneHref}>
						<ActionIcon name="phone" /> Or call {client.phone}
					</a>
				</div>
				<div className="hero-proof">
					<span className="proof-stars" aria-label="5 out of 5 stars">
						★★★★★
					</span>
					<span>
						{client.reviewRating} from {client.reviewCount} local
						reviews
					</span>
				</div>
			</div>
			<ExperienceSignature />
			<span className="hero-image-caption">
				A little care goes a long way.
			</span>
			<div className="hero-side-note">
				JEFFE PAINTING · EST. DANBURY, CT
			</div>
		</section>
	);
}
