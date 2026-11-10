import { ActionIcon } from "@/components/action-icon";
import { buttonStyles, lightButtonStyles } from "@/components/button";
import Image from "next/image";
import Link from "next/link";
import { eyebrow } from "@/app/styles";

export function Transformation() {
	return (
		<section className="bg-forest grid min-h-130 grid-cols-[0.84fr_1.16fr] items-center gap-[7vw] px-[max(44px,calc((100vw-1300px)/2))] py-27.5 text-white max-[1000px]:gap-10 max-[760px]:grid-cols-1 max-[760px]:px-6.25 max-[760px]:py-17.5">
			<div className="max-w-115">
				<p className={`${eyebrow} text-[#f0d7b3]`}>
					<span className="inline-block h-px w-6.25 bg-current" />{" "}
					Before &amp; after
				</p>
				<h2 className="font-heading m-0 text-[clamp(39px,4.5vw,60px)] leading-[1.04] font-normal tracking-[-0.055em]">
					Small changes.
					<br />
					<em className="text-[#e7cabb] not-italic">
						Remarkable difference.
					</em>
				</h2>
				<p className="text-3.5 mt-6.25 mb-7.25 leading-[1.8] text-white/75">
					A tired finish can make a whole room feel dated. With the
					right preparation and a steady hand, familiar spaces can
					feel new again.
				</p>
				<Link
					className={`button ${buttonStyles} ${lightButtonStyles}`}
					href="/projects"
				>
					See the project gallery <ActionIcon name="gallery" />
				</Link>
			</div>
			<div className="relative grid h-87.5 grid-cols-[1fr_0.44fr] items-center max-[760px]:h-70">
				<figure className="relative m-0 h-80 overflow-hidden max-[760px]:h-62.5">
					<Image
						alt="After: refreshed interior with clean, bright finishes"
						className="object-cover"
						fill
						sizes="(max-width: 760px) 100vw, 40vw"
						src="/images/transformation-after.webp"
					/>
					<figcaption className="bg-background text-2.25 text-foreground absolute bottom-3 left-3 px-2.5 py-1 font-bold tracking-[0.12em] uppercase">
						After
					</figcaption>
				</figure>
				<figure className="relative z-2 m-0 h-47.5 overflow-hidden max-[760px]:h-37.5">
					<Image
						alt="Before: a room ready for a fresh coat of paint"
						className="object-cover"
						fill
						sizes="(max-width: 760px) 50vw, 20vw"
						src="/images/transformation-before.webp"
					/>
					<figcaption className="bg-background text-2.25 text-foreground absolute bottom-3 left-3 px-2.5 py-1 font-bold tracking-[0.12em] uppercase">
						Before
					</figcaption>
				</figure>
				<span className="bg-brand-red font-heading text-3.5 absolute top-1/2 left-1/2 z-3 grid h-25 w-25 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-center leading-[1.1] text-white">
					A home
					<br />
					refreshed
				</span>
			</div>
		</section>
	);
}
