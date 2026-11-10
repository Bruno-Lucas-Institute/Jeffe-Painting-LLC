import { ActionIcon } from "@/components/action-icon";
import { buttonStyles, lightButtonStyles } from "@/components/button";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";
import {
	contentHeadingEm,
	eyebrow,
	pageHero,
	pageHeroCopy,
	pageHeroTitle,
	textLink,
} from "@/app/styles";

export const metadata: Metadata = {
	title: "Painting Services in Danbury, CT",
	description:
		"Explore interior and exterior painting, cabinet refinishing, and closet painting from Jeffe Painting in Danbury and Fairfield County, Connecticut.",
};

export default function ServicesPage() {
	return (
		<>
			<section className={pageHero}>
				<p className={eyebrow}>
					<span className="inline-block h-px w-6.25 bg-current" />{" "}
					Services · Danbury &amp; Fairfield County
				</p>
				<h1 className={pageHeroTitle}>
					Thoughtful work,
					<br />
					<em className={contentHeadingEm}>beautifully finished.</em>
				</h1>
				<p className={pageHeroCopy}>
					From a room that needs a reset to a kitchen ready for a new
					chapter, we bring experience, careful prep, and pride in the
					details.
				</p>
				<Link className={`button ${buttonStyles}`} href="/contact">
					Tell us about your project <ActionIcon name="message" />
				</Link>
			</section>

			<section className="px-[max(44px,calc((100vw-1200px)/2))] pb-20 max-[760px]:px-6.25 max-[760px]:pb-12">
				{client.services.map((service, index) => (
					<article
						className={`border-line grid min-h-102.5 scroll-mt-7.5 grid-cols-[1fr_0.9fr] items-center gap-[8vw] border-t py-10.5 max-[1000px]:gap-10 max-[760px]:grid-cols-1 max-[760px]:py-8 ${index % 2 === 1 ? "min-[761px]:grid-cols-[0.9fr_1fr]" : ""}`}
						id={service.href.split("#")[1]}
						key={service.title}
					>
						<div
							className={`bg-paper-deep relative min-h-85 overflow-hidden max-[760px]:min-h-70 ${index % 2 === 1 ? "max-[760px]:order-0 min-[761px]:order-2" : ""}`}
						>
							<Image
								alt={service.imageAlt}
								className="object-cover transition-transform duration-500"
								fill
								loading={index === 0 ? "eager" : "lazy"}
								sizes="(max-width: 760px) 100vw, 50vw"
								src={service.image}
							/>
							<span className="bg-background text-2.5 text-brand-red absolute top-3.75 left-3.75 z-2 grid h-7.5 min-w-8.5 place-items-center px-1.75 font-bold tracking-[0.08em]">
								0{index + 1}
							</span>
						</div>
						<div>
							<p className={eyebrow}>
								<span className="inline-block h-px w-6.25 bg-current" />{" "}
								{service.label}
							</p>
							<h2 className="font-heading m-0 text-[clamp(36px,4vw,52px)] leading-[1.05] font-normal tracking-tighter capitalize">
								{service.title}
							</h2>
							<p className="text-3.5 text-muted mt-4.25 mb-4.75 leading-[1.8]">
								{service.description}
							</p>
							<ul className="mb-5.75 flex list-none flex-col gap-2 p-0 text-xs text-[#52564e]">
								{[
									"Careful surface preparation",
									"Clear communication from start to finish",
									"Respectful, tidy work in your home",
								].map((item) => (
									<li key={item}>
										<span
											className="text-brand-red pr-1.75"
											aria-hidden="true"
										>
											✓
										</span>{" "}
										{item}
									</li>
								))}
							</ul>
							<Link className={textLink} href="/contact">
								Get an estimate <ActionIcon name="estimate" />
							</Link>
						</div>
					</article>
				))}
			</section>

			<section className="bg-forest grid grid-cols-[1fr_0.8fr] items-center gap-[8vw] px-[max(44px,calc((100vw-1200px)/2))] py-17.5 text-white max-[760px]:grid-cols-1 max-[760px]:gap-8 max-[760px]:px-6.25 max-[760px]:py-13.75">
				<div>
					<p className={`${eyebrow} text-[#f0d7b3]`}>
						<span className="inline-block h-px w-6.25 bg-current" />{" "}
						Rooted in Danbury
					</p>
					<h2 className="font-heading m-0 text-[clamp(42px,5vw,60px)] leading-[1.04] font-normal tracking-[-0.055em]">
						Local work.
						<br />A personal touch.
					</h2>
				</div>
				<div>
					<p className="text-3.5 leading-[1.8] text-white/75">
						Jeffe Painting is locally owned and operated in{" "}
						{client.location}, serving homeowners throughout{" "}
						{client.serviceArea}.
					</p>
					<p className="text-3 text-[#e0b5a2]">
						{client.serviceTowns.join(" · ")}
					</p>
					<Link
						className={`mt-2.5 ${buttonStyles} ${lightButtonStyles}`}
						href="/contact"
					>
						Check availability <ActionIcon name="calendar" />
					</Link>
				</div>
			</section>
		</>
	);
}
