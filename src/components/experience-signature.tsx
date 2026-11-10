import { client } from "@/config/client";

export function ExperienceSignature() {
	return (
		<div
			className="absolute right-[max(44px,calc((100vw-1440px)/2))] bottom-12 z-2 flex items-center gap-5.5 text-[#f4ead8] max-[760px]:relative max-[760px]:right-auto max-[760px]:bottom-auto max-[760px]:mt-7 max-[760px]:mb-8 max-[760px]:ml-6.25 max-[760px]:w-fit max-[760px]:gap-4.5"
			role="img"
			aria-label={`${client.yearsExperience}+ ${client.content.experienceCaption}`}
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
			<span className="experience-signature-caption" aria-hidden="true">
				Years of painting experience
			</span>
		</div>
	);
}
