"use client";
import { useState } from "react";
import {
	LockKeyhole,
	ArrowRight,
	LoaderCircle,
	Eye,
	EyeOff,
} from "lucide-react";
import { ownerCopy as t } from "@/config/client";
export function LoginForm() {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [show, setShow] = useState(false);
	async function submit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		if (busy) return;
		const form = new FormData(event.currentTarget);
		setBusy(true);
		setError("");
		try {
			const response = await fetch("/api/owner/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: form.get("username"),
					password: form.get("password"),
				}),
				signal: AbortSignal.timeout(15000),
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || t.loginError);
			window.location.replace("/owner");
		} catch (error) {
			setError(error instanceof Error ? error.message : t.genericError);
			setBusy(false);
		}
	}
	return (
		<form
			method="post"
			action="/api/owner/login"
			onSubmit={submit}
			className="owner-login-form"
		>
			<span className="owner-lock">
				<LockKeyhole size={25} />
			</span>
			<p className="eyebrow">{t.loginEyebrow}</p>
			<h1>
				{t.loginTitle}
				<br />
				<em>{t.loginAccent}</em>
			</h1>
			<p>{t.loginDescription}</p>
			<div className="field">
				<label htmlFor="username">{t.username}</label>
				<input
					id="username"
					name="username"
					required
					maxLength={100}
					autoComplete="username"
					autoCapitalize="none"
					spellCheck={false}
					disabled={busy}
				/>
			</div>
			<div className="field">
				<label htmlFor="password">{t.password}</label>
				<div className="password-field">
					<input
						id="password"
						name="password"
						required
						maxLength={256}
						autoComplete="current-password"
						type={show ? "text" : "password"}
						disabled={busy}
					/>
					<button
						type="button"
						onClick={() => setShow(!show)}
						aria-label={show ? t.hidePassword : t.showPassword}
					>
						{show ? <EyeOff size={19} /> : <Eye size={19} />}
					</button>
				</div>
			</div>
			<button type="submit" className="button" disabled={busy}>
				{busy ? (
					<>
						<LoaderCircle size={18} className="spin" />
						{t.signingIn}
					</>
				) : (
					<>
						{t.signIn}
						<ArrowRight size={18} />
					</>
				)}
			</button>
			<p role="alert" className="field-error">
				{error}
			</p>
			<small>{t.visitorNote}</small>
		</form>
	);
}
