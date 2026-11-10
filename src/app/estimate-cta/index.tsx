import { ActionIcon } from "@/components/action-icon";
import { buttonStyles, lightButtonStyles } from "@/components/button";
import Link from "next/link";
import { client } from "@/config/client";
import { ctaActions, ctaSection, ctaTitle, eyebrow } from "@/app/styles";

export function EstimateCta() {
	return (
		<section className={ctaSection}>
			<div>
				<p className={`${eyebrow} mb-4.5 text-[#f0d7b3]`}>
					<span className="inline-block h-px w-6.25 bg-current" />{" "}
					Let&rsquo;s talk about your project
				</p>
				<h2 className={ctaTitle}>
					Ready for a change
					<br />
					you can feel?
				</h2>
			</div>
			<div className={ctaActions}>
				<Link
					className={`button ${buttonStyles} ${lightButtonStyles}`}
					href="/contact"
				>
					Request your free estimate <ActionIcon name="estimate" />
				</Link>
				<a href={client.phoneHref}>
					<ActionIcon name="phone" /> Prefer to talk? {client.phone}
				</a>
			</div>
		</section>
	);
}
