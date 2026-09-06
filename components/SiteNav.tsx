"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const isTraining = pathname === "/training";
  const isAbout = pathname === "/about";
  const isTechnology =
    pathname === "/technology" ||
    pathname.startsWith("/technology/");
  const isContact = pathname === "/contact";

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".inner-page-nav")) setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [menuOpen]);

  return (
    <nav className={`nav site-nav inner-page-nav ${menuOpen ? "menu-open" : ""}`}>

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* =====================================================
          LOGO
      ===================================================== */}

      <Link
        href="/"
        className="logo"
        data-cursor="link"
        data-cursor-label="HOME"
        data-cursor-color="#38d9ff"
      >
        PHOS<span>DEEP</span>
      </Link>


      {/* =====================================================
          MAIN NAVIGATION

          HOME PAGE:
          TECHNOLOGY / TRAINING / ABOUT

          ALL OTHER PAGES:
          HOME / TRAINING / ABOUT
      ===================================================== */}

      <div className="nav-links" id="site-navigation-menu">

        {isHome ? (
          /* =================================================
             HOME PAGE ONLY
             HOME → TECHNOLOGY
          ================================================= */

          <Link
            href="/technology"
            className={isTechnology ? "active" : ""}
            data-cursor="link"
            data-cursor-label="TECHNOLOGY"
            data-cursor-color="#a83cff"
          >
            TECHNOLOGY
          </Link>
        ) : (
          /* =================================================
             ALL OTHER PAGES
             NORMAL HOME LINK
          ================================================= */

          <Link
            href="/"
            className={isHome ? "active" : ""}
            data-cursor="link"
            data-cursor-label="HOME"
            data-cursor-color="#38d9ff"
          >
            HOME
          </Link>
        )}


        {/* =================================================
           TRAINING
        ================================================= */}

        <Link
          href="/training"
          className={isTraining ? "active" : ""}
          data-cursor="link"
          data-cursor-label="TRAINING"
          data-cursor-color="#557cff"
        >
          TRAINING
        </Link>


        {/* =================================================
           ABOUT
        ================================================= */}

        <Link
          href="/about"
          className={isAbout ? "active" : ""}
          data-cursor="link"
          data-cursor-label="ABOUT"
          data-cursor-color="#2bd9ff"
        >
          ABOUT
        </Link>

      </div>

      <button
        type="button"
        className="nav-menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-navigation-menu"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>


      {/* =====================================================
          CONTACT
      ===================================================== */}

      <Link
        href="/contact"
        className={`nav-contact ${
          isContact ? "active" : ""
        }`}
        data-cursor="link"
        data-cursor-label="CONTACT"
        data-cursor-color="#a83cff"
      >
        CONTACT US
        <span>↗</span>
      </Link>

    </nav>
  );
}