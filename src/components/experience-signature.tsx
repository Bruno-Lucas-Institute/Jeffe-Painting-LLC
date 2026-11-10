import { client } from "@/config/client";
import "./experience-signature.css";

export function ExperienceSignature() {
	return (
		<div
			className="experience-signature"
			role="img"
			aria-label={`${client.yearsExperience}+ ${client.content.experienceCaption}`}
		>
			<span
				className="experience-signature-value inline-flex items-start font-heading text-[88px] font-medium leading-[0.9]"
				aria-hidden="true"
			>
				{client.yearsExperience}
				<sup>+</sup>
			</span>
			<span className="experience-signature-caption" aria-hidden="true">
				{client.content.experienceCaption}
			</span>
		</div>
	);
}
