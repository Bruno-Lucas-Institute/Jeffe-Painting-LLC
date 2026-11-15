"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { BusinessSettings } from "@/lib/validation/settings";
const fields = [
	["businessName", "Business name"],
	["shortName", "Short name"],
	["logoName", "Logo text"],
	["logoTagline", "Logo tagline"],
	["logoUrl", "Logo image HTTPS URL (optional)"],
	["phone", "Phone"],
	["email", "E-mail"],
	["location", "Location"],
	["serviceArea", "Service area"],
	["facebook", "Facebook (URL HTTPS)"],
	["instagram", "Instagram (URL HTTPS)"],
] as const;
export function SettingsForm({ initial }: { initial: BusinessSettings }) {
	const [settings, setSettings] = useState(initial);
	const [towns, setTowns] = useState(initial.serviceTowns.join(", "));
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState(false);
	const router = useRouter();
	async function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setBusy(true);
		setMessage("");
		setError(false);
		try {
			const response = await fetch("/api/owner/settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...settings,
					serviceTowns: towns
						.split(",")
						.map((town) => town.trim())
						.filter(Boolean),
				}),
			});
			if (response.status === 401) {
				window.location.replace("/login");
				return;
			}
			const result = await response.json();
			if (!response.ok)
				throw new Error(result.error || "Unable to save.");
			setSettings(result.settings);
			setMessage("Settings saved. Your website has been updated.");
			router.refresh();
		} catch (error) {
			setError(true);
			setMessage(
				error instanceof Error
					? error.message
					: "Unable to save. Please try again.",
			);
		} finally {
			setBusy(false);
		}
	}
	return (
		<section
			className="owner-inbox owner-settings"
			lang="en-US"
			aria-labelledby="settings-title"
		>
			<p className="eyebrow">Your website</p>
			<h2 id="settings-title">Website settings</h2>
			<p>
				Update the information shown on your website. Leave the logo URL
				empty to use a text logo.
			</p>
			<form onSubmit={save}>
				<fieldset disabled={busy} className="settings-grid">
					<legend className="sr-only">Business information</legend>
					{fields.map(([key, label]) => (
						<label key={key} htmlFor={key}>
							{label}
							<input
								id={key}
								name={key}
								type={
									key === "email"
										? "email"
										: key === "phone"
											? "tel"
											: key
														.toLowerCase()
														.includes("url") ||
												  key === "facebook" ||
												  key === "instagram"
												? "url"
												: "text"
								}
								required={
									![
										"logoUrl",
										"logoTagline",
										"facebook",
										"instagram",
									].includes(key)
								}
								maxLength={
									key === "email"
										? 254
										: [
													"logoUrl",
													"facebook",
													"instagram",
											  ].includes(key)
											? 2000
											: key === "phone"
												? 40
												: key === "logoTagline"
													? 100
													: 160
								}
								value={settings[key]}
								onChange={(event) =>
									setSettings({
										...settings,
										[key]: event.target.value,
									})
								}
							/>
						</label>
					))}
					<label htmlFor="serviceTowns">
						Service towns (comma-separated)
						<input
							id="serviceTowns"
							value={towns}
							required
							onChange={(event) => setTowns(event.target.value)}
						/>
					</label>
					<label htmlFor="yearsExperience">
						Years of experience
						<input
							id="yearsExperience"
							type="number"
							min="0"
							max="100"
							required
							value={settings.yearsExperience}
							onChange={(event) =>
								setSettings({
									...settings,
									yearsExperience: Number(event.target.value),
								})
							}
						/>
					</label>
				</fieldset>
				<fieldset disabled={busy} className="settings-hours">
					<legend>Business hours</legend>
					{settings.hours.map((hour, index) => (
						<div className="settings-hour" key={index}>
							<label>
								Days
								<input
									aria-label={"Days " + (index + 1)}
									required
									maxLength={160}
									value={hour.days}
									onChange={(event) =>
										setSettings({
											...settings,
											hours: settings.hours.map(
												(value, i) =>
													i === index
														? {
																...value,
																days: event
																	.target
																	.value,
															}
														: value,
											),
										})
									}
								/>
							</label>
							<label>
								Hours
								<input
									aria-label={"Hours " + (index + 1)}
									required
									maxLength={160}
									value={hour.hours}
									onChange={(event) =>
										setSettings({
											...settings,
											hours: settings.hours.map(
												(value, i) =>
													i === index
														? {
																...value,
																hours: event
																	.target
																	.value,
															}
														: value,
											),
										})
									}
								/>
							</label>
							<button
								type="button"
								className="owner-text-button"
								disabled={settings.hours.length === 1}
								onClick={() =>
									setSettings({
										...settings,
										hours: settings.hours.filter(
											(_, i) => i !== index,
										),
									})
								}
							>
								Remove
							</button>
						</div>
					))}
					<button
						type="button"
						className="owner-text-button"
						disabled={settings.hours.length >= 14}
						onClick={() =>
							setSettings({
								...settings,
								hours: [
									...settings.hours,
									{ days: "", hours: "" },
								],
							})
						}
					>
						Add hours
					</button>
				</fieldset>
				<p
					role={error ? "alert" : "status"}
					className={error ? "field-error" : ""}
				>
					{message}
				</p>
				<button
					className="button primary"
					type="submit"
					disabled={busy}
				>
					{busy ? "Saving..." : "Save settings"}
				</button>
			</form>
		</section>
	);
}
