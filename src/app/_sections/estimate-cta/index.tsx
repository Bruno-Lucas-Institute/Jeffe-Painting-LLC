import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
import { client } from "@/config/client";

export function EstimateCta() {
	return (
		<section className="cta-section">
			<div>
				<p className="eyebrow eyebrow-light">
					<span className="eyebrow-line" /> Let&rsquo;s talk about
					your project
				</p>
				<h2>
					Ready for a change
					<br />
					you can feel?
				</h2>
			</div>
			<div className="cta-actions">
				<Link className="button button-light" href="/contact">
					Request your free estimate <ActionIcon name="estimate" />
				</Link>
				<a href={client.phoneHref}>
					<ActionIcon name="phone" /> Prefer to talk? {client.phone}
				</a>
			</div>
		</section>
	);
}
