"use client";

import { ActionIcon } from "@/components/action-icon";
import type { FormEvent } from "react";
import { useState } from "react";
import { client } from "@/config/client";
import { estimateSchema } from "@/lib/validation/estimate";
import { ActionIcon } from "./action-icon";
export function EstimateForm() {
	const [notice, setNotice] = useState("");
	const [busy, setBusy] = useState(false);
	const [sent, setSent] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
		{},
	);
	const dialog = useRef<HTMLDialogElement>(null);
	const status = useRef<HTMLParagraphElement>(null);
	const f = client.form;
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (busy || sent) return;
		const form = event.currentTarget;
		setNotice("");
		const parsed = estimateSchema.safeParse(
			Object.fromEntries(new FormData(form)),
		);
		if (!parsed.success) {
			setErrors(parsed.error.flatten().fieldErrors);
			setNotice(f.errorSummary);
			requestAnimationFrame(() =>
				form
					.querySelector<HTMLElement>('[aria-invalid="true"]')
					?.focus(),
			);
			return;
		}
		setErrors({});
		setBusy(true);
		try {
			const response = await fetch("/api/quote", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(parsed.data),
				signal: AbortSignal.timeout(15000),
			});
			const result = await response.json();
			if (!response.ok) {
				setErrors(result.fields || {});
				throw new Error(
					result.error ||
						"Unable to save your request. Please try again.",
				);
			}
			if (result.mode !== "saved")
				throw new Error("The server did not confirm this request.");
			form.reset();
			if (dialog.current?.showModal) {
				setSent(true);
				dialog.current.showModal();
			} else setNotice(f.successTitle);
		} catch (error) {
			setNotice(
				error instanceof Error
					? error.message
					: "Connection interrupted. Your details are still here.",
			);
			requestAnimationFrame(() => status.current?.focus());
		} finally {
			setBusy(false);
		}
	}
	if (!client.features.inquiry) return null;
	return (
		<form
			className="estimate-form flex flex-col items-start"
			onSubmit={handleSubmit}
		>
			<div className="form-grid grid w-full grid-cols-2 gap-[17px]">
				<label>
					Your name
					<input autoComplete="name" name="name" required />
				</label>
				<label>
					Email address
					<input
						autoComplete="email"
						name="email"
						required
						type="email"
					/>
				</label>
				<label>
					Phone number
					<input
						autoComplete="tel"
						name="phone"
						required
						type="tel"
					/>
				</label>
				<label>
					Town or ZIP code
					<input autoComplete="postal-code" name="town" required />
				</label>
				<label className="form-full col-span-full">
					What can we help with?
					<select defaultValue="" name="service" required>
						<option disabled value="">
							Choose a service
						</option>
						{client.services.map((service) => (
							<option key={service.title} value={service.title}>
								{service.title}
							</option>
						))}
						<option value="Other painting project">
							Something else
						</option>
					</select>
				</label>
				<label className="form-full col-span-full">
					Tell us a little about your project
					<textarea
						name="details"
						placeholder="What would you like painted or refreshed?"
						required
						rows={5}
					/>
				</label>
			</div>
			<button className="button" type="submit" disabled={pending}>
				{pending ? "Sending…" : "Request an appointment"}{" "}
				<ActionIcon name="send" />
			</button>
			{sent && (
				<div
					className="sent-confirmation flex w-full gap-[16px] items-center mt-[24px] rounded-[12px] text-forest"
					role="status"
				>
					<span
						className="success-check grid place-items-center w-[38px] h-[38px] shrink-0 bg-forest text-white text-[24px]"
						aria-hidden="true"
					>
						✓
					</span>
					<div>
						<strong>Information sent</strong>
						<p>Check your email for updates.</p>
					</div>
					<button
						type="button"
						aria-label="Dismiss confirmation"
						onClick={() => setSent(false)}
					>
						×
					</button>
				</div>
			)}
			<p role="alert" className="form-note">
				{notice}
			</p>
		</form>
	);
}
