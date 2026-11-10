import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authenticated } from "@/lib/auth";
import { AdminInbox } from "@/components/admin-inbox";
import { eyebrow, pageHero, pageHeroCopy, pageHeroTitle } from "@/app/styles";
export const metadata: Metadata = {
	title: "Customer inbox",
	robots: { index: false, follow: false },
};
async function AdminContent() {
	if (!(await authenticated())) redirect("/login");
	return (
		<>
			<section className={`${pageHero} pb-17.5 max-[760px]:pb-12.5`}>
				<p className={eyebrow}>Jeffe Painting · Private inbox</p>
				<h1 className={pageHeroTitle}>Hello, Jef.</h1>
				<p className={pageHeroCopy}>
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
		<Suspense fallback={<p className="text-muted px-6 py-10">Loading…</p>}>
			<AdminContent />
		</Suspense>
	);
}
