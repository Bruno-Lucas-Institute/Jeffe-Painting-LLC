import { client, ownerCopy } from "@/config/client";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isOwner } from "@/lib/owner/auth";
import { LoginForm } from "@/components/owner/login-form";
export const metadata = {
	title: "Owner login",
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
		<section className="owner-login-shell" lang={client.owner.locale}>
			<Suspense fallback={<p>{ownerCopy.loading}</p>}>
				<LoginContent />
			</Suspense>
		</section>
	);
}
