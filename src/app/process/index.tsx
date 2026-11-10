import { eyebrow } from "@/app/styles";

export function Process() {
	return (
		<section className="border-line grid grid-cols-[0.8fr_1.2fr] items-start gap-[9vw] border-t bg-[#f0eee7] px-[max(44px,calc((100vw-1300px)/2))] py-27.5 max-[1000px]:grid-cols-1 max-[1000px]:gap-10 max-[760px]:px-6.25 max-[760px]:py-17.5">
			<div>
				<p className={eyebrow}>
					<span className="inline-block h-px w-6.25 bg-current" /> The
					process
				</p>
				<h2 className="font-heading m-0 text-[clamp(38px,4vw,54px)] leading-[1.04] font-normal tracking-[-0.055em]">
					Easy to start.
					<br />
					<em className="text-brand-red font-normal">
						Good to come home to.
					</em>
				</h2>
				<p className="text-3.25 text-muted mt-5 mb-4.25 max-w-87.5 leading-[1.8]">
					Clear communication and respectful work are part of a job
					well done. Here is what getting started looks like.
				</p>
			</div>
			<div className="grid grid-cols-3 gap-5.25 max-[700px]:grid-cols-1">
				{[
					[
						"01",
						"Tell us about it",
						"Share a few details about your project and where you're located.",
					],
					[
						"02",
						"Get a clear estimate",
						"We'll talk through the work and give you a straightforward quote.",
					],
					[
						"03",
						"Enjoy the refresh",
						"Our crew takes care of the details, from prep through final walkthrough.",
					],
				].map(([number, title, description]) => (
					<div
						className="border-t border-[#c8c6ba] pt-3.25"
						key={number}
					>
						<span className="font-heading text-3.75 text-brand-red">
							{number}
						</span>
						<h3 className="font-heading text-5.5 mt-7.75 mb-2.25 font-normal tracking-tight">
							{title}
						</h3>
						<p className="text-3 text-muted m-0 leading-[1.7]">
							{description}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
