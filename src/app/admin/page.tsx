import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authenticated } from "@/lib/auth";
import { AdminInbox } from "@/components/admin-inbox";
export const metadata: Metadata = {
	title: "Customer inbox",
	robots: { index: false, follow: false },
};
async function AdminContent() {
	if (!(await authenticated())) redirect("/login");
	return (
		<>
			<section className="page-hero contact-hero">
				<p className="eyebrow">Jeffe Painting · Private inbox</p>
				<h1>Hello, Jef.</h1>
				<p>
					Your next great project starts here. View customer details
					and reply directly.
				</p>
			</section>
			<AdminInbox />
		</>
	);
}

export default function AdminPage() {
	return (
		<Suspense fallback={<p className="inbox-section">Loading…</p>}>
			<AdminContent />
		</Suspense>
	);
}
