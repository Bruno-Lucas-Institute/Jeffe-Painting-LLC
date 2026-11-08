import { ActionIcon } from "@/components/action-icon";
import Image from "next/image";
import Link from "next/link";

export function Transformation() {
	return (
		<section className="section transformation-section">
			<div className="transformation-copy">
				<p className="eyebrow">
					<span className="eyebrow-line" /> Before &amp; after
				</p>
				<h2>
					Small changes.
					<br />
					<em>Remarkable difference.</em>
				</h2>
				<p>
					A tired finish can make a whole room feel dated. With the
					right preparation and a steady hand, familiar spaces can
					feel new again.
				</p>
				<Link className="button button-light" href="/projects">
					See the project gallery <ActionIcon name="gallery" />
				</Link>
			</div>
			<div className="transformation-images">
				<figure className="transformation-after">
					<Image
						alt="After: refreshed interior with clean, bright finishes"
						fill
						sizes="(max-width: 760px) 100vw, 40vw"
						src="/images/transformation-after.webp"
					/>
					<figcaption>After</figcaption>
				</figure>
				<figure className="transformation-before">
					<Image
						alt="Before: a room ready for a fresh coat of paint"
						fill
						sizes="(max-width: 760px) 50vw, 20vw"
						src="/images/transformation-before.webp"
					/>
					<figcaption>Before</figcaption>
				</figure>
				<span className="transformation-stamp">
					A home
					<br />
					refreshed
				</span>
			</div>
		</section>
	);
}
