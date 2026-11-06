import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
	copyFileSync,
	lstatSync,
	realpathSync,
} from "node:fs";
import { resolve, dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import starter from "../src/config/blueprint.json" with { type: "json" };
import { businessSchema } from "../src/config/schema.ts";
export function createClient({
	destination,
	id,
	name,
	industry = "local-services",
}) {
	const source = resolve(fileURLToPath(new URL("..", import.meta.url)));
	const target = resolve(destination);
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))
		throw new Error("Use a lowercase client ID with hyphens.");
	if (!name?.trim() || name.length > 100)
		throw new Error("Supply a business name (1–100 characters).");
	if (target === source || target.startsWith(source + sep))
		throw new Error(
			"Choose a separate destination outside the template checkout.",
		);
	if (existsSync(target))
		throw new Error("Destination already exists. No files were changed.");
	const config = structuredClone(starter);
	config.id = id;
	config.industry = industry;
	config.businessName = name.trim();
	config.shortName = name.trim();
	config.logo = {
		name: name.trim().toUpperCase(),
		tagline: industry.replaceAll("-", " "),
		mark: Array.from(name.trim())[0].toUpperCase(),
		image: "",
	};
	config.content.heroSide = `${name.trim()} · ${industry}`;
	config.seo.title = `${name.trim()} | ${industry.replaceAll("-", " ")}`;
	businessSchema.parse(config);
	function copy(relativePath) {
		if (
			relativePath
				.split(sep)
				.some(
					(part) =>
						part.startsWith(".env") ||
						[
							".git",
							".codex",
							".local-data",
							"node_modules",
							".next",
						].includes(part),
				) ||
			/\.(sqlite(?:-wal|-shm)?|pem|key|log)$/.test(relativePath)
		)
			return;
		const from = join(source, relativePath);
		if (lstatSync(from).isSymbolicLink())
			throw new Error("Symlinks are not included in client exports.");
		if (lstatSync(from).isDirectory()) {
			for (const entry of readdirSync(from))
				copy(join(relativePath, entry));
			return;
		}
		const normalized = relativePath.split(sep).join("/");
		if (normalized.startsWith("src/config/profiles/")) return;
		if (normalized === "tests/reusability.test.ts") return;
		const to = join(target, relativePath);
		mkdirSync(dirname(to), { recursive: true });
		copyFileSync(from, to);
	}
	for (const folder of ["src", "scripts", "tests"]) copy(folder);
	for (const file of [
		"package.json",
		"package-lock.json",
		"next.config.ts",
		"tsconfig.json",
		"eslint.config.mjs",
		".gitignore",
		".prettierrc.json",
		"AGENTS.md",
		"README.md",
		"CLIENT_SETUP.md",
		"OWNER_SETUP.md",
	]) {
		if (existsSync(join(source, file))) copy(file);
	}
	const assets = new Set();
	function collect(value) {
		if (
			typeof value === "string" &&
			/^\/(?!\/).+\.(svg|png|jpg|jpeg|webp|avif|gif|ico|woff2|ttf)$/.test(
				value,
			)
		)
			assets.add(value);
		else if (Array.isArray(value)) value.forEach(collect);
		else if (value && typeof value === "object")
			Object.values(value).forEach(collect);
	}
	collect(config);
	for (const asset of assets) {
		const assetPath = resolve(source, "public", asset.slice(1));
		const publicRoot = resolve(source, "public") + sep;
		if (!assetPath.startsWith(publicRoot) || !existsSync(assetPath))
			throw new Error(
				"Configured asset is missing or outside public: " + asset,
			);
		if (
			!realpathSync(assetPath).startsWith(
				realpathSync(resolve(source, "public")) + sep,
			)
		)
			throw new Error("Asset symlinks must stay inside public.");
		const to = join(target, "public", asset.slice(1));
		mkdirSync(dirname(to), { recursive: true });
		copyFileSync(assetPath, to);
	}
	copy("public/sw.js");
	function write(path, value) {
		const out = join(target, path);
		mkdirSync(dirname(out), { recursive: true });
		writeFileSync(out, value);
	}
	write(
		"src/config/profiles/current.json",
		JSON.stringify(config, null, 2) + "\n",
	);
	write(
		"src/config/profiles/index.ts",
		'import current from "./current.json";\nexport const profiles:Record<string,unknown>={' +
			JSON.stringify(id) +
			":current};\nexport const defaultProfile=" +
			JSON.stringify(id) +
			";\n",
	);
	write(
		"src/config/content-defaults.json",
		JSON.stringify(config.content, null, 2) + "\n",
	);
	const tsconfig = JSON.parse(
		readFileSync(join(target, "tsconfig.json"), "utf8"),
	);
	tsconfig.include = tsconfig.include.filter(
		(path) => !path.startsWith(".qa/"),
	);
	tsconfig.exclude = [...new Set([...(tsconfig.exclude || []), ".qa"])];
	write("tsconfig.json", JSON.stringify(tsconfig, null, 2) + "\n");
	const pkg = JSON.parse(readFileSync(join(target, "package.json"), "utf8"));
	pkg.name = id;
	write("package.json", JSON.stringify(pkg, null, 2) + "\n");
	const lock = JSON.parse(
		readFileSync(join(target, "package-lock.json"), "utf8"),
	);
	lock.name = id;
	if (lock.packages?.[""]) lock.packages[""].name = id;
	write("package-lock.json", JSON.stringify(lock, null, 2) + "\n");
	write(
		".env.example",
		`NEXT_PUBLIC_CLIENT_PROFILE=${id}\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\nOWNER_USERNAME=\nOWNER_PASSWORD_HASH=\nOWNER_DATA_DIR=\nOWNER_DEV_ORIGINS=http://localhost:3000,http://127.0.0.1:3000\nVAPID_PUBLIC_KEY=\nVAPID_PRIVATE_KEY=\nVAPID_SUBJECT=mailto:replace@example.com\nPUSH_RETRY_SECRET=\nPUSH_RETRY_ORIGIN=\nTRUST_PROXY=false\n`,
	);
	write(
		"README.md",
		`# ${config.businessName}\n\nIndependent client website generated from the reusable business template.\n\n## Start\n\nRequires Node 24+. Run npm ci, copy .env.example to .env.local, then run npm run dev. This repository has one public profile: src/config/profiles/current.json (ID: ${id}). Update its branding, services, page content, form fields, optional sections and SEO. The initial content is a demonstration and indexing is disabled.\n\n## Owner and data\n\nRun npm run setup:owner -- --username YourOwnerName and provide a new password through stdin. Configure a dedicated persistent OWNER_DATA_DIR in production, stable VAPID keys, a real contact and the final HTTPS origin. No previous owner credentials, sessions or requests are included. Phone notifications require HTTPS and explicit device permission. Run npm run push:worker alongside the server for retries.\n\n## Verify and deploy\n\nRun npm run client:check, npm run lint, npm run typecheck, npm run test and npm run build. Use npm start on a Node 24 host with persistent disk and HTTPS. Get client approval before publication. See CLIENT_SETUP.md and OWNER_SETUP.md for launch and owner instructions. Requests are inquiries, not automatically confirmed bookings.\n\n## Create another independent client\n\nThe neutral blueprint and client:new command remain available. Each new destination gets fresh configuration and must set up its own owner and database.\n`,
	);
	return {
		destination: target,
		id,
		profile: "src/config/profiles/current.json",
		assets: [...assets],
	};
}
if (
	process.argv[1] &&
	resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	const args = process.argv.slice(2);
	const get = (flag) => {
		const index = args.indexOf(flag);
		return index >= 0 ? args[index + 1] : undefined;
	};
	const id = get("--id");
	const name = get("--name");
	if (!id || !name)
		throw new Error(
			'Usage: npm run client:new -- --id garden-care --name "Garden Care" --industry landscaping --destination ../garden-care',
		);
	console.log(
		JSON.stringify(
			createClient({
				id,
				name,
				industry: get("--industry"),
				destination: get("--destination") || resolve("..", id),
			}),
			null,
			2,
		),
	);
}
