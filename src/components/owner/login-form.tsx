"use client";
import { useState } from "react";
import {
	LockKeyhole,
	ArrowRight,
	LoaderCircle,
	Eye,
	EyeOff,
} from "lucide-react";
export function LoginForm() {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [show, setShow] = useState(false);
	async function submit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		if (busy) return;
		const values = new FormData(event.currentTarget);
		setBusy(true);
		setError("");
		try {
			const response = await fetch("/api/owner/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: values.get("username"),
					password: values.get("password"),
				}),
			});
			const data = await response.json();
			if (!response.ok)
				throw new Error(data.error || "Unable to sign in.");
			window.location.replace("/owner");
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Connection interrupted. Please try again.",
			);
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
			<p className="eyebrow">Owner area</p>
			<h1>
				Your business,
				<br />
				<em>always within reach.</em>
			</h1>
			<p>
				Sign in to manage requests and enable notifications on this
				device.
			</p>
			<div className="field">
				<label htmlFor="username">Username</label>
				<input
					id="username"
					name="username"
					autoComplete="username"
					autoCapitalize="none"
					spellCheck={false}
					required
					maxLength={100}
					disabled={busy}
				/>
			</div>
			<div className="field">
				<label htmlFor="password">Password</label>
				<div className="password-field">
					<input
						id="password"
						name="password"
						type={show ? "text" : "password"}
						autoComplete="current-password"
						required
						maxLength={256}
						disabled={busy}
					/>
					<button
						type="button"
						onClick={() => setShow(!show)}
						aria-label={show ? "Hide password" : "Show password"}
					>
						{show ? <EyeOff size={19} /> : <Eye size={19} />}
					</button>
				</div>
			</div>
			<button className="button" disabled={busy}>
				{busy ? (
					<>
						<LoaderCircle size={18} className="spin" />
						Signing in…
					</>
				) : (
					<>
						Sign in to dashboard
						<ArrowRight size={18} />
					</>
				)}
			</button>
			<p role="alert" className="field-error">
				{error}
			</p>
			<small>Customers can submit requests without signing in.</small>
		</form>
	);
}
