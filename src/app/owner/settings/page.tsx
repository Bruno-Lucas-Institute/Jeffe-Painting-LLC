import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isOwner } from "@/lib/owner/auth";
import { readSettings } from "@/lib/owner/settings";
import { SettingsForm } from "@/components/owner/settings-form";
export const metadata = {
	title: "Configurações do site",
	robots: { index: false, follow: false },
};
export const instant = false;
async function SettingsContent() {
	await connection();
	if (!(await isOwner())) redirect("/login");
	return (
		<section className="container owner-dashboard" lang="pt-BR">
			<div className="owner-dashboard-heading">
				<h1>Configurações do site</h1>
				<Link className="button secondary" href="/owner">
					Voltar aos pedidos
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
				<section className="container owner-dashboard" lang="pt-BR">
					<p>Carregando configurações...</p>
				</section>
			}
		>
			<SettingsContent />
		</Suspense>
	);
}
