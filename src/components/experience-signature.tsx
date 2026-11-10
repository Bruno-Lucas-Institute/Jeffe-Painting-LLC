import { client } from "@/config/client";

export function ExperienceSignature() {
	return (
		<div
			className="absolute right-[max(44px,calc((100vw-1440px)/2))] bottom-12 z-2 flex items-center gap-5.5 text-[#f4ead8] max-[760px]:relative max-[760px]:right-auto max-[760px]:bottom-auto max-[760px]:mt-7 max-[760px]:mb-8 max-[760px]:ml-6.25 max-[760px]:w-fit max-[760px]:gap-4.5"
			role="img"
			aria-label={`${client.yearsExperience}+ years of painting experience`}
		>
			<span
				className="font-heading text-22 max-[760px]:text-16 inline-flex items-start leading-[0.9] font-medium tracking-[-0.055em]"
				aria-hidden="true"
			>
				{client.yearsExperience}
				<sup className="static mt-0.75 ml-1.25 text-[0.4em] leading-none font-normal tracking-normal">
					+
				</sup>
			</span>
			<span
				className="font-body text-2.75 max-[760px]:text-2.5 max-w-40 border-l border-[#f4ead8]/45 py-1.5 pl-5.5 leading-[1.7] font-medium tracking-[0.13em] uppercase max-[760px]:max-w-37.5 max-[760px]:pl-4.5"
				aria-hidden="true"
			>
				Years of painting experience
			</span>
		</div>
	);
}
