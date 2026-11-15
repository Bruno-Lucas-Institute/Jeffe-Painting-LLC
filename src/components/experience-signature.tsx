import { getClient } from "@/lib/owner/settings";
import "./experience-signature.css";

export async function ExperienceSignature() {
	const client = await getClient();
	return (
		<div
			className="experience-signature"
			role="img"
			aria-label={`${client.yearsExperience}+ years of painting experience`}
		>
			<span className="experience-signature-value" aria-hidden="true">
				{client.yearsExperience}
				<sup>+</sup>
			</span>
			<span className="experience-signature-caption" aria-hidden="true">
				Years of painting experience
			</span>
		</div>
	);
}
