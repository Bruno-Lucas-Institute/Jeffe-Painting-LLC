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
			data.error || "Unable to complete the action. Please try again.",
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
						"Unable to confirm notifications. Tap enable to try again.",
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
				"On iPhone/iPad, add this site to your Home Screen, open its icon, sign in again and tap enable.",
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
					"Use a supported browser over HTTPS to enable notifications.",
				);
			const permission = await Notification.requestPermission();
			setEnvironment((previous) =>
				previous ? { ...previous, permission } : previous,
			);
			if (permission !== "granted")
				throw new Error(
					"Permission was not granted. You can allow notifications in your browser settings.",
				);
			const config = await api("/api/owner/push", "GET");
			if (!config.configured)
				throw new Error(
					"Notifications need to be configured on the server.",
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
				"Notifications enabled on this device. Send a test to check delivery.",
			);
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Unable to enable notifications.",
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
					? "Notifications disabled on all devices."
					: "Notifications disabled on this device.",
			);
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Unable to disable notifications.",
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
			if (!sub) throw new Error("Enable notifications first.");
			await api("/api/owner/push/test", "POST", sub.toJSON());
			setMessage(
				"Test accepted by the push service. Check for the notification on your device.",
			);
		} catch (error) {
			setMessage(
				error instanceof Error ? error.message : "The test failed.",
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
					? "In Safari: Share → Add to Home Screen. Then open the icon and sign in to the dashboard."
					: "In your browser menu, choose Install app or Add to Home Screen. Then open the icon and sign in to the dashboard.",
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
					<p className="eyebrow">Your office in your pocket</p>
					<h2 id="notification-title">Get every new request.</h2>
				</div>
				<span className={`owner-pill ${enabled ? "active" : ""}`}>
					{blocked
						? blocked.label
						: enabled
							? "Enabled on this device"
							: environment
								? "Set up device"
								: "Checking device…"}
				</span>
			</div>
			<p>
				Install the site and allow notifications. Alerts include a
				request summary; tap to view the full details in your private
				dashboard.
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
						Add to Home Screen
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
							Test notification
						</button>
						<button
							className="owner-text-button"
							type="button"
							onClick={() => disable()}
							disabled={busy}
						>
							<BellOff size={16} />
							Disable on this device
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
							? "Please wait…"
							: blocked?.kind === "https"
								? "Available over HTTPS"
								: "Enable notifications"}
					</button>
				)}
			</div>
			{configured === false && (
				<p className="owner-warning">
					Notification keys have not been configured on the server
					yet.
				</p>
			)}

			<p className="owner-hint">
				Android: browser menu → Install app. iPhone: Safari → Share →
				Add to Home Screen. Open the icon, sign in and tap Enable
				notifications. Installation alone does not grant permission.
			</p>
			<p className="owner-hint">
				Request details may appear on your lock screen, depending on
				your device settings. To stop alerts on a lost device, use the
				button below.
			</p>
			<button
				type="button"
				className="owner-text-button"
				disabled={busy}
				onClick={() => disable(true)}
			>
				Disable notifications on all devices
			</button>
			<p role="status" aria-live="polite" className="owner-push-status">
				{message}
			</p>
		</section>
	);
}
