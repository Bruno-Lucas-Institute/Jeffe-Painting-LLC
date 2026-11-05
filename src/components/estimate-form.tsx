"use client";
import { ActionIcon } from "@/components/action-icon";
import { useRef, useState, type FormEvent } from "react";
import { client } from "@/config/client";
import { estimateSchema } from "@/lib/validation/estimate";
export function EstimateForm() {
	const [notice, setNotice] = useState("");
	const [busy, setBusy] = useState(false);
	const [sent, setSent] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
		{},
	);
	const dialog = useRef<HTMLDialogElement>(null);
	const status = useRef<HTMLParagraphElement>(null);
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (busy || sent) return;
		const form = event.currentTarget;
		setNotice("");
		const parsed = estimateSchema.safeParse(
			Object.fromEntries(new FormData(form)),
		);
		if (!parsed.success) {
			setErrors(parsed.error.flatten().fieldErrors);
			setNotice("Please check the highlighted fields.");
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
						"Your request could not be saved. Please try again.",
				);
			}
			if (result.mode !== "saved")
				throw new Error(
					"Your request was not confirmed. Please try again.",
				);
			form.reset();
			if (
				dialog.current &&
				typeof dialog.current.showModal === "function"
			) {
				setSent(true);
				dialog.current.showModal();
			} else setNotice("Solicitação enviada com sucesso!");
		} catch (error) {
			setNotice(
				error instanceof Error && error.name !== "TimeoutError"
					? error.message
					: "Connection interrupted. Your details are still here. Please try again.",
			);
			requestAnimationFrame(() => status.current?.focus());
		} finally {
			setBusy(false);
		}
	}
	function field(
		name: string,
		label: string,
		type = "text",
		maxLength = 200,
	) {
		return (
			<label htmlFor={name}>
				{label}
				<input
					id={name}
					name={name}
					type={type}
					required
					maxLength={maxLength}
					autoComplete={
						name === "name"
							? "name"
							: name === "email"
								? "email"
								: name === "phone"
									? "tel"
									: "postal-code"
					}
					aria-invalid={!!errors[name]}
					aria-describedby={
						errors[name] ? `${name}-error` : undefined
					}
				/>
				{errors[name] && (
					<span id={`${name}-error`} className="estimate-error">
						{errors[name]?.[0]}
					</span>
				)}
			</label>
		);
	}
	return (
		<form
			className="estimate-form"
			method="post"
			action="/api/quote"
			onSubmit={handleSubmit}
			noValidate
		>
			<fieldset disabled={busy || sent} className="estimate-fields">
				<legend className="owner-sr-only">Estimate request</legend>
				<div className="form-grid">
					{field("name", "Your name", "text", 100)}
					{field("email", "Email address", "email")}
					{field("phone", "Phone number", "tel", 30)}
					{field("town", "Town or ZIP code")}
					<label className="form-full" htmlFor="service">
						What can we help with?
						<select
							id="service"
							name="service"
							defaultValue=""
							required
							aria-invalid={!!errors.service}
							aria-describedby={
								errors.service ? "service-error" : undefined
							}
						>
							<option value="" disabled>
								Choose a service
							</option>
							{client.services.map((service) => (
								<option
									key={service.title}
									value={service.title}
								>
									{service.title}
								</option>
							))}
							<option value="Other painting project">
								Something else
							</option>
						</select>
						{errors.service && (
							<span id="service-error" className="estimate-error">
								{errors.service[0]}
							</span>
						)}
					</label>
					<label className="form-full" htmlFor="details">
						Tell us a little about your project
						<textarea
							id="details"
							name="details"
							required
							rows={5}
							maxLength={4000}
							placeholder="What would you like painted or refreshed? (At least 10 characters)"
							aria-invalid={!!errors.details}
							aria-describedby={
								errors.details ? "details-error" : undefined
							}
						/>
						{errors.details && (
							<span id="details-error" className="estimate-error">
								{errors.details[0]}
							</span>
						)}
					</label>
				</div>
				<div className="owner-honeypot" aria-hidden="true">
					<label htmlFor="website">
						Leave this empty
						<input
							id="website"
							name="website"
							autoComplete="off"
							tabIndex={-1}
						/>
					</label>
				</div>
				<button
					className="button"
					type="submit"
					disabled={busy || sent}
				>
					{busy
						? "Sending your request…"
						: "Send my estimate request"}
					<ActionIcon name="send" />
				</button>
			</fieldset>
			<p
				ref={status}
				tabIndex={-1}
				role="status"
				aria-live="polite"
				className={`form-note ${notice ? "estimate-feedback" : ""}`}
			>
				{notice ||
					"No account needed. Your request is sent directly to the business owner."}
			</p>
			<dialog
				ref={dialog}
				className="request-success-dialog"
				aria-labelledby="request-success-title"
				onClose={() => setSent(false)}
				lang="pt-BR"
			>
				<div className="success-check" aria-hidden="true">
					✓
				</div>
				<h2 id="request-success-title">
					Solicitação enviada com sucesso!
				</h2>
				<p>Obrigado! Recebemos as informações do seu pedido.</p>
				<button
					className="button"
					type="button"
					onClick={() => dialog.current?.close()}
				>
					OK
				</button>
			</dialog>
		</form>
	);
}
