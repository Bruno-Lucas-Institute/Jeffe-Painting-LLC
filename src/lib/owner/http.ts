import "server-only";
import { client } from "@/config/client";
import { NextResponse } from "next/server";
import { isOwner } from "./auth";
export function json(body: unknown, status = 200) {
	return NextResponse.json(body, {
		status,
		headers: {
			"Cache-Control": "private, no-store, max-age=0",
			Vary: "Cookie",
		},
	});
}
export function sameOrigin(request: Request) {
	const origin = request.headers.get("origin");
	if (!origin) return false;
	const expected = process.env.NEXT_PUBLIC_SITE_URL
		? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
		: new URL(request.url).origin;
	if (origin === expected) return true;
	return (
		process.env.NODE_ENV !== "production" &&
		(process.env.OWNER_DEV_ORIGINS || "")
			.split(",")
			.map((value) => value.trim())
			.includes(origin)
	);
}
export async function guard(request: Request, mutation = false) {
	if (mutation && !sameOrigin(request))
		return json({ error: "Request origin is not allowed." }, 403);
	if (!(await isOwner()))
		return json({ error: "Please sign in again." }, 401);
	return null;
}
async function readBody(request: Request, max: number) {
	const reader = request.body?.getReader();
	if (!reader) throw new Error("Missing body");
	let size = 0;
	const chunks: Uint8Array[] = [];
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		size += value.byteLength;
		if (size > max) {
			await reader.cancel();
			throw new Error("Body too large");
		}
		chunks.push(value);
	}
	return Buffer.concat(chunks).toString("utf8");
}
export async function readJson(
	request: Request,
	max = 16000,
): Promise<unknown> {
	if (!request.headers.get("content-type")?.includes("application/json"))
		throw new Error("JSON required");
	return JSON.parse(await readBody(request, max));
}
export function isNativeForm(request: Request) {
	return (
		request.headers.get("content-type")?.split(";")[0].trim() ===
		"application/x-www-form-urlencoded"
	);
}
export async function readFormOrJson(
	request: Request,
	max = 16000,
): Promise<unknown> {
	return isNativeForm(request)
		? Object.fromEntries(new URLSearchParams(await readBody(request, max)))
		: readJson(request, max);
}
export function formFeedback(
	title: string,
	message: string,
	status = 200,
	href = "/contact",
) {
	const escape = (value: string) =>
		value.replace(
			/[&<>"']/g,
			(char) =>
				({
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					'"': "&quot;",
					"'": "&#39;",
				})[char]!,
		);
	return new NextResponse(
		`<!doctype html><html lang="${escape(client.locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><style>body{margin:0;min-height:100svh;display:grid;place-items:center;background:${client.theme.ink}b3;font:16px/1.6 Arial,sans-serif;color:${client.theme.ink}}main{box-sizing:border-box;width:min(440px,calc(100% - 40px));padding:36px;background:${client.theme.white};border-radius:16px;text-align:center;box-shadow:0 20px 80px #0003}h1{font-size:29px;line-height:1.25}a{display:inline-block;padding:12px 35px;margin-top:15px;border-radius:6px;background:${client.theme.primary};color:white;text-decoration:none}a:focus-visible{outline:3px solid ${client.theme.ink};outline-offset:4px}</style></head><body><main role="alertdialog" aria-modal="true" aria-labelledby="message-title"><h1 id="message-title">${escape(title)}</h1><p>${escape(message)}</p><a href="${escape(href)}">${escape(client.form.closeLabel)}</a></main></body></html>`,
		{
			status,
			headers: {
				"Content-Type": "text/html; charset=utf-8",
				"Cache-Control": "no-store",
				"X-Content-Type-Options": "nosniff",
				"Content-Security-Policy":
					"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
			},
		},
	);
}
export function requestIdentity(request: Request) {
	return process.env.TRUST_PROXY === "true"
		? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
				"unknown"
		: "shared";
}
