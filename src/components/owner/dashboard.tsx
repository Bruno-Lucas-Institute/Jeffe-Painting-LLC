"use client";
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
				new Date().toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			);
		} catch {
			setError(
				"Não foi possível atualizar. Os pedidos abaixo são da última consulta.",
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
			setError("Não foi possível marcar este pedido como lido.");
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
			setError("Não foi possível sair. Tente novamente.");
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
		<section className="container owner-dashboard" lang="pt-BR">
			<div className="owner-dashboard-heading">
				<div>
					<p className="eyebrow">Área privada · {site.name}</p>
					<h1>
						Olá, <em>{username}.</em>
					</h1>
					<p>Todos os pedidos, em um só lugar.</p>
				</div>
				<button
					type="button"
					onClick={logout}
					className="button secondary"
					disabled={busy}
				>
					<LogOut size={17} />
					Sair deste aparelho
				</button>
			</div>
			<div className="owner-stats">
				<article>
					<Inbox size={22} />
					<div>
						<strong>{data.total}</strong>
						<span>Pedidos recebidos</span>
					</div>
				</article>
				<article>
					<Bell size={22} />
					<div>
						<strong>{data.unread}</strong>
						<span>Ainda não lidos</span>
					</div>
				</article>
				<article>
					<Check size={22} />
					<div>
						<strong>{data.total - data.unread}</strong>
						<span>Já consultados</span>
					</div>
				</article>
			</div>
			<PushControls />
			<section className="owner-inbox" aria-labelledby="inbox-title">
				<div className="owner-inbox-heading">
					<div>
						<p className="eyebrow">Caixa de entrada</p>
						<h2 id="inbox-title">Pedidos dos clientes</h2>
						<p>
							Atualização automática a cada 30 segundos.
							{lastUpdated
								? ` Última consulta: ${lastUpdated}.`
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
						Atualizar
					</button>
				</div>
				<p role="status" className="field-error">
					{error}
				</p>
				{data.pendingNotifications > 0 && (
					<p className="owner-warning">
						{data.pendingNotifications} aviso(s) aguardando envio.
						Os pedidos já estão salvos e podem ser consultados
						abaixo.
					</p>
				)}
				{data.items.length === 0 ? (
					<div className="owner-empty">
						<Inbox size={36} />
						<h3>
							{data.total
								? "Não há pedidos nesta página."
								: "Tudo pronto para o primeiro pedido."}
						</h3>
						<p>
							Quando alguém enviar o formulário, os detalhes
							aparecerão aqui. O cliente não precisa criar uma
							conta.
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
											{item.read ? "Lido" : "Novo pedido"}
										</span>
										<h3>{item.name}</h3>
										<p>
											{site.services.find(
												(s) => s.slug === item.service,
											)?.title || item.service}
										</p>
									</div>
									<time dateTime={item.createdAt}>
										{new Intl.DateTimeFormat("pt-BR", {
											dateStyle: "medium",
											timeStyle: "short",
											timeZone: "America/New_York",
										}).format(new Date(item.createdAt))}
										<small>Horário de Nova York</small>
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
									<p>Orçamento informado: {item.budget}</p>
								)}
								<div className="inquiry-bottom">
									<small>Pedido {item.id.slice(0, 8)}</small>
									{!item.read && (
										<button
											type="button"
											className="owner-text-button"
											onClick={() => read(item.id)}
											disabled={busy}
										>
											<Check size={16} />
											Marcar como lido
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
						Anterior
					</button>
					<span>
						Página {page + 1} de{" "}
						{Math.max(1, Math.ceil(data.total / 25))}
					</span>
					<button
						type="button"
						className="button secondary"
						onClick={() => changePage(page + 1)}
						disabled={busy || (page + 1) * 25 >= data.total}
					>
						Próxima
						<ArrowRight size={16} />
					</button>
				</div>
			</section>
		</section>
	);
}
