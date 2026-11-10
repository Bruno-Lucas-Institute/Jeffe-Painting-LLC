import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";
import { client } from "@/config/client";

const footerServices = [
	{ label: "Interior painting", href: "/services#interior" },
	{ label: "Exterior painting", href: "/services#exterior" },
	{ label: "Cabinet refinishing", href: "/services#cabinets" },
	{ label: "Closet painting", href: "/services#closets" },
];

export function SiteFooter() {
	return (
		<footer className="relative overflow-hidden bg-[#1a231f] text-[#f7f3ea]">
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
			<div className="relative mx-auto max-w-325max(24px,calc((100vw-1300px)/2))] py-16 max-[760px]:px-6.25 max-[760px]:py-12">
				<div className="mb-10 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(176,143,75,0.22),transparent_35%),rgba(42,52,47,0.96)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-8 lg:flex lg:items-center lg:justify-between">
					<div>
						<p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-[#d7c59b]">
							Your home, refreshed
						</p>
						<h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
							Ready for a brighter, cleaner finish?
						</h2>
					</div>
					<div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-0">
						<Link
							href="/contact"
							className="inline-flex items-center justify-center rounded-full bg-[#d7c59b] px-5 py-3 text-sm font-semibold text-[#1a231f] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#e9d8a5]"
						>
							Request a free estimate
						</Link>
						<a
							href={client.phoneHref}
							className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[#d7c59b]/60 hover:bg-white/10"
						>
							Call {client.phone}
						</a>
					</div>
				</div>

				<div className="grid gap-10 pb-10 md:grid-cols-[1.4fr_0.7fr_0.7fr_1fr]">
					<div className="max-w-md">
						<Link
							className="inline-flex shrink-0 items-center gap-2.75"
							href="/"
						>
							<BrandLogo variant="footer" />
						</Link>
						<p className="mt-4 text-base leading-7 text-white/70">
							Thoughtful painting and refinishing for homes across {client.serviceArea},
							with careful prep, premium materials, and honest communication from start to finish.
						</p>
						<div className="mt-6 flex flex-wrap gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#e7dcc0]">
							<span className="rounded-full border border-[#d7c59b]/30 bg-[#d7c59b]/10 px-3 py-1.5">
								Owner-supervised
							</span>
							<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/80">
								Fairfield County
							</span>
						</div>
					</div>

					<div className="flex flex-col gap-3 text-sm text-white/75">
						<h3 className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#d7c59b]">
							Explore
						</h3>
						<Link className="transition-colors hover:text-[#f2dfb1]" href="/services">
							Services
						</Link>
						<Link className="transition-colors hover:text-[#f2dfb1]" href="/projects">
							Our work
						</Link>
						<Link className="transition-colors hover:text-[#f2dfb1]" href="/about">
							About us
						</Link>
						<Link className="transition-colors hover:text-[#f2dfb1]" href="/contact">
							Estimate request
						</Link>
					</div>

					<div className="flex flex-col gap-3 text-sm text-white/75">
						<h3 className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#d7c59b]">
							Services
						</h3>
						{footerServices.map((service) => (
							<Link
								key={service.label}
								className="transition-colors hover:text-[#f2dfb1]"
								href={service.href}
							>
								{service.label}
							</Link>
						))}
					</div>

					<div className="flex flex-col gap-3 text-sm text-white/75">
						<h3 className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#d7c59b]">
							Get in touch
						</h3>
						<a className="transition-colors hover:text-[#f2dfb1]" href={client.phoneHref}>
							{client.phone}
						</a>
						<a className="transition-colors hover:text-[#f2dfb1]" href={`mailto:${client.email}`}>
							{client.email}
						</a>
						<p className="leading-6 text-white/70">
							{client.location}
							<br />
							Serving {client.serviceArea}
						</p>
						<div className="mt-1 flex gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/60">
							{client.socialLinks.map((social) => (
								<a
									href={social.href}
									key={social.label}
									rel="noreferrer"
									target="_blank"
									className="transition-colors hover:text-[#f2dfb1]"
								>
									{social.label}
								</a>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="border-t border-white/10 bg-[#121a17]">
				<div className="mx-auto flex max-w-325 flex-col items-start justify-between gap-2 px-[max(24px,calc((100vw-1300px)/2))] py-4 text-sm text-white/55 max-[700px]:items-start">
					<span>
						© {client.copyrightYear} {client.businessName}. All rights reserved.
					</span>
					<span>Made for homes that feel like yours.</span>
				</div>
			</div>
		</footer>
	);
}
