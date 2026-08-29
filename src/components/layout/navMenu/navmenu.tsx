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

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div ref={menuRef} className={styles.menuShell} data-open={isOpen}>
      <nav
        id="site-menu-panel"
        className={styles.dropdown}
        aria-label="Main navigation"
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
