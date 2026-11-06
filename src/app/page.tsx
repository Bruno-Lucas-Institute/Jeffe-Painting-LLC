import { client } from "@/config/client";
import { homeSections } from "@/lib/composition";
import { BusinessSection } from "@/components/business-sections";
export default function Home() {
	return (
		<div className={`business-home layout-${client.home.layout}`}>
			{homeSections(client).map((section, index) => (
				<BusinessSection type={section} key={`${section}-${index}`} />
			))}
		</div>
	);
}
