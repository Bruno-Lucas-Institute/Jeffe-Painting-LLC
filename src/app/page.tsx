import { Hero } from "./_sections/hero";
import { TrustStrip } from "./_sections/trust-strip";
import { Services } from "./_sections/services";
import { Transformation } from "./_sections/transformation";
import { Projects } from "./_sections/projects";
import { Process } from "./_sections/process";
import { Testimonials } from "./_sections/testimonials";
import { EstimateCta } from "./_sections/estimate-cta";

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
