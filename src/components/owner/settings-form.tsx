"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { BusinessSettings } from "@/lib/validation/settings";
const fields = [
	["businessName", "Nome da empresa"],
	["shortName", "Nome curto"],
	["logoName", "Texto do logo"],
	["logoTagline", "Subtítulo do logo"],
	["logoUrl", "URL HTTPS da imagem do logo (opcional)"],
	["phone", "Telefone"],
	["email", "E-mail"],
	["location", "Localização"],
	["serviceArea", "Região atendida"],
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
				throw new Error(result.error || "Não foi possível salvar.");
			setSettings(result.settings);
			setMessage("Configurações salvas. O site já foi atualizado.");
			router.refresh();
		} catch (error) {
			setError(true);
			setMessage(
				error instanceof Error
					? error.message
					: "Não foi possível salvar. Tente novamente.",
			);
		} finally {
			setBusy(false);
		}
	}
	return (
		<section
			className="owner-inbox owner-settings"
			lang="pt-BR"
			aria-labelledby="settings-title"
		>
			<p className="eyebrow">Seu site</p>
			<h2 id="settings-title">Configurações do site</h2>
			<p>
				Altere os dados exibidos no site. Deixe a URL do logo vazia para
				usar o logo em texto.
			</p>
			<form onSubmit={save}>
				<fieldset disabled={busy} className="settings-grid">
					<legend className="sr-only">Dados da empresa</legend>
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
						Cidades atendidas (separadas por vírgula)
						<input
							id="serviceTowns"
							value={towns}
							required
							onChange={(event) => setTowns(event.target.value)}
						/>
					</label>
					<label htmlFor="yearsExperience">
						Anos de experiência
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
					<legend>Horário de atendimento</legend>
					{settings.hours.map((hour, index) => (
						<div className="settings-hour" key={index}>
							<label>
								Dias
								<input
									aria-label={"Dias " + (index + 1)}
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
								Horário
								<input
									aria-label={"Horário " + (index + 1)}
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
								Remover
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
						Adicionar horário
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
					{busy ? "Salvando..." : "Salvar configurações"}
				</button>
			</form>
		</section>
	);
}
