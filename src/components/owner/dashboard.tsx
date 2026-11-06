"use client";
import { useEffect, useState, useCallback } from "react";
import {
	Inbox,
	Bell,
	Check,
	LogOut,
	RefreshCw,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";
import { client, ownerCopy as t } from "@/config/client";
import type { Inquiry } from "@/lib/owner/store";
import { PushControls } from "./push-controls";
type Snapshot = {
	items: Inquiry[];
	total: number;
	unread: number;
	pendingNotifications: number;
};
export function Dashboard({
	initial,
	username,
}: {
	initial: Snapshot;
	username: string;
}) {
	const [data, setData] = useState(initial);
	const [page, setPage] = useState(0);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [updated, setUpdated] = useState("");
	const refresh = useCallback(async (current = 0) => {
		try {
			const response = await fetch(
				`/api/owner/inquiries?page=${current}`,
				{ cache: "no-store" },
			);
			if (response.status === 401) {
				setData({
					items: [],
					total: 0,
					unread: 0,
					pendingNotifications: 0,
				});
				window.location.replace("/login");
				return;
			}
			if (!response.ok) throw new Error();
			setData(await response.json());
			setError("");
			setUpdated(
				new Intl.DateTimeFormat(client.owner.locale, {
					timeStyle: "short",
					timeZone: client.owner.timezone,
				}).format(new Date()),
			);
		} catch {
			setError(t.refreshError);
		}
	}, []);
	useEffect(() => {
		const timer = setInterval(() => {
			if (document.visibilityState === "visible") void refresh(page);
		}, 30000);
		const focus = () => {
			if (document.visibilityState === "visible") void refresh(page);
		};
		const restored = (event: PageTransitionEvent) => {
			if (event.persisted) void refresh(page);
		};
		document.addEventListener("visibilitychange", focus);
		window.addEventListener("pageshow", restored);
		return () => {
			clearInterval(timer);
			document.removeEventListener("visibilitychange", focus);
			window.removeEventListener("pageshow", restored);
		};
	}, [page, refresh]);
	async function read(id: string) {
		setBusy(true);
		try {
			const response = await fetch("/api/owner/inquiries", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (response.status === 401) {
				window.location.replace("/login");
				return;
			}
			if (!response.ok) throw new Error();
			await refresh(page);
		} catch {
			setError(t.readError);
		} finally {
			setBusy(false);
		}
	}
	async function logout() {
		setBusy(true);
		try {
			const registration =
				"serviceWorker" in navigator
					? await navigator.serviceWorker.getRegistration("/")
					: undefined;
			const sub = await registration?.pushManager.getSubscription();
			const response = await fetch("/api/owner/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ endpoint: sub?.endpoint }),
			});
			if (!response.ok) throw new Error();
			await sub?.unsubscribe();
			(await registration?.getNotifications())?.forEach((n) => n.close());
			setData({
				items: [],
				total: 0,
				unread: 0,
				pendingNotifications: 0,
			});
			window.location.replace("/login");
		} catch {
			setError(t.logoutError);
			setBusy(false);
		}
	}
	async function changePage(value: number) {
		setPage(value);
		setBusy(true);
		await refresh(value);
		setBusy(false);
	}
	return (
		<section
			className="container owner-dashboard"
			lang={client.owner.locale}
		>
			<div className="owner-dashboard-heading">
				<div>
					<p className="eyebrow">
						{t.privateArea} · {client.businessName}
					</p>
					<h1>
						{t.greeting} <em>{username}.</em>
					</h1>
					<p>{t.inboxSubtitle}</p>
				</div>
				<button
					type="button"
					className="button secondary"
					onClick={logout}
					disabled={busy}
				>
					<LogOut size={17} />
					{t.signOut}
				</button>
			</div>
			<div className="owner-stats">
				{[
					[Inbox, data.total, t.received],
					[Bell, data.unread, t.unread],
					[Check, data.total - data.unread, t.read],
				].map(([Icon, count, label]) => {
					const I = Icon as typeof Inbox;
					return (
						<article key={String(label)}>
							<I size={22} />
							<div>
								<strong>{String(count)}</strong>
								<span>{String(label)}</span>
							</div>
						</article>
					);
				})}
			</div>
			{client.features.push && <PushControls />}
			<section className="owner-inbox" aria-labelledby="inbox-title">
				<div className="owner-inbox-heading">
					<div>
						<p className="eyebrow">{t.inboxEyebrow}</p>
						<h2 id="inbox-title">{t.inboxTitle}</h2>
						<p>
							{t.autoRefresh} {updated}
						</p>
					</div>
					<button
						type="button"
						className="button secondary"
						onClick={() => changePage(page)}
						disabled={busy}
					>
						<RefreshCw size={16} className={busy ? "spin" : ""} />
						{t.refresh}
					</button>
				</div>
				<p role="status" className="field-error">
					{error}
				</p>
				{data.pendingNotifications > 0 && (
					<p className="owner-warning">
						{data.pendingNotifications} · {t.pending}
					</p>
				)}
				{!data.items.length ? (
					<div className="owner-empty">
						<Inbox size={36} />
						<h3>{t.emptyTitle}</h3>
						<p>{t.emptyDescription}</p>
					</div>
				) : (
					<div className="inquiry-list">
						{data.items.map((item) => (
							<article
								key={item.id}
								className={`inquiry-card ${item.read ? "" : "unread"}`}
							>
								<header>
									<div>
										<span
											className={`owner-pill ${item.read ? "" : "active"}`}
										>
											{item.read
												? t.readLabel
												: t.newRequest}
										</span>
										<h3>{item.name}</h3>
										<p>
											{item.serviceLabel ||
												client.services.find(
													(service) =>
														service.id ===
															item.service ||
														service.title ===
															item.service,
												)?.title ||
												item.service}
										</p>
									</div>
									<time dateTime={item.createdAt}>
										{new Intl.DateTimeFormat(
											client.owner.locale,
											{
												dateStyle: "medium",
												timeStyle: "short",
												timeZone: client.owner.timezone,
											},
										).format(new Date(item.createdAt))}
										<small>{client.owner.timezone}</small>
									</time>
								</header>
								<div className="inquiry-contact">
									{item.email && (
										<a href={`mailto:${item.email}`}>
											<Mail size={16} />
											{item.email}
										</a>
									)}
									{item.phone && (
										<a
											href={`tel:${item.phone.replace(/[^+\d]/g, "")}`}
										>
											<Phone size={16} />
											{item.phone}
										</a>
									)}
									{item.location && (
										<span>
											<MapPin size={16} />
											{item.location}
										</span>
									)}
								</div>
								{item.message && (
									<p className="inquiry-message">
										{item.message}
									</p>
								)}
								{Object.entries(item.fields || {})
									.filter(([, value]) => value)
									.map(([id, value]) => (
										<p key={id}>
											<strong>
												{client.form.fields.find(
													(field) => field.id === id,
												)?.label || id}
												:{" "}
											</strong>
											{value}
										</p>
									))}
								{item.timeline && <p>{item.timeline}</p>}
								{item.budget && (
									<p>
										{t.budget}: {item.budget}
									</p>
								)}
								<div className="inquiry-bottom">
									<small>
										{t.requestId} {item.id.slice(0, 8)}
									</small>
									{!item.read && (
										<button
											type="button"
											className="owner-text-button"
											onClick={() => read(item.id)}
											disabled={busy}
										>
											<Check size={16} />
											{t.markRead}
										</button>
									)}
								</div>
							</article>
						))}
					</div>
				)}
				<div className="owner-pagination">
					<button
						type="button"
						className="button secondary"
						disabled={busy || page === 0}
						onClick={() => changePage(page - 1)}
					>
						{t.previous}
					</button>
					<span>
						{t.page} {page + 1} /{" "}
						{Math.max(1, Math.ceil(data.total / 25))}
					</span>
					<button
						type="button"
						className="button secondary"
						disabled={busy || (page + 1) * 25 >= data.total}
						onClick={() => changePage(page + 1)}
					>
						{t.next}
					</button>
				</div>
			</section>
		</section>
	);
}
