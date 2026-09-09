import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSubscribed(true);
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-newsletter">
        <div
          className="site-footer-newsletter-mark"
          aria-hidden="true"
          onPointerMove={(event) => {
            const mark = event.currentTarget;
            const bounds = mark.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
            const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -18;
            mark.style.setProperty("--signal-x", `${x}deg`);
            mark.style.setProperty("--signal-y", `${y}deg`);
          }}
          onPointerLeave={(event) => {
            event.currentTarget.style.setProperty("--signal-x", "0deg");
            event.currentTarget.style.setProperty("--signal-y", "0deg");
          }}
        >
          <span />
          <span />
          <span />
        </div>
        <div className="site-footer-newsletter-copy">
          <span>PHOSDEEP / SIGNAL</span>
          <h2>Stay close to what&apos;s next.</h2>
          <p>Occasional notes on technology, training and the systems shaping tomorrow.</p>
        </div>
        <form className={`site-footer-subscribe ${subscribed ? "is-subscribed" : ""}`} onSubmit={handleSubscribe}>
          {subscribed ? (
            <p role="status">Signal received. Welcome aboard.</p>
          ) : (
            <>
              <input type="email" placeholder="Enter your email" aria-label="Email address" required />
              <button type="submit">Subscribe <span>↗</span></button>
            </>
          )}
        </form>
      </div>

      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link href="/" className="logo">
            PHOS<span>DEEP</span>
          </Link>
          <p>Technology without limits.</p>
        </div>

        <div className="site-footer-group">
          <span>EXPLORE</span>
          <Link href="/technology"><span>Technology</span><b>↗</b></Link>
          <Link href="/training"><span>Training</span><b>↗</b></Link>
          <Link href="/about"><span>About</span><b>↗</b></Link>
        </div>

        <div className="site-footer-group">
          <span>CONTACT</span>
          <a href="mailto:phosdeepinternational@gmail.com">Email us</a>
          <a href="tel:+917289900349">+91 72899 00349</a>
          <span>DELHI · INDIA</span>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© 2026 PHOSDEEP INTERNATIONAL</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <span>INDIA → WORLD</span>
        </div>
      </div>
    </footer>
  );
}
