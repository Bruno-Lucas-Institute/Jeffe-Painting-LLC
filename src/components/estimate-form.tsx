"use client";

import { ActionIcon } from "@/components/action-icon";
import { buttonStyles } from "@/components/button";
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
		<form className="flex flex-col items-start" onSubmit={handleSubmit}>
			<div className="[&_label]:text-2.75 [&_input]:bg-cream [&_input]:text-3.25 [&_input]:text-foreground [&_input:focus]:border-brand-red [&_select]:bg-cream [&_select]:text-3.25 [&_select]:text-foreground [&_select:focus]:border-brand-red [&_textarea]:bg-cream [&_textarea]:text-3.25 [&_textarea]:text-foreground [&_textarea:focus]:border-brand-red grid w-full grid-cols-2 gap-5.5 max-[700px]:grid-cols-1 [&_input]:min-h-11.75 [&_input]:w-full [&_input]:rounded-none [&_input]:border [&_input]:border-[#d8d6cc] [&_input]:px-3 [&_input]:py-2.75 [&_input]:outline-none [&_input::placeholder]:text-[#999990] [&_input:focus]:shadow-[0_0_0_2px_rgba(168,45,39,0.1)] [&_label]:flex [&_label]:flex-col [&_label]:gap-2.25 [&_label]:font-semibold [&_label]:text-[#4a4b45] [&_select]:min-h-11.75 [&_select]:w-full [&_select]:rounded-none [&_select]:border [&_select]:border-[#d8d6cc] [&_select]:px-3 [&_select]:py-2.75 [&_select]:outline-none [&_select:focus]:shadow-[0_0_0_2px_rgba(168,45,39,0.1)] [&_textarea]:min-h-11.75 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-none [&_textarea]:border [&_textarea]:border-[#d8d6cc] [&_textarea]:px-3 [&_textarea]:py-2.75 [&_textarea]:outline-none [&_textarea::placeholder]:text-[#999990] [&_textarea:focus]:shadow-[0_0_0_2px_rgba(168,45,39,0.1)]">
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
				<label className="col-span-full">
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
				<label className="col-span-full">
					Tell us a little about your project
					<textarea
						name="details"
						placeholder="What would you like painted or refreshed?"
						required
						rows={5}
					/>
				</label>
			</div>
			<button
				className={`mt-5.25 ${buttonStyles}`}
				type="submit"
				disabled={pending}
			>
				{pending ? "Sending…" : "Request an appointment"}{" "}
				<ActionIcon name="send" />
			</button>
			{sent && (
				<div
					className="text-forest animate-confirmation-in mt-6 flex w-full items-center gap-4 rounded-xl border border-[#c0d3c4] bg-[#edf5ed] p-5"
					role="status"
				>
					<span
						className="bg-forest grid h-9.5 w-9.5 shrink-0 place-items-center rounded-full text-2xl text-white"
						aria-hidden="true"
					>
						✓
					</span>
					<div>
						<strong>Information sent</strong>
						<p className="mt-0.5 mb-0">
							Check your email for updates.
						</p>
					</div>
					<button
						className="text-6.5 ml-auto min-h-11 min-w-11 cursor-pointer border-0 bg-transparent"
						type="button"
						aria-label="Dismiss confirmation"
						onClick={() => setSent(false)}
					>
						×
					</button>
				</div>
			)}
			<p role="alert" className="text-2.5 text-muted mt-2.75 mb-0">
				{notice}
			</p>
		</form>
	);
}
