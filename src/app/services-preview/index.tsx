import { ActionIcon } from "@/components/action-icon";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/config/client";
import {
	eyebrow,
	section,
	sectionHeading,
	sectionIntro,
	sectionTitle,
	textLink,
} from "@/app/styles";

export function Services() {
	return (
		<section className={`${section} bg-paper`}>
			<div className={sectionHeading}>
				<div>
					<p className={eyebrow}>
						<span className="inline-block h-px w-6.25 bg-current" />{" "}
						What we do
					</p>
					<h2 className={sectionTitle}>
						Good work lives
						<br />
						in the details.
					</h2>
				</div>
				<div className="max-w-91.25">
					<p className={sectionIntro}>
						From a single room to a full exterior refresh, we bring
						the same careful preparation and pride in the finish to
						every project.
					</p>
					<Link className={textLink} href="/services">
						Explore all services <ActionIcon name="arrow" />
					</Link>
				</div>
			</div>
			<div className="grid grid-cols-4 gap-4.5 max-[1000px]:grid-cols-2 max-[700px]:grid-cols-1">
				{client.services.map((service, index) => (
					<Link
						className="group border-line block min-w-0 border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(31,33,28,0.08)]"
						href={service.href}
						key={service.title}
					>
						<div className="bg-paper-deep relative aspect-[1.15] overflow-hidden">
							<Image
								alt={service.imageAlt}
								className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
								fill
								sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 25vw"
								src={service.image}
							/>
							<span className="bg-background text-2.5 text-brand-red absolute top-3.75 left-3.75 z-2 grid h-7.5 min-w-8.5 place-items-center px-1.75 font-bold tracking-[0.08em]">
								0{index + 1}
							</span>
						</div>
						<div className="relative min-h-54 px-5 pt-5.75 pb-6.75">
							<span className="text-2.25 text-brand-red font-bold tracking-[0.13em] uppercase">
								{service.label}
							</span>
							<h3 className="font-heading text-5.5 mt-2.25 mb-1.75 font-normal tracking-tight">
								{service.title}
							</h3>
							<p className="text-3 text-muted m-0 leading-[1.7]">
								{service.description}
							</p>
							<span
								className="text-brand-red text-4.25 absolute right-5 bottom-4.25"
								aria-hidden="true"
							>
								↗
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
