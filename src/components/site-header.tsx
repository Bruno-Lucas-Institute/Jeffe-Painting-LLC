"use client";

import Link from "next/link";
import { useState } from "react";
import { client } from "@/config/client";

const navigation = [
  { label: "Services", href: "/services" },
  { label: "Our work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          aria-label={`${client.businessName} home`}
          className="wordmark"
          href="/"
          onClick={() => setMenuOpen(false)}
        >
          <span className="wordmark-mark">J</span>
          <span className="wordmark-text">
            <strong>JEFFE</strong>
            <span>PAINTING LLC</span>
          </span>
        </Link>

        <button
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

        <nav
          aria-label="Main navigation"
          className={`site-nav${menuOpen ? " is-open" : ""}`}
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
          <a className="nav-phone" href={client.phoneHref}>
            Call {client.phone}
          </a>
          <Link
            className="button button-small"
            href="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Request an estimate <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
