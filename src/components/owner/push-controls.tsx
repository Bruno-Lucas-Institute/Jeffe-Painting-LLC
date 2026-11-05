"use client";
import { useEffect, useState } from "react";
import { Bell, BellOff, Download, Smartphone, Send } from "lucide-react";
import { pushBlock, type PushEnvironment } from "@/lib/push-capabilities";
type InstallEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: string }>;
};
function appKey(value: string) {
	const raw = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
	return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
async function api(path: string, method: string, body?: unknown) {
	const response = await fetch(path, {
		method,
		headers: { "Content-Type": "application/json" },
		body: body === undefined ? undefined : JSON.stringify(body),
		cache: "no-store",
	});
	const data = await response.json();
	if (!response.ok) {
		if (response.status === 401) window.location.replace("/login");
		throw new Error(
			data.error || "Não foi possível concluir. Tente novamente.",
		);
	}
	return data;
}
export function PushControls() {
	const [environment, setEnvironment] = useState<PushEnvironment | null>(
		null,
	);
	const [installed, setInstalled] = useState(false);
	const [ios, setIos] = useState(false);
	const [enabled, setEnabled] = useState(false);
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState("");
	const [installPrompt, setInstallPrompt] = useState<InstallEvent | null>(
		null,
	);
	const [configured, setConfigured] = useState<boolean | null>(null);
	useEffect(() => {
		let active = true;
		async function init() {
			const apple =
				/iPhone|iPad|iPod/.test(navigator.userAgent) ||
				(navigator.platform === "MacIntel" &&
					navigator.maxTouchPoints > 1);
			const standalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				!!(navigator as Navigator & { standalone?: boolean })
					.standalone;
			const canPush =
				window.isSecureContext &&
				"serviceWorker" in navigator &&
				"PushManager" in window &&
				"Notification" in window;
			if (active) {
				setIos(apple);
				setInstalled(standalone);
				setEnvironment({
					secure: window.isSecureContext,
					apisAvailable:
						"serviceWorker" in navigator &&
						"PushManager" in window &&
						"Notification" in window,
					ios: apple,
					installed: standalone,
					permission:
						"Notification" in window
							? Notification.permission
							: "default",
				});
			}
			try {
				const config = await api("/api/owner/push", "GET");
				if (active) setConfigured(config.configured);
				if (canPush && (!apple || standalone)) {
					const registration = await navigator.serviceWorker.register(
						"/sw.js",
						{ scope: "/", updateViaCache: "none" },
					);
					const sub =
						await registration.pushManager.getSubscription();

					if (sub && Notification.permission === "granted") {
						await api("/api/owner/push", "POST", sub.toJSON());
						if (active) setEnabled(true);
					}
				}
			} catch {
				if (active)
					setMessage(
						"Não foi possível confirmar as notificações. Toque em ativar para tentar novamente.",
					);
			}
		}
		void init();
		function capture(event: Event) {
			event.preventDefault();
			setInstallPrompt(event as InstallEvent);
		}
		function installedNow() {
			setInstalled(true);
			setInstallPrompt(null);
		}
		window.addEventListener("beforeinstallprompt", capture);
		window.addEventListener("appinstalled", installedNow);
		return () => {
			active = false;
			window.removeEventListener("beforeinstallprompt", capture);
			window.removeEventListener("appinstalled", installedNow);
		};
	}, []);
	const blocked = environment ? pushBlock(environment) : null;
	async function enable() {
		if (blocked) {
			setMessage(blocked.message);
			return;
		}
		if (ios && !installed) {
			setMessage(
				"No iPhone/iPad, adicione à Tela de Início, abra pelo ícone, entre novamente e toque em ativar.",
			);
			return;
		}
		setBusy(true);
		setMessage("");
		let sub: PushSubscription | null = null;
		try {
			if (
				!environment ||
				!environment.apisAvailable ||
				!environment.secure
			)
				throw new Error(
					"Use um navegador compatível em HTTPS para ativar notificações.",
				);
			const permission = await Notification.requestPermission();
			setEnvironment((previous) =>
				previous ? { ...previous, permission } : previous,
			);
			if (permission !== "granted")
				throw new Error(
					"Permissão não concedida. Você pode habilitar notificações nas configurações do navegador.",
				);
			const config = await api("/api/owner/push", "GET");
			if (!config.configured)
				throw new Error(
					"As notificações precisam ser configuradas no servidor.",
				);
			const registration = await navigator.serviceWorker.register(
				"/sw.js",
				{ scope: "/", updateViaCache: "none" },
			);
			await navigator.serviceWorker.ready;
			sub = await registration.pushManager.getSubscription();
			if (!sub)
				sub = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: appKey(config.publicKey),
				});
			await api("/api/owner/push", "POST", sub.toJSON());
			setEnabled(true);
			setMessage(
				"Notificações ativadas neste aparelho. Use o teste para conferir o recebimento.",
			);
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Não foi possível ativar.",
			);
		} finally {
			setBusy(false);
		}
	}
	async function disable(all = false) {
		setBusy(true);
		try {
			const registration =
				"serviceWorker" in navigator
					? await navigator.serviceWorker.getRegistration("/")
					: undefined;
			const sub = await registration?.pushManager.getSubscription();
			await api(
				"/api/owner/push",
				"DELETE",
				all ? { all: true } : { endpoint: sub?.endpoint },
			);
			await sub?.unsubscribe();
			const notifications = await registration?.getNotifications();
			notifications?.forEach((n) => n.close());
			setEnabled(false);
			setMessage(
				all
					? "Notificações desativadas em todos os aparelhos."
					: "Notificações desativadas neste aparelho.",
			);
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Não foi possível desativar.",
			);
		} finally {
			setBusy(false);
		}
	}
	async function test() {
		setBusy(true);
		try {
			const registration =
				await navigator.serviceWorker.getRegistration("/");
			const sub = await registration?.pushManager.getSubscription();
			if (!sub) throw new Error("Ative as notificações primeiro.");
			await api("/api/owner/push/test", "POST", sub.toJSON());
			setMessage(
				"Teste aceito pelo serviço de push. Confira a notificação no aparelho.",
			);
		} catch (error) {
			setMessage(
				error instanceof Error ? error.message : "O teste falhou.",
			);
		} finally {
			setBusy(false);
		}
	}
	async function install() {
		if (installPrompt) {
			await installPrompt.prompt();
			await installPrompt.userChoice;
			setInstallPrompt(null);
		} else
			setMessage(
				ios
					? "No Safari: Compartilhar → Adicionar à Tela de Início. Depois abra o ícone e entre no painel."
					: "No menu do navegador, escolha Instalar aplicativo ou Adicionar à tela inicial. Depois abra o ícone e entre no painel.",
			);
	}
	return (
		<section
			className="owner-notifications"
			aria-labelledby="notification-title"
		>
			<div className="owner-notification-heading">
				<span className="owner-lock">
					<Smartphone size={23} />
				</span>
				<div>
					<p className="eyebrow">Seu escritório, no bolso</p>
					<h2 id="notification-title">Receba cada novo pedido.</h2>
				</div>
				<span className={`owner-pill ${enabled ? "active" : ""}`}>
					{blocked
						? blocked.label
						: enabled
							? "Ativado neste aparelho"
							: environment
								? "Configurar aparelho"
								: "Verificando aparelho…"}
				</span>
			</div>
			<p>
				Instale o site e permita as notificações. Os avisos incluem um
				resumo do pedido; toque para abrir todas as informações no
				painel privado.
			</p>
			{blocked && (
				<p className="owner-warning" role="status">
					{blocked.message}
				</p>
			)}
			<div className="owner-action-row">
				{!installed && environment?.secure && (
					<button
						className="button secondary"
						type="button"
						onClick={install}
						disabled={busy}
					>
						<Download size={17} />
						Adicionar à tela inicial
					</button>
				)}
				{enabled ? (
					<>
						<button
							className="button"
							type="button"
							onClick={test}
							disabled={busy}
						>
							<Send size={17} />
							Testar notificação
						</button>
						<button
							className="owner-text-button"
							type="button"
							onClick={() => disable()}
							disabled={busy}
						>
							<BellOff size={16} />
							Desativar neste aparelho
						</button>
					</>
				) : (
					<button
						className="button"
						type="button"
						onClick={enable}
						disabled={
							busy ||
							configured === false ||
							!environment ||
							!!blocked
						}
					>
						<Bell size={17} />
						{busy
							? "Aguarde…"
							: blocked?.kind === "https"
								? "Disponível após conectar por HTTPS"
								: "Ativar notificações"}
					</button>
				)}
			</div>
			{configured === false && (
				<p className="owner-warning">
					As chaves de notificações ainda não estão configuradas no
					servidor.
				</p>
			)}

			<p className="owner-hint">
				Android: menu do navegador → Instalar aplicativo. iPhone: Safari
				→ Compartilhar → Adicionar à Tela de Início. Abra o ícone, entre
				e toque em Ativar notificações. Somente instalar não concede
				permissão.
			</p>
			<p className="owner-hint">
				Os detalhes podem aparecer na tela bloqueada, conforme as
				configurações do seu aparelho. Para interromper avisos num
				aparelho perdido, use o botão abaixo.
			</p>
			<button
				type="button"
				className="owner-text-button"
				disabled={busy}
				onClick={() => disable(true)}
			>
				Desativar notificações em todos os aparelhos
			</button>
			<p role="status" aria-live="polite" className="owner-push-status">
				{message}
			</p>
		</section>
	);
}
