import { Hero } from "./hero";
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
			<Services />
			<Transformation />
			<Projects />
			<Process />
			<Testimonials />
			<EstimateCta />
		</>
	);
}
