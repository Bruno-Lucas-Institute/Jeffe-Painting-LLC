import { client } from "@/config/client";
import { eyebrow } from "@/app/styles";

export function Testimonials() {
	return (
		<section className="grid grid-cols-[0.7fr_1.3fr] gap-[8vw] px-[max(44px,calc((100vw-1300px)/2))] py-27.5 max-[1000px]:grid-cols-1 max-[1000px]:gap-10 max-[760px]:px-6.25 max-[760px]:py-17.5">
			<div>
				<p className={eyebrow}>
					<span className="inline-block h-px w-6.25 bg-current" />{" "}
					Kind words
				</p>
				<h2 className="font-heading m-0 text-[clamp(38px,4vw,54px)] leading-[1.04] font-normal tracking-[-0.055em]">
					Better homes.
					<br />
					Happier homeowners.
				</h2>
				<p className="text-2.75 text-muted mt-6.25 mb-0 flex items-center gap-2.25">
					<span className="text-3.25 whitespace-nowrap text-[#b38339]">
						★★★★★
					</span>
					<strong>{client.reviewRating}</strong> from{" "}
					{client.reviewCount} local reviews
				</p>
			</div>
			<div className="grid grid-cols-2 gap-4.25 max-[700px]:grid-cols-1">
				{client.testimonials.map((testimonial) => (
					<figure
						className="bg-cream text-foreground relative m-0 flex min-h-65 flex-col px-6.75 pt-7.75 pb-6.25"
						key={testimonial.name}
					>
						<span
							className="font-heading text-12.25 text-brand-red leading-[0.8]"
							aria-hidden="true"
						>
							“
						</span>
						<blockquote className="text-3.5 mt-3.5 mb-5.5 leading-[1.8]">
							{testimonial.quote}
						</blockquote>
						<figcaption className="mt-auto flex flex-col gap-1">
							<strong className="font-heading text-4.25 font-normal">
								{testimonial.name}
							</strong>
							<span className="text-2.75 text-muted">
								{testimonial.location}
							</span>
						</figcaption>
					</figure>
				))}
			</div>
		</section>
	);
}
