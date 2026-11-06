import { client, ownerCopy } from "@/config/client";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isOwner } from "@/lib/owner/auth";
import { listInquiries, inquiryCounts } from "@/lib/owner/store";
import { pendingPushCount } from "@/lib/owner/push";
import { Dashboard } from "@/components/owner/dashboard";
export const metadata = {
	title: "Owner dashboard",
	robots: { index: false, follow: false },
};
export const instant = false;
async function OwnerContent() {
	await connection();
	if (!client.features.owner || !client.owner.enabled) notFound();
	if (!(await isOwner())) redirect("/login");
	return (
		<Dashboard
			initial={{
				items: listInquiries(25),
				...inquiryCounts(),
				pendingNotifications: pendingPushCount(),
			}}
			username={process.env.OWNER_USERNAME || ""}
		/>
	);
}
export default function Owner() {
	return (
		<Suspense
			fallback={
				<section className="owner-dashboard" lang={client.owner.locale}>
					<p>{ownerCopy.loading}</p>
				</section>
			}
		>
			<OwnerContent />
		</Suspense>
	);
}
