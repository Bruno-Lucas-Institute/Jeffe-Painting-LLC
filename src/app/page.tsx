import { Hero } from "./hero";
import { TrustStrip } from "./trust-strip";
import { Services } from "./services-preview";
import { Transformation } from "./transformation";
import { Projects } from "./featured-projects";
import { Process } from "./process";
import { Testimonials } from "./testimonials";
import { EstimateCta } from "./estimate-cta";

export default function Home() {
	return (
		<>
			<Hero />
			<TrustStrip />
			<Services />
			<Transformation />
			<Projects />
			<Process />
			<Testimonials />
			<EstimateCta />
		</>
	);
}
