"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./nav.module.scss";
import { useTranslation } from "~/context/LanguageContext";
import LanguageSwitcher from "~/components/ui/LanguageSwitcher/LanguageSwitcher";
import { stripLocaleFromPathname } from "~/lib/locale-path";

export default function NavMenu() {
  const pathname = usePathname();
  const { t, getLocalizedHref } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentBaseRoute = stripLocaleFromPathname(pathname);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/art", label: t("nav.art") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/shop", label: t("nav.shop") },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  // Focus trap inside open navigation menu for keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (e.key !== "Tab" || !menuRef.current) return;

      const focusableEls = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div ref={menuRef} className={styles.menuShell} data-open={isOpen}>
      <nav
        id="site-menu-panel"
        className={styles.dropdown}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? currentBaseRoute === "/"
              : currentBaseRoute.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={getLocalizedHref(item.href)}
              className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <button
        type="button"
        className={styles.menuTrigger}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="site-menu-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.menuLabel}>{t("nav.menu")}</span>
        <span className={styles.menuIcon} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </span>
      </button>

      {/* Language Switcher emerging downwards from menu button */}
      <div className={styles.langDropdown}>
        <LanguageSwitcher inMenu />
      </div>
    </div>
  );
}
