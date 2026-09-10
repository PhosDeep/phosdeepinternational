"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import DeferredScene from "@/components/DeferredScene";
import SiteFooter from "@/components/SiteFooter";

import CustomCursor from "@/components/CustomCursor";
import HudFrame from "@/components/HudFrame";
import SiteNav from "@/components/SiteNav";

const enquiryTypes = [
  "Technology / Consulting",
  "Corporate Training",
  "University / Academic Program",
  "Research Collaboration",
  "Internship / Career",
  "Other",
];

const technologies = [
  "Cybersecurity",
  "Artificial Intelligence",
  "Generative AI",
  "Quantum Computing",
  "Blockchain",
  "Cloud Computing",
  "Data Science",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    enquiryType: "",
    technology: "",
    message: "",
    website: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");

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

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Something went wrong. Please try again."
        );
      }

      setStatus("success");

      setForm({
        name: "",
        email: "",
        phone: "",
        organization: "",
        designation: "",
        enquiryType: "",
        technology: "",
        message: "",
        website: "",
      });
    } catch (error) {
      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main className="site contact-page" id="main-content">

      {/* =====================================================
          3D BACKGROUND
      ===================================================== */}

      <div
        className="scene-fixed"
        aria-hidden="true"
      >
        <DeferredScene />
      </div>

      <CustomCursor />

      <HudFrame />


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <SiteNav />


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="contact-hero" data-reveal>

        <div className="contact-hero-meta">

          <span>
            PHOSDEEP / CONTACT
          </span>

          <span>
            INDIA → WORLD
          </span>

        </div>

        <div className="contact-hero-content">

          <div className="eyebrow">

            <span className="status-dot" />

            DIRECT ACCESS

          </div>

          <h1>
            GET IN
            <br />
            <span>TOUCH.</span>
          </h1>

          <p>
            Have a technology challenge, training
            requirement, research idea or project worth
            exploring? Tell us what you&apos;re working on.
          </p>

        </div>

        <div className="contact-hero-visual" aria-hidden="true">
          <div className="contact-hero-orbit contact-hero-orbit-one" />
          <div className="contact-hero-orbit contact-hero-orbit-two" />
          <div className="contact-hero-core">
            <span>PHOSDEEP</span>
            <strong>01</strong>
            <small>OPEN CHANNEL</small>
          </div>
          <div className="contact-hero-signal">INDIA <b>→</b> WORLD</div>
        </div>

        <div className="contact-hero-number">

          <strong>
            01
          </strong>

          <span>
            CONTACT
          </span>

        </div>

      </section>


      {/* =====================================================
          CONTACT FORM
      ===================================================== */}

      <section className="contact-form-section" data-reveal>

        <div className="contact-form-intro">

          <span className="contact-section-number">
            01 / IDENTIFY YOURSELF
          </span>

          <h2>
            SEND US
            <br />
            <span>YOUR INQUIRY.</span>
          </h2>

          <p>
            Have a technology challenge, training requirement,
            research idea or project worth exploring? Tell us
            what you&apos;re working on.
          </p>

        </div>


        {/* =================================================
            SUCCESS STATE
        ================================================= */}

        {status === "success" ? (

          <div className="contact-success" role="status" aria-live="polite">

            <div className="contact-success-symbol">
              ✓
            </div>

            <span>
              TRANSMISSION RECEIVED
            </span>

            <h2>
              WE&apos;VE GOT
              <br />
              <span>YOUR MESSAGE.</span>
            </h2>

            <p>
              Thank you for reaching out to Phosdeep
              International. Our team will review your
              enquiry and get back to you.
            </p>

            <button
              type="button"
              className="contact-reset"
              onClick={() => setStatus("idle")}
            >
              SEND ANOTHER MESSAGE
              <span>↗</span>
            </button>

          </div>

        ) : (

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <label className="form-trap" aria-hidden="true">
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => updateField("website", event.target.value)}
              />
            </label>

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className="form-section">

              <div className="form-section-label">

                <span>
                  01
                </span>

                PERSONAL INFORMATION

              </div>

              <div className="form-grid">

                <label className="form-field">

                  <span>
                    FULL NAME <b>*</b>
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value
                      )
                    }
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                  />

                </label>


                <label className="form-field">

                  <span>
                    WORK EMAIL <b>*</b>
                  </span>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    autoComplete="email"
                    placeholder="you@company.com"
                    required
                  />

                </label>


                <label className="form-field">

                  <span>
                    PHONE NUMBER
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    autoComplete="tel"
                    placeholder="+91"
                  />

                </label>


                <label className="form-field">

                  <span>
                    ORGANIZATION
                  </span>

                  <input
                    type="text"
                    name="organization"
                    value={form.organization}
                    onChange={(event) =>
                      updateField(
                        "organization",
                        event.target.value
                      )
                    }
                    autoComplete="organization"
                    placeholder="Company / Institution"
                  />

                </label>


                <label className="form-field form-field-full">

                  <span>
                    DESIGNATION
                  </span>

                  <input
                    type="text"
                    name="designation"
                    value={form.designation}
                    onChange={(event) =>
                      updateField(
                        "designation",
                        event.target.value
                      )
                    }
                    autoComplete="organization-title"
                    placeholder="Your role"
                  />

                </label>

              </div>

            </div>


            {/* =================================================
                ENQUIRY TYPE
            ================================================= */}

            <div className="form-section">



            </div>


            {/* =================================================
                TECHNOLOGY
            ================================================= */}




            {/* =================================================
                MESSAGE
            ================================================= */}



            {/* =================================================
                ERROR
            ================================================= */}

            {status === "error" && (

              <div className="contact-error" role="alert" aria-live="assertive">
                {errorMessage}
              </div>

            )}


            {/* =================================================
                SUBMIT
            ================================================= */}

            <div className="form-submit">

              <p>
                By submitting this form, you agree
                that Phosdeep International may use
                the information provided to contact
                you regarding your enquiry. See our{" "}
                <Link href="/privacy">privacy policy</Link>.
              </p>

              <button
                type="submit"
                className="contact-submit"
                disabled={
                  status === "submitting"
                }
                data-cursor="magnetic"
                data-cursor-label="SEND"
                data-cursor-color="#a83cff"
              >

                {status === "submitting"
                  ? "TRANSMITTING..."
                  : "SEND ENQUIRY"}

                <span>
                  ↗
                </span>

              </button>

            </div>

          </form>

        )}

      </section>


      {/* =====================================================
          DIRECT CONTACT
      ===================================================== */}

      <section className="direct-contact" data-reveal>

        <div
          className="direct-contact-grid"
          aria-hidden="true"
        />

        <div className="direct-contact-content">

          <span>
            DIRECT CONTACT
          </span>


          {/* EMAIL */}

          <a
            href="mailto:phosdeepinternational@gmail.com"
            className="direct-email"
            data-cursor="link"
            data-cursor-label="EMAIL"
            data-cursor-color="#2bd9ff"
          >
            phosdeepinternational@gmail.com
          </a>


          {/* PHONE */}

          <a
            href="tel:+917289900349"
            className="direct-phone"
            data-cursor="link"
            data-cursor-label="CALL"
            data-cursor-color="#37e69c"
          >
            +91 72899 00349
          </a>


          {/* COMPANY INFORMATION */}

          <p>
            PHOSDEEP INTERNATIONAL
            <br />
            DELHI · INDIA
            <br />
            INDIA → WORLD
          </p>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <SiteFooter />

    </main>
  );
}