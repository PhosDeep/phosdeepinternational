"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const isTechnology =
    pathname === "/technology" || pathname.startsWith("/technology/");
  const isTraining = pathname === "/training" || pathname.startsWith("/training/");
  const isAbout = pathname === "/about" || pathname.startsWith("/about/");
  const isContact = pathname === "/contact" || pathname.startsWith("/contact/");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* DESKTOP & TOP HEADER */}
      <header className={`site-header-wrapper ${scrolled ? "is-scrolled" : ""}`}>
        <nav className="site-floating-nav" aria-label="Main Navigation">
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>

          {/* LOGO */}
          <Link
            href="/"
            className="nav-logo-group"
            data-cursor="link"
            data-cursor-label="HOME"
            aria-label="Phosdeep International Home"
          >
            <div className="logo-text">
              <span className="logo-main">
                PHOS<span className="logo-highlight">DEEP</span>
              </span>
              <span className="logo-sub">INTERNATIONAL</span>
            </div>
          </Link>

          {/* CENTER FLOATING CAPSULE MENU (DESKTOP) */}
          <div className="nav-capsule-container">
            <Link
              href="/"
              className={`capsule-link ${isHome ? "active" : ""}`}
              data-cursor="link"
              data-cursor-label="HOME"
            >
              Home
            </Link>

            <Link
              href="/technology"
              className={`capsule-link ${isTechnology ? "active" : ""}`}
              data-cursor="link"
              data-cursor-label="TECH"
            >
              Technology
            </Link>

            <Link
              href="/training"
              className={`capsule-link ${isTraining ? "active" : ""}`}
              data-cursor="link"
              data-cursor-label="TRAINING"
            >
              Training
            </Link>

            <Link
              href="/about"
              className={`capsule-link ${isAbout ? "active" : ""}`}
              data-cursor="link"
              data-cursor-label="ABOUT"
            >
              About
            </Link>
          </div>

          {/* RIGHT CTA BUTTON */}
          <div className="nav-actions">
            <Link
              href="/contact"
              className={`nav-cta-button ${isContact ? "active" : ""}`}
              data-cursor="link"
              data-cursor-label="CONTACT"
            >
              <span>Contact Us</span>
              <span className="cta-arrow-icon" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* MOBILE BOTTOM FLOATING CAPSULE BAR (MATCHES REFERENCE IMAGE) */}
      <nav className="mobile-bottom-capsule-bar" aria-label="Mobile Navigation">
        <Link
          href="/"
          className={`mobile-bottom-item ${isHome ? "active" : ""}`}
          aria-label="Home"
        >
          <svg
            className="mobile-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {isHome && <span className="mobile-item-label">Home</span>}
        </Link>

        <Link
          href="/technology"
          className={`mobile-bottom-item ${isTechnology ? "active" : ""}`}
          aria-label="Technology"
        >
          <svg
            className="mobile-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="15" x2="23" y2="15" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="15" x2="4" y2="15" />
          </svg>
          {isTechnology && <span className="mobile-item-label">Technology</span>}
        </Link>

        <Link
          href="/training"
          className={`mobile-bottom-item ${isTraining ? "active" : ""}`}
          aria-label="Training"
        >
          <svg
            className="mobile-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          {isTraining && <span className="mobile-item-label">Training</span>}
        </Link>

        <Link
          href="/about"
          className={`mobile-bottom-item ${isAbout ? "active" : ""}`}
          aria-label="About"
        >
          <svg
            className="mobile-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          {isAbout && <span className="mobile-item-label">About</span>}
        </Link>

        <Link
          href="/contact"
          className={`mobile-bottom-item ${isContact ? "active" : ""}`}
          aria-label="Contact"
        >
          <svg
            className="mobile-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          {isContact && <span className="mobile-item-label">Contact</span>}
        </Link>
      </nav>
    </>
  );
}

