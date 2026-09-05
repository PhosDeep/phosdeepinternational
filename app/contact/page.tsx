"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import CustomCursor from "@/components/CustomCursor";
import HudFrame from "@/components/HudFrame";
import SiteNav from "@/components/SiteNav";

const PhosdeepScene = dynamic(
  () => import("@/components/PhosdeepScene"),
  {
    ssr: false,
  }
);

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
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");

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
    <main className="site contact-page">

      {/* =====================================================
          3D BACKGROUND
      ===================================================== */}

      <div
        className="scene-fixed"
        aria-hidden="true"
      >
        <PhosdeepScene />
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

      <section className="contact-hero">

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

            START A CONVERSATION

          </div>

          <h1>
            LET&apos;S
            <br />
            <span>BUILD.</span>
          </h1>

          <p>
            Have a technology challenge, training
            requirement, research idea or project worth
            exploring? Tell us what you&apos;re working on.
          </p>

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

      <section className="contact-form-section">

        <div className="contact-form-intro">

          <span className="contact-section-number">
            01 / IDENTIFY YOURSELF
          </span>

          <h2>
            TELL US
            <br />
            <span>ABOUT YOU.</span>
          </h2>

          <p>
            A few details will help us understand who
            we&apos;re speaking with and how we can help.
          </p>

        </div>


        {/* =================================================
            SUCCESS STATE
        ================================================= */}

        {status === "success" ? (

          <div className="contact-success">

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
                    placeholder="Your role"
                  />

                </label>

              </div>

            </div>


            {/* =================================================
                ENQUIRY TYPE
            ================================================= */}

            <div className="form-section">

              <div className="form-section-label">

                <span>
                  02
                </span>

                WHAT ARE YOU LOOKING FOR?

              </div>

              <div className="selection-grid">

                {enquiryTypes.map((type) => (

                  <button
                    type="button"
                    key={type}
                    className={`selection-card ${
                      form.enquiryType === type
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      updateField(
                        "enquiryType",
                        type
                      )
                    }
                  >

                    <span>
                      {form.enquiryType === type
                        ? "●"
                        : "○"}
                    </span>

                    {type}

                  </button>

                ))}

              </div>

            </div>


            {/* =================================================
                TECHNOLOGY
            ================================================= */}

            <div className="form-section">

              <div className="form-section-label">

                <span>
                  03
                </span>

                TECHNOLOGY AREA

              </div>

              <div className="technology-selection">

                {technologies.map(
                  (technology) => (

                    <button
                      type="button"
                      key={technology}
                      className={
                        form.technology === technology
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        updateField(
                          "technology",
                          technology
                        )
                      }
                    >

                      {technology}

                      <span>
                        ↗
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>


            {/* =================================================
                MESSAGE
            ================================================= */}

            <div className="form-section">

              <div className="form-section-label">

                <span>
                  04
                </span>

                TELL US MORE

              </div>

              <label className="message-field">

                <textarea
                  name="message"
                  value={form.message}
                  onChange={(event) =>
                    updateField(
                      "message",
                      event.target.value
                    )
                  }
                  placeholder="Tell us about your requirement, challenge, project or idea..."
                  required
                  rows={7}
                />

              </label>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {status === "error" && (

              <div className="contact-error">
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
                you regarding your enquiry.
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

      <section className="direct-contact">

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


          {/* SOCIAL LINKS */}

          <div className="direct-socials">

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              data-cursor-label="LINKEDIN"
              data-cursor-color="#557cff"
            >
              LINKEDIN
              <span>
                ↗
              </span>
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              data-cursor-label="INSTAGRAM"
              data-cursor-color="#a83cff"
            >
              INSTAGRAM
              <span>
                ↗
              </span>
            </a>

          </div>


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

      <footer>

        <Link
          href="/"
          className="logo"
        >
          PHOS<span>DEEP</span>
        </Link>

        <div>
          © 2026 PHOSDEEP INTERNATIONAL
        </div>

        <div>
          DELHI · INDIA
        </div>

      </footer>

    </main>
  );
}