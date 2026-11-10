import { ActionIcon } from "@/components/action-icon";
import type { Metadata } from "next";
import Link from "next/link";
import { EstimateForm } from "@/components/estimate-form";
import { client } from "@/config/client";
import { eyebrow, pageHero, pageHeroCopy, pageHeroTitle, textLink } from "@/app/styles";

export const metadata: Metadata = {
	title: "Request a Free Painting Estimate",
	description:
		"Contact Jeffe Painting for a free painting estimate in Danbury and Fairfield County, CT. Call or share a few details about your project.",
};

export default function ContactPage() {
	return (
		<>
			<section className={`${pageHero} pb-17.5 max-[760px]:pb-12.5`}>
				<p className={eyebrow}>
					<span className="inline-block h-px w-6.25 bg-current" /> Let&rsquo;s make a plan
				</p>
				<h1 className={pageHeroTitle}>
					Tell us what
					<br />
					<em className="text-brand-red not-italic">you have in mind.</em>
				</h1>
				<p className={pageHeroCopy}>
					Share a few details and Jefferson will be in touch to talk through your project and arrange a free estimate.
				</p>
				<a className={textLink} href={client.phoneHref}>
					Or call {client.phone} <ActionIcon name="phone" />
				</a>
			</section>

			<section className="grid grid-cols-[1.3fr_0.7fr] items-start gap-[8vw] px-[max(44px,calc((100vw-1200px)/2))] pb-27.5 max-[1000px]:grid-cols-1 max-[1000px]:gap-10 max-[760px]:px-6.25 max-[760px]:pb-17.5">
				<div className="border-line border bg-white p-9.75 max-[760px]:p-6">
					<div>
						<p className={eyebrow}>
							<span className="inline-block h-px w-6.25 bg-current" /> Request an estimate
						</p>
						<h2 className="font-heading m-0 text-[clamp(34px,4vw,46px)] leading-[1.04] font-normal tracking-[-0.055em]">
							Let&rsquo;s talk about
							<br />
							your project.
						</h2>
						<p className="text-3.25 text-muted mt-3.5 mb-7">Every detail helps us get a better sense of what you need.</p>
					</div>
					<EstimateForm />
				</div>
				<aside className="pt-3.75">
					<div className="mb-10">
						<p className={`${eyebrow} mb-4`}>
							<span className="inline-block h-px w-6.25 bg-current" /> Call or email
						</p>
						<a className="font-heading text-4.75 my-2 block w-fit" href={client.phoneHref}>
							{client.phone}
						</a>
						<a className="font-heading text-4.75 my-2 block w-fit" href={`mailto:${client.email}`}>
							{client.email}
						</a>
					</div>
					<div className="mb-10">
						<p className={`${eyebrow} mb-4`}>
							<span className="inline-block h-px w-6.25 bg-current" /> Where we work
						</p>
						<p className="text-muted m-0">
							Based in {client.location}
							<br />
							Serving {client.serviceArea}
						</p>
						<p className="text-3 text-muted mt-3">{client.serviceTowns.join(" · ")}</p>
					</div>
					<div className="mb-10">
						<p className={`${eyebrow} mb-4`}>
							<span className="inline-block h-px w-6.25 bg-current" /> Office hours
						</p>
						{client.hours.map((item) => (
							<div className="text-2.75 text-muted flex justify-between gap-3 py-0.5" key={item.days}>
								<span>{item.days}</span>
								<span>{item.hours}</span>
							</div>
						))}
					</div>
					<div className="border-brand-red bg-paper-deep border-l-2 p-5.25">
						<span className="text-brand-red" aria-hidden="true">
							✳
						</span>
						<p className="font-heading text-4 mt-2 mb-2.5 leading-normal">
							Not sure what you need? That&rsquo;s okay. A quick call is a great place to start.
						</p>
						<Link className="text-3 text-brand-red" href="/services">
							Explore our services <ActionIcon name="arrow" />
						</Link>
					</div>
				</aside>
			</section>
		</>
	);
}
