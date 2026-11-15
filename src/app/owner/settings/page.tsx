import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isOwner } from "@/lib/owner/auth";
import { readSettings } from "@/lib/owner/settings";
import { SettingsForm } from "@/components/owner/settings-form";
export const metadata = {
	title: "Website settings",
	robots: { index: false, follow: false },
};
export const instant = false;
async function SettingsContent() {
	await connection();
	if (!(await isOwner())) redirect("/login");
	return (
		<section className="container owner-dashboard" lang="en-US">
			<div className="owner-dashboard-heading">
				<h1>Website settings</h1>
				<Link className="button secondary" href="/owner">
					Back to requests
				</Link>
			</div>
			<SettingsForm initial={readSettings()} />
		</section>
	);
}
export default function SettingsPage() {
	return (
		<Suspense
			fallback={
				<section className="container owner-dashboard" lang="en-US">
					<p>Loading settings...</p>
				</section>
			}
		>
			<SettingsContent />
		</Suspense>
	);
}
