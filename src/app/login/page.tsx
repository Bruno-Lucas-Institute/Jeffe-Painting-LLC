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
	if (await isOwner()) redirect("/owner");
	return <LoginForm />;
}
export default function Login() {
	return (
		<section className="owner-login-shell" lang="pt-BR">
			<Suspense fallback={<p>Carregando acesso seguro…</p>}>
				<LoginContent />
			</Suspense>
		</section>
	);
}
