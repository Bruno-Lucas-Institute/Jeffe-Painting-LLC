import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authenticated } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
export const metadata: Metadata = {
	title: "Team sign in",
	robots: { index: false, follow: false },
};
async function LoginContent() {
	if (await authenticated()) redirect("/admin");
	return (
		<section className="login-section max-w-[540px]">
			<div className="contact-form-panel">
				<p className="eyebrow">Jeffe Painting · Team</p>
				<h1>Welcome back.</h1>
				<p>Sign in to view customer requests.</p>
				<LoginForm />
			</div>
		</section>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<p className="inbox-section">Loading…</p>}>
			<LoginContent />
		</Suspense>
	);
}
