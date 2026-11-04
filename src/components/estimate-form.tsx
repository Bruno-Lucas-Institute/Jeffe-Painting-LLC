"use client";

import { ActionIcon } from "@/components/action-icon";
import type { FormEvent } from "react";
import { useState } from "react";
import { client } from "@/config/client";

export function EstimateForm() {
	const [notice, setNotice] = useState("");

	const [pending, setPending] = useState(false);
	const [sent, setSent] = useState(false);
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		setPending(true);
		setNotice("");
		setSent(false);
		try {
			const response = await fetch("/api/appointments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(Object.fromEntries(new FormData(form))),
			});
			const result = await response.json();
			if (!response.ok)
				throw new Error(result.error || "Please try again.");
			setSent(true);
			form.reset();
		} catch (error) {
			setNotice(
				error instanceof Error
					? error.message
					: "Could not send your request. Please try again.",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<form className="estimate-form" onSubmit={handleSubmit}>
			<div className="form-grid">
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
				<label className="form-full">
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
				<label className="form-full">
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
				<div className="sent-confirmation" role="status">
					<span className="success-check" aria-hidden="true">
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
