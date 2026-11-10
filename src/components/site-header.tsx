"use client";

import { ActionIcon } from "@/components/action-icon";
import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { client } from "@/config/client";
import { buttonStyles, smallButtonStyles } from "@/components/button";

const navigation = [
	{ label: "Services", href: "/services" },
	{ label: "Our work", href: "/projects" },
	{ label: "About", href: "/about" },
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
			className={`border-ink/10 bg-background sticky top-0 z-20 border-b transition-[box-shadow,background-color] duration-200 [--header-height:78px]${isScrolled ? "shadow-[0_5px_18px_rgba(36,39,32,0.08)]" : ""}`}
			onKeyDown={(event) => {
				if (event.key === "Escape" && menuOpen) {
					setMenuOpen(false);
					menuButtonRef.current?.focus();
				}
			}}
		>
			<div className="mx-auto flex min-h-[78px] w-[min(calc(100%-48px),1280px)] items-center justify-between max-[760px]:grid max-[760px]:min-h-[78px] max-[760px]:w-[calc(100%-48px)] max-[760px]:grid-cols-[40px_minmax(0,1fr)_40px] max-[760px]:gap-x-4">
				<button
					ref={menuButtonRef}
					aria-controls="primary-navigation"
					aria-expanded={menuOpen}
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					className="max-[760px]:border-line hidden max-[760px]:col-start-1 max-[760px]:row-start-1 max-[760px]:inline-flex max-[760px]:h-10 max-[760px]:w-10 max-[760px]:flex-col max-[760px]:items-center max-[760px]:justify-center max-[760px]:gap-1.25 max-[760px]:rounded-xl max-[760px]:border max-[760px]:bg-transparent"
					onClick={() => setMenuOpen(!menuOpen)}
					type="button"
				>
					<span className={`bg-ink h-px w-4.5 transition-transform${menuOpen ? "translate-y-0.75 rotate-45" : ""}`} />
					<span className={`bg-ink h-px w-4.5 transition-transform${menuOpen ? "-translate-y-0.75 -rotate-45" : ""}`} />
				</button>

				<Link
					aria-label={`${client.businessName} home`}
					className="inline-flex shrink-0 items-center gap-2.75 max-[760px]:col-start-2 max-[760px]:row-start-1 max-[760px]:justify-self-center"
					href="/"
					onClick={() => setMenuOpen(false)}
				>
					<BrandLogo variant="header" />
				</Link>

				<a
					aria-label={`Call ${client.businessName} at ${client.phone}`}
					className="border-line text-brand-red col-start-3 row-start-1 hidden h-10 w-10 items-center justify-center rounded-xl border max-[760px]:inline-flex [&_svg]:h-5 [&_svg]:w-5"
					href={client.phoneHref}
				>
					<ActionIcon name="phone" />
				</a>

				<nav
					aria-label="Main navigation"
					className={`[&>a:not(.button):hover]:text-brand-red max-[760px]:border-line max-[760px]:bg-background max-[760px]:[&>a:not(.button)]:border-line static flex items-center gap-8 text-[15px] max-[1050px]:gap-5 max-[760px]:absolute max-[760px]:top-full max-[760px]:right-0 max-[760px]:left-0 max-[760px]:hidden max-[760px]:max-h-[calc(100dvh-var(--header-height))] max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-0 max-[760px]:overflow-y-auto max-[760px]:overscroll-y-contain max-[760px]:border-y max-[760px]:px-5.75 max-[760px]:pt-5.25 max-[760px]:pb-6.25 [&>a:not(.button)]:transition-colors max-[760px]:[&>a:not(.button)]:border-b max-[760px]:[&>a:not(.button)]:py-3.25${menuOpen ? "max-[760px]:flex" : ""}`}
					id="primary-navigation"
				>
					{navigation.map((item) => (
						<Link href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
							{item.label}
						</Link>
					))}
					<div className="flex items-center gap-[18px] max-[760px]:mt-3.75 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-3.75 [&>.button]:min-h-12 [&>.button]:px-6 [&>.button]:text-[15px]">
						<a
							className="text-muted inline-flex items-center gap-1.75 whitespace-nowrap max-[760px]:py-3.25"
							href={client.phoneHref}
						>
							<ActionIcon name="phone" /> Call {client.phone}
						</a>
						<Link className={`button ${buttonStyles} ${smallButtonStyles}`} href="/contact" onClick={() => setMenuOpen(false)}>
							Request an estimate <ActionIcon name="estimate" />
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}
