import { client, ownerCopy } from "@/config/client";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { authenticated } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
export const metadata: Metadata = {
	title: "Team sign in",
	robots: { index: false, follow: false },
};
export const instant = false;
async function LoginContent() {
	await connection();
	if (!client.features.owner || !client.owner.enabled) notFound();
	if (await isOwner()) redirect("/owner");
	return <LoginForm />;
}
export default function Login() {
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
