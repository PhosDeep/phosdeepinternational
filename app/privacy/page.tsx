import Link from "next/link";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Privacy Policy | Phosdeep International",
  description: "How Phosdeep International handles information submitted through this website.",
};

export default function PrivacyPage() {
  return (
    <main className="site inner-site legal-page" id="main-content">
      <SiteNav />
      <article className="legal-content">
        <span className="eyebrow">PHOSDEEP / PRIVACY</span>
        <h1>PRIVACY<br /><span>POLICY.</span></h1>
        <p className="legal-updated">Last updated: September 6, 2026</p>
        <h2>Information we receive</h2>
        <p>When you contact Phosdeep International, we receive the information you choose to provide, such as your name, email address, organization, phone number, enquiry details and message.</p>
        <h2>How we use it</h2>
        <p>We use submitted information to respond to enquiries, understand project or training requirements, and provide relevant follow-up. We do not sell personal information.</p>
        <h2>Storage and retention</h2>
        <p>Contact submissions are stored with our service providers for as long as reasonably necessary to handle the enquiry and maintain business records. Access is limited to people who need it for these purposes.</p>
        <h2>Your choices</h2>
        <p>You can ask us to correct or delete information you have submitted by emailing phosdeepinternational@gmail.com.</p>
        <h2>Contact</h2>
        <p>Questions about this policy can be sent to <a href="mailto:phosdeepinternational@gmail.com">phosdeepinternational@gmail.com</a>.</p>
      </article>
    </main>
  );
}
