"use client";

import CustomCursor from "@/components/CustomCursor";
import HudFrame from "@/components/HudFrame";
import SiteNav from "@/components/SiteNav";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageShell({
  children,
  className = "",
}: PageShellProps) {
  return (
    <main className={`site inner-site ${className}`}>

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