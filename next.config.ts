import type { NextConfig } from "next";

const developmentHosts = [
	process.env.NEXT_PUBLIC_SITE_URL,
	...(process.env.OWNER_DEV_ORIGINS || "").split(","),
]
	.filter((value): value is string => Boolean(value?.trim()))
	.map((value) => new URL(value.trim()).hostname);
const nextConfig: NextConfig = {
	distDir: process.env.NEXT_BUILD_DIR || ".next",
	allowedDevOrigins: [...new Set(developmentHosts)],
	serverExternalPackages: ["web-push"],
	outputFileTracingExcludes: {
		"*": ["./.local-data/**/*", "./.env*", "./.npm-cache/**/*"],
	},
	async headers() {
		return [
			{
				source: "/sw.js",
				headers: [
					{ key: "Cache-Control", value: "no-store" },
					{ key: "Service-Worker-Allowed", value: "/" },
				],
			},
			{
				source: "/owner/:path*",
				headers: [{ key: "Cache-Control", value: "private, no-store" }],
			},
			{
				source: "/login",
				headers: [{ key: "Cache-Control", value: "private, no-store" }],
			},
		];
	},
	cacheComponents: true,
	partialPrefetching: true,
	turbopack: {
		root: process.cwd(),
		rules: {
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
};

export default nextConfig;
