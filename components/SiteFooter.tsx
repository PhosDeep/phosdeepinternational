import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <Link href="/" className="logo">
          PHOS<span>DEEP</span>
        </Link>
        <p>Technology without limits.</p>
      </div>

      <div className="site-footer-group">
        <span>EXPLORE</span>
        <Link href="/technology">Technology</Link>
        <Link href="/training">Training</Link>
        <Link href="/about">About</Link>
      </div>

      <div className="site-footer-group">
        <span>CONTACT</span>
        <a href="mailto:phosdeepinternational@gmail.com">Email us</a>
        <a href="tel:+917289900349">+91 72899 00349</a>
        <span>DELHI · INDIA</span>
      </div>

      <div className="site-footer-meta">
        <span>© 2026</span>
        <span>PHOSDEEP INTERNATIONAL</span>
      </div>
    </footer>
  );
}
