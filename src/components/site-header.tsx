"use client";

import { ActionIcon } from "@/components/action-icon";
import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { client } from "@/config/client";

import "./site-header.css";

const navigation = [
	{ label: "Services", href: "/services" },
	{ label: "Our work", href: "/projects" },
	{ label: "About", href: "/about" },
	{ label: "Contact", href: "/contact" },
	{ label: "Team login", href: "/login" },
];

export function SiteHeader() {
	const [menuOpen, setMenuOpen] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const updateHeader = () => {
			setIsScrolled(window.scrollY > 24);
		};

		updateHeader();
		window.addEventListener("scroll", updateHeader, { passive: true });

		return () => window.removeEventListener("scroll", updateHeader);
	}, []);

	return (
		<header
			className={`site-header sticky top-0 z-20 bg-background${isScrolled ? " is-compact" : ""}`}
			onKeyDown={(event) => {
				if (event.key === "Escape" && menuOpen) {
					setMenuOpen(false);
					menuButtonRef.current?.focus();
				}
			}}
		>
			<div className="site-header-inner flex items-center justify-between">
				<button
					ref={menuButtonRef}
					aria-controls="primary-navigation"
					aria-expanded={menuOpen}
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					className={`menu-toggle${menuOpen ? " is-open" : ""}`}
					onClick={() => setMenuOpen(!menuOpen)}
					type="button"
				>
					<span />
					<span />
				</button>

				<Link
					aria-label={`${client.businessName} home`}
					className="wordmark"
					href="/"
					onClick={() => setMenuOpen(false)}
				>
					<BrandLogo />
				</Link>

				<a
					aria-label={`Call ${client.businessName} at ${client.phone}`}
					className="mobile-header-call"
					href={client.phoneHref}
				>
					<ActionIcon name="phone" />
				</a>

				<nav
					aria-label="Main navigation"
					className={`site-nav flex items-center text-[13px]${menuOpen ? " is-open" : ""}`}
					id="primary-navigation"
				>
					{navigation.map((item) => (
						<Link
							href={item.href}
							key={item.href}
							onClick={() => setMenuOpen(false)}
						>
							{item.label}
						</Link>
					))}
					<a
						className="nav-phone inline-flex items-center gap-[7px]"
						href={client.phoneHref}
					>
						<ActionIcon name="phone" /> Call {client.phone}
					</a>
					<Link
						className="button button-small"
						href="/contact"
						onClick={() => setMenuOpen(false)}
					>
						Request an estimate <ActionIcon name="estimate" />
					</Link>
				</nav>
			</div>
		</header>
	);
}
