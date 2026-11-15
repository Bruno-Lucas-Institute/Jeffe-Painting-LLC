"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
	Bell,
	Inbox,
	RefreshCw,
	LogOut,
	Check,
	Mail,
	Phone,
	MapPin,
	CalendarClock,
	ArrowLeft,
	ArrowRight,
} from "lucide-react";
import type { Inquiry } from "@/lib/owner/store";
import { site } from "@/config/owner";
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
	const [lastUpdated, setLastUpdated] = useState("");
	const refresh = useCallback(async (currentPage = 0) => {
		try {
			const response = await fetch(
				`/api/owner/inquiries?page=${currentPage}`,
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
			const result = await response.json();
			setData(result);
			setError("");
			setLastUpdated(
				new Date().toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			);
		} catch {
			setError(
				"Unable to refresh. The requests below are from the last update.",
			);
		}
	}, []);
	useEffect(() => {
		const timer = setInterval(() => {
			if (document.visibilityState === "visible") void refresh(page);
		}, 30000);
		const focus = () => {
			if (document.visibilityState === "visible") void refresh(page);
		};
		document.addEventListener("visibilitychange", focus);
		const restored = (event: PageTransitionEvent) => {
			if (event.persisted) void refresh(page);
		};
		window.addEventListener("pageshow", restored);
		return () => {
			clearInterval(timer);
			document.removeEventListener("visibilitychange", focus);
			window.removeEventListener("pageshow", restored);
		};
	}, [page, refresh]);
	async function update() {
		setBusy(true);
		await refresh(page);
		setBusy(false);
	}
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
			setError("Unable to mark this request as read.");
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
			setError("Unable to sign out. Please try again.");
			setBusy(false);
		}
	}
	async function changePage(next: number) {
		setPage(next);
		setBusy(true);
		await refresh(next);
		setBusy(false);
	}
	return (
		<section className="container owner-dashboard" lang="en-US">
			<div className="owner-dashboard-heading">
				<div>
					<p className="eyebrow">Private area · {site.name}</p>
					<h1>
						Hello, <em>{username}.</em>
					</h1>
					<p>All your requests in one place.</p>
				</div>
				<button
					type="button"
					onClick={logout}
					className="button secondary"
					disabled={busy}
				>
					<LogOut size={17} />
					Sign out on this device
				</button>
			</div>
			<nav className="owner-action-row" aria-label="Owner dashboard">
				<Link className="button" href="/owner/settings">
					Website settings
				</Link>
			</nav>
			<div className="owner-stats">
				<article>
					<Inbox size={22} />
					<div>
						<strong>{data.total}</strong>
						<span>Requests received</span>
					</div>
				</article>
				<article>
					<Bell size={22} />
					<div>
						<strong>{data.unread}</strong>
						<span>Unread</span>
					</div>
				</article>
				<article>
					<Check size={22} />
					<div>
						<strong>{data.total - data.unread}</strong>
						<span>Read</span>
					</div>
				</article>
			</div>
			<PushControls />
			<section className="owner-inbox" aria-labelledby="inbox-title">
				<div className="owner-inbox-heading">
					<div>
						<p className="eyebrow">Inbox</p>
						<h2 id="inbox-title">Customer requests</h2>
						<p>
							Refreshes automatically every 30 seconds.
							{lastUpdated
								? ` Last updated: ${lastUpdated}.`
								: ""}
						</p>
					</div>
					<button
						className="button secondary"
						type="button"
						onClick={update}
						disabled={busy}
					>
						<RefreshCw size={16} className={busy ? "spin" : ""} />
						Refresh
					</button>
				</div>
				<p role="status" className="field-error">
					{error}
				</p>
				{data.pendingNotifications > 0 && (
					<p className="owner-warning">
						{data.pendingNotifications} notification(s) pending
						delivery. Your requests are already saved and available
						below.
					</p>
				)}
				{data.items.length === 0 ? (
					<div className="owner-empty">
						<Inbox size={36} />
						<h3>
							{data.total
								? "No requests on this page."
								: "Ready for your first request."}
						</h3>
						<p>
							When someone submits the form, their details will
							appear here. Customers do not need an account.
						</p>
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
											{item.read ? "Read" : "New request"}
										</span>
										<h3>{item.name}</h3>
										<p>
											{site.services.find(
												(s) => s.slug === item.service,
											)?.title || item.service}
										</p>
									</div>
									<time dateTime={item.createdAt}>
										{new Intl.DateTimeFormat("en-US", {
											dateStyle: "medium",
											timeStyle: "short",
											timeZone: "America/New_York",
										}).format(new Date(item.createdAt))}
										<small>New York time</small>
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
									{item.timeline && (
										<span>
											<CalendarClock size={16} />
											{item.timeline}
										</span>
									)}
								</div>
								<p className="inquiry-message">
									{item.message}
								</p>
								{item.budget && (
									<p>Provided budget: {item.budget}</p>
								)}
								<div className="inquiry-bottom">
									<small>Request {item.id.slice(0, 8)}</small>
									{!item.read && (
										<button
											type="button"
											className="owner-text-button"
											onClick={() => read(item.id)}
											disabled={busy}
										>
											<Check size={16} />
											Mark as read
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
						onClick={() => changePage(page - 1)}
						disabled={busy || page === 0}
					>
						<ArrowLeft size={16} />
						Previous
					</button>
					<span>
						Page {page + 1} of{" "}
						{Math.max(1, Math.ceil(data.total / 25))}
					</span>
					<button
						type="button"
						className="button secondary"
						onClick={() => changePage(page + 1)}
						disabled={busy || (page + 1) * 25 >= data.total}
					>
						Next
						<ArrowRight size={16} />
					</button>
				</div>
			</section>
		</section>
	);
}
