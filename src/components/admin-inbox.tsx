"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Appointment } from "@/lib/appointments";
import { buttonStyles, smallButtonStyles } from "@/components/button";
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
		<section className="px-[max(24px,calc((100vw-1200px)/2))] pb-20 max-[760px]:px-6">
			<div className="flex flex-wrap items-center gap-6 [&>button]:cursor-pointer">
				<button
					className={`button ${buttonStyles}`}
					onClick={enablePush}
				>
					Enable notifications
				</button>
				<button
					className="text-3.25 hover:text-brand-red inline-flex items-center gap-2.75 border-0 border-b border-current bg-transparent pb-0.75 font-semibold transition-colors"
					onClick={refresh}
				>
					Refresh
				</button>
				<button
					className="text-3.25 hover:text-brand-red inline-flex items-center gap-2.75 border-0 border-b border-current bg-transparent pb-0.75 font-semibold transition-colors"
					onClick={logout}
				>
					Sign out
				</button>
			</div>
			<p className="text-2.5 text-muted mt-2.75 mb-0">
				On iPhone: Share → Add to Home Screen. Open the app, sign in,
				then enable notifications.
			</p>
			<p className="text-muted text-sm" role="status">
				{pushNotice}
			</p>
			<p className="text-muted text-sm" role="status">
				{notice}
			</p>
			<h2 className="font-heading text-8 my-7 font-normal">
				Customer requests{" "}
				<span className="text-brand-red">{items.length}</span>
			</h2>
			{!notice && !items.length && (
				<div className="border-line rounded-xl border bg-white p-7 wrap-anywhere">
					Your inbox is ready. New estimate requests will appear here.
				</div>
			)}
			<div className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
				{items.map((item) => (
					<article
						className="border-line rounded-xl border bg-white p-7 wrap-anywhere"
						key={item.id}
					>
						<p className="text-2.5 text-brand-red m-0 font-bold tracking-[0.14em] uppercase">
							{item.service}
						</p>
						<h3 className="font-heading text-7 m-0">{item.name}</h3>
						<p className="text-3 text-muted">
							<time dateTime={item.createdAt}>
								{new Date(item.createdAt).toLocaleString()}
							</time>
						</p>
						<dl className="[&_dd]:m-0">
							<dt className="text-3 text-muted mt-3">Email</dt>
							<dd>
								<a
									className="text-3.25 break-all underline decoration-current underline-offset-4"
									href={`mailto:${item.email}`}
								>
									{item.email}
								</a>
							</dd>
							<dt className="text-3 text-muted mt-3">Phone</dt>
							<dd>{item.phone}</dd>
							<dt className="text-3 text-muted mt-3">
								Town / ZIP
							</dt>
							<dd>{item.town}</dd>
						</dl>
						<p className="text-3.25 leading-[1.7] whitespace-pre-wrap">
							{item.details}
						</p>
						<a
							className={`button ${buttonStyles} ${smallButtonStyles}`}
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
