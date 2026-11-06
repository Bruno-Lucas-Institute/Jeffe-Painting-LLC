"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
export function LoginForm() {
	const router = useRouter();
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPending(true);
		setError("");
		const fields = new FormData(event.currentTarget);
		try {
			const response = await fetch("/api/auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(Object.fromEntries(fields)),
			});
			const result = await response.json();
			if (!response.ok)
				throw new Error(result.error || "Unable to sign in.");
			router.push("/admin");
			router.refresh();
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Unable to sign in.",
			);
			setPending(false);
		}
	}
	return (
		<form onSubmit={submit} className="estimate-form">
			<div className="form-grid">
				<label className="form-full">
					Name
					<input
						name="name"
						autoComplete="username"
						required
						maxLength={200}
					/>
				</label>
				<label className="form-full">
					Password
					<input
						name="password"
						type="password"
						autoComplete="current-password"
						required
						maxLength={200}
					/>
				</label>
			</div>
			<button className="button" disabled={pending}>
				{pending ? "Signing in…" : "Sign in"}
			</button>
			<p role="alert">{error}</p>
		</form>
	);
}
