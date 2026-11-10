import { ActionIcon } from "@/components/action-icon";
import { ExperienceSignature } from "@/components/experience-signature";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";
import { buttonStyles } from "@/components/button";
import { TrustStrip } from "../trust-strip";

export function Hero() {
	return (
		<section className="relative grid min-h-[calc(100svh-89px)] grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-[#232b25] max-[760px]:min-h-[calc(100svh-73px)] max-[760px]:grid-rows-[minmax(0,1fr)_auto_auto]">
			<div className="absolute inset-0 z-0 overflow-hidden bg-[#232b25]">
				<Image
					alt=""
					className="object-cover object-center transition-transform duration-500 ease-in-out"
					fill
					loading="eager"
					sizes="100vw"
					src="/images/hero-interior.webp"
				/>
				<div className="absolute inset-0 z-1 bg-[linear-gradient(90deg,rgba(24,30,25,0.86)_0%,rgba(24,30,25,0.68)_43%,rgba(24,30,25,0.28)_100%),linear-gradient(0deg,rgba(20,24,21,0.38),transparent_48%)] max-[760px]:bg-[linear-gradient(90deg,rgba(24,30,25,0.78),rgba(24,30,25,0.5)),linear-gradient(0deg,rgba(20,24,21,0.45),transparent_60%)]" />
			</div>
			<div className="text-cream relative z-10 flex min-h-0 w-[72%] max-w-210 flex-col items-start justify-center pt-[clamp(32px,6svh,80px)] pr-[5.5vw] pb-24 pl-[max(44px,calc((100vw-1440px)/2))] max-[760px]:w-full max-[760px]:pt-[clamp(28px,5svh,48px)] max-[760px]:pr-6.25 max-[760px]:pb-0 max-[760px]:pl-6.25 min-[761px]:max-[1050px]:pl-10">
				<h1 className="font-heading m-0 text-[clamp(50px,5.4vw,78px)] leading-[0.99] font-normal tracking-[-0.065em] max-[760px]:text-[clamp(48px,13vw,70px)]">
					A fresh coat.
					<br />
					<em className="text-[#f0d7b3] not-italic">
						A feeling of home.
					</em>
				</h1>
				<p className="text-3.75 text-cream/85 mt-7 mb-7.5 max-w-107.5 leading-[1.8] max-[760px]:mt-5 max-[760px]:mb-6 max-[760px]:max-w-125 max-[760px]:text-sm">
					Thoughtful painting and refinishing, done with care for the
					home you love. Proudly serving homeowners across Fairfield
					County.
				</p>
				<div className="flex items-center gap-6 max-[760px]:w-full max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4">
					<Link className={`button ${buttonStyles}`} href="/contact">
						Request a free estimate <ActionIcon name="estimate" />
					</Link>
					<a
						className="text-3.25 text-cream inline-flex items-center gap-2.75 border-0 pb-0 font-semibold"
						href={client.phoneHref}
					>
						<ActionIcon name="phone" /> Or call {client.phone}
					</a>
				</div>
				<div className="text-cream/80 mt-10 flex items-center gap-3 text-xs max-[760px]:mt-7">
					<span
						className="text-3.25 tracking-[0.12em] whitespace-nowrap text-[#b38339]"
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
			<TrustStrip />
		</section>
	);
}
