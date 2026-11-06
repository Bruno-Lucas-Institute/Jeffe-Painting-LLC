import { NextResponse } from "next/server";
import { client } from "@/config/client";
import { estimateSchema, normalizeInquiry } from "@/lib/validation/estimate";
import { saveInquiry, persistentLimit } from "@/lib/owner/store";
import { flushPushJobs } from "@/lib/owner/push";
import {
	sameOrigin,
	requestIdentity,
	isNativeForm,
	readFormOrJson,
	formFeedback,
} from "@/lib/owner/http";
import { after } from "next/server";

export async function POST(request: Request) {
	const native = isNativeForm(request);
	const respond = (
		body: { error?: string; fields?: object; mode?: string },
		status: number,
	) =>
		native
			? formFeedback(
					status === 200
						? client.form.successTitle
						: client.form.errorSummary,
					status === 200
						? client.form.successMessage
						: body.error ||
								"Revise os campos do formulário e tente novamente.",
					status,
				)
			: NextResponse.json(body, {
					status,
					headers: { "Cache-Control": "no-store" },
				});
	if (!client.features.inquiry)
		return respond({ error: "Requests are not enabled." }, 503);
	if (!sameOrigin(request))
		return respond(
			{ error: "Open the form from this website and try again." },
			403,
		);
	try {
		if (!persistentLimit(`inquiry:${requestIdentity(request)}`, 5, 600000))
			return respond(
				{
					error: "Too many attempts. Please try again in ten minutes.",
				},
				429,
			);
	} catch {
		return respond(
			{
				error: "We could not save your request. Please try again later.",
			},
			503,
		);
	}
	let raw: unknown;
	try {
		raw = await readFormOrJson(request, 65536);
	} catch {
		return respond({ error: "Please check the form and try again." }, 400);
	}
	const parsed = estimateSchema.safeParse(raw);
	if (!parsed.success)
		return respond(
			{
				error: "Please check the highlighted fields.",
				fields: parsed.error.flatten().fieldErrors,
			},
			400,
		);
	if (parsed.data.website)
		return respond({ error: "Unable to accept this request." }, 400);
	try {
		const { website: unused, ...data } = parsed.data;
		void unused;
		saveInquiry(normalizeInquiry(data, client));
		after(async () => {
			try {
				await flushPushJobs();
			} catch {
				/* The durable outbox is retried by the scheduled endpoint. */
			}
		});
		return respond({ mode: "saved" }, 200);
	} catch {
		return respond(
			{
				error: "Your request could not be saved. Your details are still here. Please try again later.",
			},
			503,
		);
	}
}
