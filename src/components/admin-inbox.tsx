"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Appointment } from "@/lib/appointments";
export function AdminInbox() {
	const router = useRouter();
	const [items, setItems] = useState<Appointment[]>([]);
	const [notice, setNotice] = useState("Loading requests…");
	const [pushNotice, setPushNotice] = useState("");
	const refresh = useCallback(async () => {
		try {
			const response = await fetch("/api/appointments", {
				cache: "no-store",
			});
			if (response.status === 401) {
				router.push("/login");
				return;
			}
			if (!response.ok) throw new Error();
			const data = await response.json();
			setItems(data.appointments);
			setNotice("");
		} catch {
			setNotice("Could not load requests. Please try again.");
		}
	}, [router]);
	useEffect(() => {
		const initial = setTimeout(() => void refresh(), 0);
		const timer = setInterval(() => void refresh(), 15000);
		return () => {
			clearTimeout(initial);
			clearInterval(timer);
		};
	}, [refresh]);
	async function enablePush() {
		try {
			if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
				setPushNotice(
					"Add this site to your Home Screen and open it there to enable notifications.",
				);
				return;
			}
			const permission = await Notification.requestPermission();
			if (permission !== "granted") {
				setPushNotice(
					"Allow notifications in your browser settings to receive alerts.",
				);
				return;
			}
			const response = await fetch("/api/push");
			if (!response.ok) throw new Error();
			const { publicKey } = await response.json();
			if (!publicKey) {
				setPushNotice(
					"Push notifications need server configuration. Requests are saved in this inbox.",
				);
				return;
			}
			await navigator.serviceWorker.register("/sw.js");
			const registration = await navigator.serviceWorker.ready;
			const decoded = atob(
				publicKey.replace(/-/g, "+").replace(/_/g, "/"),
			);
			const key = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
			const subscription =
				(await registration.pushManager.getSubscription()) ||
				(await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: key,
				}));
			const saved = await fetch("/api/push", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(subscription),
			});
			if (!saved.ok) throw new Error();
			setPushNotice("Notifications enabled on this device.");
		} catch {
			setPushNotice("Could not enable notifications. Please try again.");
		}
	}
	async function logout() {
		try {
			const response = await fetch("/api/auth", { method: "DELETE" });
			if (!response.ok) throw new Error();
			router.push("/login");
		} catch {
			setNotice("Could not sign out. Please try again.");
		}
	}
	return (
		<section className="inbox-section">
			<div className="inbox-toolbar flex items-center flex-wrap gap-[24px]">
				<button className="button" onClick={enablePush}>
					Enable notifications
				</button>
				<button className="text-link" onClick={refresh}>
					Refresh
				</button>
				<button className="text-link" onClick={logout}>
					Sign out
				</button>
			</div>
			<p className="form-note">
				On iPhone: Share → Add to Home Screen. Open the app, sign in,
				then enable notifications.
			</p>
			<p role="status">{pushNotice}</p>
			<p role="status">{notice}</p>
			<h2>
				Customer requests{" "}
				<span className="text-brand-red">{items.length}</span>
			</h2>
			{!notice && !items.length && (
				<div className="inbox-card">
					Your inbox is ready. New estimate requests will appear here.
				</div>
			)}
			<div className="inbox-grid grid grid-cols-2 gap-[24px]">
				{items.map((item) => (
					<article className="inbox-card" key={item.id}>
						<p className="eyebrow">{item.service}</p>
						<h3>{item.name}</h3>
						<p>
							<time dateTime={item.createdAt}>
								{new Date(item.createdAt).toLocaleString()}
							</time>
						</p>
						<dl>
							<dt>Email</dt>
							<dd>
								<a
									className="text-link"
									href={`mailto:${item.email}`}
								>
									{item.email}
								</a>
							</dd>
							<dt>Phone</dt>
							<dd>{item.phone}</dd>
							<dt>Town / ZIP</dt>
							<dd>{item.town}</dd>
						</dl>
						<p className="whitespace-pre-wrap">{item.details}</p>
						<a
							className="button button-small"
							href={`mailto:${item.email}?subject=Your%20Jeffe%20Painting%20estimate`}
						>
							Reply by email
						</a>
					</article>
				))}
			</div>
		</section>
	);
}
