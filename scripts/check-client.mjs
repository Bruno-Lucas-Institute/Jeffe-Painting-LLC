import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { client, profileName } from "../src/config/client.ts";
const paths = new Set();
function collect(value) {
	if (
		typeof value === "string" &&
		/^\/(?!\/).+\.(svg|png|jpg|jpeg|webp|avif|gif|ico|woff2|ttf)$/.test(
			value,
		)
	)
		paths.add(value);
	else if (Array.isArray(value)) value.forEach(collect);
	else if (value && typeof value === "object")
		Object.values(value).forEach(collect);
}
collect(client);
for (const asset of paths)
	if (!existsSync(resolve("public", asset.slice(1))))
		throw new Error("Missing asset: " + asset);
console.log(
	JSON.stringify(
		{
			profile: profileName,
			business: client.businessName,
			services: client.services.length,
			formFields: client.form.fields.map((f) => f.id),
			sections: client.home.sections,
			assetsChecked: paths.size,
		},
		null,
		2,
	),
);
