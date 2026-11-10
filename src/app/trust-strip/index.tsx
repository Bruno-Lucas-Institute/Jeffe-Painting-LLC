import { wideSectionPaddingX } from "@/app/styles";

export function TrustStrip() {
	return (
		<section
			aria-label="Why homeowners choose Jeffe Painting"
			className={`border-line relative z-0 flex min-h-30 items-center justify-between gap-5 border-y bg-[#f1efe8] ${wideSectionPaddingX} py-5.75 max-[760px]:grid max-[760px]:min-h-0 max-[760px]:grid-cols-1 max-[760px]:py-5`}
		>
			<div className="flex flex-col gap-1 max-[760px]:flex-row max-[760px]:items-baseline max-[760px]:justify-between max-[760px]:gap-4">
				<strong className="font-heading text-4.25 font-normal">
					Licensed &amp; insured
				</strong>
				<span className="max-[760px]:max-w-[48%] max-[760px]:text-right">
					Peace of mind, start to finish
				</span>
			</div>
		</section>
	);
}
