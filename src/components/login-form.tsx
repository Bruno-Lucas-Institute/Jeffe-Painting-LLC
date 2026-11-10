"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { buttonStyles } from "@/components/button";
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
		<form
			onSubmit={submit}
			className="[&_label]:text-2.75 [&_input]:bg-cream [&_input]:text-3.25 [&_input]:text-foreground [&_input:focus]:border-brand-red flex flex-col items-start [&_input]:min-h-11.75 [&_input]:w-full [&_input]:rounded-none [&_input]:border [&_input]:border-[#d8d6cc] [&_input]:px-3 [&_input]:py-2.75 [&_input]:outline-none [&_input:focus]:shadow-[0_0_0_2px_rgba(168,45,39,0.1)] [&_label]:flex [&_label]:flex-col [&_label]:gap-1.75 [&_label]:font-semibold [&_label]:text-[#4a4b45]"
		>
			<div className="grid w-full grid-cols-2 gap-4.25">
				<label className="col-span-full">
					Name
					<input
						name="name"
						autoComplete="username"
						required
						maxLength={200}
					/>
				</label>
				<label className="col-span-full">
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
			<button className={`mt-5.25 ${buttonStyles}`} disabled={pending}>
				{pending ? "Signing in…" : "Sign in"}
			</button>
			<p className="text-brand-red text-sm" role="alert">
				{error}
			</p>
		</form>
	);
}
