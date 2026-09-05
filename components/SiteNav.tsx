"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isTraining = pathname === "/training";
  const isAbout = pathname === "/about";
  const isTechnology =
    pathname === "/technology" ||
    pathname.startsWith("/technology/");
  const isContact = pathname === "/contact";

  return (
    <nav className="nav site-nav inner-page-nav">

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

      <div className="nav-links">

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