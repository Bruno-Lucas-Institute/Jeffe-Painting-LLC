import { randomUUID } from "node:crypto";
import { authenticated, sameOrigin } from "@/lib/auth";
import { validateAppointment } from "@/lib/appointments";
import { allow, db } from "@/lib/store";
import { notifyAdmin } from "@/lib/push";
export async function POST(request: Request) {
	if (!sameOrigin(request))
		return Response.json({ error: "Invalid origin" }, { status: 403 });
	try {
		const text = await request.text();
		if (text.length > 12000)
			return Response.json(
				{ error: "Request too large." },
				{ status: 413 },
			);
		const data = validateAppointment(JSON.parse(text));
		if (!data)
			return Response.json(
				{ error: "Please check all fields and enter a valid email." },
				{ status: 400 },
			);
		if (!allow("appointments", 100, 3600000))
			return Response.json(
				{ error: "Please try again later or call us." },
				{ status: 429 },
			);
		db()
			.prepare("INSERT INTO appointments VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
			.run(
				randomUUID(),
				new Date().toISOString(),
				data.name,
				data.email,
				data.phone,
				data.town,
				data.service,
				data.details,
			);
		await notifyAdmin();
		return Response.json({ ok: true }, { status: 201 });
	} catch {
		return Response.json(
			{
				error: "Your request could not be saved. Please try again or call us.",
			},
			{ status: 503 },
		);
	}
}
export async function GET() {
	if (!(await authenticated()))
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	return Response.json(
		{
			appointments: db()
				.prepare(
					"SELECT * FROM appointments ORDER BY createdAt DESC LIMIT 200",
				)
				.all(),
		},
		{ headers: { "Cache-Control": "no-store" } },
	);
}
