"use client";

import Link from "next/link";
import { useState } from "react";
import { RegisterCard } from "./RegisterCard";

const links = [
  { href: "#home", label: "Home" },
  { href: "#accommodation", label: "Accommodation" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/home#home" className="brand">
          Mama Akingbade
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="#register" className="nav-cta">
            Register stay
          </a>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className={`burger ${open ? "open" : ""}`} aria-hidden />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu ${open ? "open" : ""}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mobile-form-panel">
          <RegisterCard compact />
        </div>
      </div>
    </header>
  );
}
