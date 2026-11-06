"use client";
import { useRef, useState, type FormEvent } from "react";
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
			className="estimate-form"
			method="post"
			action="/api/quote"
			onSubmit={submit}
			noValidate
		>
			<fieldset className="estimate-fields" disabled={busy || sent}>
				<legend className="owner-sr-only">
					{client.content.formTitle}
				</legend>
				<div className="form-grid">
					{f.fields.map((field) => {
						const props = {
							id: field.id,
							name: field.id,
							required: field.required,
							"aria-invalid": !!errors[field.id],
							"aria-describedby": errors[field.id]
								? `${field.id}-error`
								: undefined,
						};
						return (
							<label
								key={field.id}
								className={
									field.width === "full" ? "form-full" : ""
								}
								htmlFor={field.id}
							>
								{field.label}
								{field.required ? " *" : ""}
								{field.type === "textarea" ? (
									<textarea
										{...props}
										maxLength={field.maxLength}
										placeholder={field.placeholder}
										rows={5}
									/>
								) : field.type === "select" ? (
									<select {...props} defaultValue="">
										<option value="" disabled>
											{field.placeholder || field.label}
										</option>
										{field.options?.map((option) => (
											<option
												value={option.value}
												key={option.value}
											>
												{option.label}
											</option>
										))}
									</select>
								) : (
									<input
										{...props}
										type={field.type}
										autoComplete={field.autoComplete}
										maxLength={field.maxLength}
										placeholder={field.placeholder}
									/>
								)}{" "}
								{errors[field.id] && (
									<span
										id={`${field.id}-error`}
										className="estimate-error"
									>
										{errors[field.id]?.[0]}
									</span>
								)}
							</label>
						);
					})}
					<label className="form-full" htmlFor="service">
						{f.serviceLabel}
						{f.serviceRequired ? " *" : ""}
						<select
							id="service"
							name="service"
							required={f.serviceRequired}
							defaultValue=""
							aria-invalid={!!errors.service}
							aria-describedby={
								errors.service ? "service-error" : undefined
							}
						>
							<option value="" disabled={f.serviceRequired}>
								{f.serviceLabel}
							</option>
							{client.services.map((service) => (
								<option key={service.id} value={service.id}>
									{service.title}
								</option>
							))}
							{f.allowOther && (
								<option value="other">{f.otherLabel}</option>
							)}
						</select>
						{errors.service && (
							<span id="service-error" className="estimate-error">
								{errors.service[0]}
							</span>
						)}
					</label>
				</div>
				<div className="owner-honeypot" aria-hidden="true">
					<label htmlFor="website">
						Leave empty
						<input
							id="website"
							name="website"
							tabIndex={-1}
							autoComplete="off"
						/>
					</label>
				</div>
				<button
					className="button"
					disabled={busy || sent}
					type="submit"
				>
					{busy ? f.sendingLabel : f.submitLabel}
					<ActionIcon name="send" />
				</button>
			</fieldset>
			<p
				ref={status}
				role="status"
				tabIndex={-1}
				className={`form-note ${notice ? "estimate-feedback" : ""}`}
				aria-live="polite"
			>
				{notice || f.note}
			</p>
			<dialog
				ref={dialog}
				className="request-success-dialog"
				aria-labelledby="request-success-title"
				onClose={() => setSent(false)}
			>
				<div className="success-check" aria-hidden="true">
					✓
				</div>
				<h2 id="request-success-title">{f.successTitle}</h2>
				<p>{f.successMessage}</p>
				<button
					type="button"
					className="button"
					onClick={() => dialog.current?.close()}
				>
					{f.closeLabel}
				</button>
			</dialog>
		</form>
	);
}
