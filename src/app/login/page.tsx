import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authenticated } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { eyebrow } from "@/app/styles";
export const metadata: Metadata = {
	title: "Team sign in",
	robots: { index: false, follow: false },
};
async function LoginContent() {
	if (await authenticated()) redirect("/admin");
	return (
		<section className="mx-auto my-15 max-w-135 px-4.5">
			<div className="border-line border bg-white p-9.75 max-[760px]:p-6">
				<p className={eyebrow}>Jeffe Painting · Team</p>
				<h1 className="font-heading text-10.5 leading-[1.15]">
					Welcome back.
				</h1>
				<p className="text-muted text-sm">
					Sign in to view customer requests.
				</p>
				<LoginForm />
			</div>
		</section>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<p className="text-muted px-6 py-10">Loading…</p>}>
			<LoginContent />
		</Suspense>
	);
}
