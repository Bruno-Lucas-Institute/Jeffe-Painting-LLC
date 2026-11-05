import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/icons", { recursive: true });
const image = Buffer.from(
	'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#a82d27"/><path d="M150 145H355V190H300V306Q300 377 227 377Q153 377 153 309H199Q199 335 227 335Q252 335 252 306V190H150Z" fill="#fffefa"/></svg>',
);
for (const [name, size] of [
	["icon-192.png", 192],
	["icon-512.png", 512],
	["maskable-512.png", 512],
	["apple-touch-icon.png", 180],
])
	await sharp(image)
		.resize(size, size)
		.png()
		.toFile("public/icons/" + name);
await sharp(image).resize(96, 96).png().toFile("public/icons/badge.png");
