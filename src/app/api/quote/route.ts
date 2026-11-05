import { NextResponse } from "next/server";
import { estimateSchema } from "@/lib/validation/estimate";
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
						? "Solicitação enviada com sucesso!"
						: "Não foi possível enviar",
					status === 200
						? "Obrigado! Recebemos as informações do seu pedido."
						: body.error ||
								"Revise os campos do formulário e tente novamente.",
					status,
				)
			: NextResponse.json(body, {
					status,
					headers: { "Cache-Control": "no-store" },
				});
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
		raw = await readFormOrJson(request, 16000);
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
		saveInquiry({
			name: data.name,
			email: data.email,
			phone: data.phone,
			service: data.service,
			location: data.town,
			message: data.details,
		});
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
