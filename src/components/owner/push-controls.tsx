"use client";
import { useEffect, useState } from "react";
import { Bell, BellOff, Download, Smartphone, Send } from "lucide-react";
import { ownerCopy as t } from "@/config/client";
import { pushBlock, type PushEnvironment } from "@/lib/push-capabilities";
type InstallEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: string }>;
};
function appKey(value: string) {
	const raw = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
	return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
function environment(): PushEnvironment {
	return {
		secure: window.isSecureContext,
		apisAvailable:
			"serviceWorker" in navigator &&
			"PushManager" in window &&
			"Notification" in window,
		ios:
			/iPhone|iPad|iPod/.test(navigator.userAgent) ||
			(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
		installed:
			window.matchMedia("(display-mode: standalone)").matches ||
			!!(navigator as Navigator & { standalone?: boolean }).standalone,
		permission:
			"Notification" in window ? Notification.permission : "default",
	};
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
		throw new Error(data.error || t.genericError);
	}
	return data;
}
export function PushControls() {
	const [device, setDevice] = useState<PushEnvironment | null>(null);
	const [enabled, setEnabled] = useState(false);
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState("");
	const [configured, setConfigured] = useState<boolean | null>(null);
	const [installPrompt, setInstallPrompt] = useState<InstallEvent | null>(
		null,
	);
	const blocked = device ? pushBlock(device, t) : null;
	useEffect(() => {
		let active = true;
		async function init() {
			const env = environment();
			if (active) setDevice(env);
			try {
				const config = await api("/api/owner/push", "GET");
				if (active) setConfigured(config.configured);
				if (
					env.secure &&
					env.apisAvailable &&
					(!env.ios || env.installed) &&
					config.configured
				) {
					const registration = await navigator.serviceWorker.register(
						"/sw.js",
						{ scope: "/", updateViaCache: "none" },
					);
					const sub =
						await registration.pushManager.getSubscription();
					if (sub && env.permission === "granted") {
						await api("/api/owner/push", "POST", sub.toJSON());
						if (active) setEnabled(true);
					}
				}
			} catch {
				if (active) setMessage(t.pushInitError);
			}
		}
		void init();
		const capture = (event: Event) => {
			event.preventDefault();
			setInstallPrompt(event as InstallEvent);
		};
		const update = () => setDevice(environment());
		window.addEventListener("beforeinstallprompt", capture);
		window.addEventListener("appinstalled", update);
		window.addEventListener("focus", update);
		return () => {
			active = false;
			window.removeEventListener("beforeinstallprompt", capture);
			window.removeEventListener("appinstalled", update);
			window.removeEventListener("focus", update);
		};
	}, []);
	async function enable() {
		if (blocked) {
			setMessage(blocked.message);
			return;
		}
		setBusy(true);
		setMessage("");
		try {
			if (!device?.apisAvailable || !device.secure)
				throw new Error(t.httpsMessage);
			const permission = await Notification.requestPermission();
			setDevice((previous) =>
				previous ? { ...previous, permission } : previous,
			);
			if (permission !== "granted") throw new Error(t.deniedMessage);
			const config = await api("/api/owner/push", "GET");
			if (!config.configured) throw new Error(t.serverNotConfigured);
			const registration = await navigator.serviceWorker.register(
				"/sw.js",
				{ scope: "/", updateViaCache: "none" },
			);
			await navigator.serviceWorker.ready;
			let sub = await registration.pushManager.getSubscription();
			if (!sub)
				sub = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: appKey(config.publicKey),
				});
			await api("/api/owner/push", "POST", sub.toJSON());
			setEnabled(true);
			setMessage(t.pushEnabled);
		} catch (error) {
			setMessage(error instanceof Error ? error.message : t.genericError);
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
			(await registration?.getNotifications())?.forEach((n) => n.close());
			setEnabled(false);
			setMessage(all ? t.pushDisabledAll : t.pushDisabled);
		} catch (error) {
			setMessage(error instanceof Error ? error.message : t.genericError);
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
			if (!sub) throw new Error(t.enableFirst);
			await api("/api/owner/push/test", "POST", sub.toJSON());
			setMessage(t.testAccepted);
		} catch (error) {
			setMessage(error instanceof Error ? error.message : t.testFailed);
		} finally {
			setBusy(false);
		}
	}
	async function install() {
		if (installPrompt) {
			await installPrompt.prompt();
			await installPrompt.userChoice;
			setInstallPrompt(null);
		} else setMessage(device?.ios ? t.installMessage : t.installAndroid);
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
					<p className="eyebrow">{t.notificationEyebrow}</p>
					<h2 id="notification-title">{t.notificationTitle}</h2>
				</div>
				<span className={`owner-pill ${enabled ? "active" : ""}`}>
					{blocked
						? blocked.label
						: enabled
							? t.notificationEnabled
							: device
								? t.notificationSetup
								: t.notificationChecking}
				</span>
			</div>
			<p>{t.notificationDescription}</p>
			{blocked && (
				<p className="owner-warning" role="status">
					{blocked.message}
				</p>
			)}
			<div className="owner-action-row">
				{device?.secure && !device.installed && (
					<button
						type="button"
						className="button secondary"
						disabled={busy}
						onClick={install}
					>
						<Download size={17} />
						{t.install}
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
							{t.test}
						</button>
						<button
							className="owner-text-button"
							type="button"
							onClick={() => disable()}
							disabled={busy}
						>
							<BellOff size={16} />
							{t.disable}
						</button>
					</>
				) : (
					<button
						className="button"
						type="button"
						onClick={enable}
						disabled={
							busy || configured === false || !device || !!blocked
						}
					>
						<Bell size={17} />
						{busy ? t.working : t.enable}
					</button>
				)}
			</div>
			{configured === false && (
				<p className="owner-warning">{t.serverNotConfigured}</p>
			)}
			<p className="owner-hint">{t.deviceInstructions}</p>
			<p className="owner-hint">{t.devicePrivacy}</p>
			<button
				className="owner-text-button"
				type="button"
				onClick={() => disable(true)}
				disabled={busy}
			>
				{t.disableAll}
			</button>
			<p role="status" aria-live="polite" className="owner-push-status">
				{message}
			</p>
		</section>
	);
}
