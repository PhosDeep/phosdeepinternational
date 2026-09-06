"use client";

import CustomCursor from "@/components/CustomCursor";
import HudFrame from "@/components/HudFrame";
import SiteNav from "@/components/SiteNav";
import { useEffect } from "react";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageShell({
  children,
  className = "",
}: PageShellProps) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className={`site inner-site ${className}`} id="main-content">

      {/* =====================================================
          GLOBAL INTERFACE
      ===================================================== */}

      <CustomCursor />

      <HudFrame />

      <SiteNav />


      {/* =====================================================
          PAGE BACKGROUND
      ===================================================== */}

      <div
        className="page-background-grid"
        aria-hidden="true"
      />


      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      {children}

    </main>
  );
}