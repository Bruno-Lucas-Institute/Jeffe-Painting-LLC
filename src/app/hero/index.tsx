import { ExperienceSignature } from "@/components/experience-signature";
import { ActionIcon } from "@/components/action-icon";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";

export function Hero() {
	return (
		<section className="hero viewport-hero">
			<div className="hero-visual absolute z-0 inset-0 overflow-hidden">
				<Image
					alt=""
					className="hero-image object-center"
					fill
					loading="eager"
					sizes="100vw"
					src="/images/hero-interior.webp"
				/>
				<div className="hero-image-wash absolute z-1 inset-0" />
			</div>
			<div className="hero-copy">
				<h1>
					A fresh coat.
					<br />
					<em>A feeling of home.</em>
				</h1>
				<p className="hero-description max-w-[430px] text-[15px] leading-[1.8]">
					Thoughtful painting and refinishing, done with care for the
					home you love. Proudly serving homeowners across Fairfield
					County.
				</p>
				<div className="hero-actions flex items-center gap-[25px]">
					<Link className="button" href="/contact">
						Request a free estimate <ActionIcon name="estimate" />
					</Link>
					<a className="text-link" href={client.phoneHref}>
						<ActionIcon name="phone" /> Or call {client.phone}
					</a>
				</div>
				<div className="hero-proof flex mt-[40px] items-center gap-[13px] text-[12px]">
					<span
						className="proof-stars text-[13px] whitespace-nowrap"
						aria-label="5 out of 5 stars"
					>
						★★★★★
					</span>
					<span>
						{client.reviewRating} from {client.reviewCount} local
						reviews
					</span>
				</div>
			</div>
			<ExperienceSignature />
			<span className="hero-image-caption absolute z-2 bottom-[34px] text-white font-heading text-[18px] not-italic">
				A little care goes a long way.
			</span>
			<div className="hero-side-note absolute z-2 right-[17px] bottom-[205px] text-[8px]">
				JEFFE PAINTING · EST. DANBURY, CT
			</div>
		</section>
	);
}
