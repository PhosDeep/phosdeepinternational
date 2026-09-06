"use client";

import { useEffect } from "react";
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


/* =========================================================
   TRAINING PROGRAMS
========================================================= */

const programs = [
  {
    number: "01",
    title: "AI & MACHINE LEARNING",
    subtitle: "INTELLIGENCE",
    description:
      "Practical training in artificial intelligence, machine learning, deep learning and modern AI systems.",
    topics:
      "PYTHON · MACHINE LEARNING · DEEP LEARNING · AI SYSTEMS",
    color: "#a83cff",
  },

  {
    number: "02",
    title: "CYBERSECURITY",
    subtitle: "DEFENSE",
    description:
      "Hands-on cybersecurity education covering ethical hacking, VAPT, security operations and defensive security.",
    topics:
      "VAPT · ETHICAL HACKING · SOC · NETWORK SECURITY",
    color: "#ff405a",
  },

  {
    number: "03",
    title: "DATA SCIENCE",
    subtitle: "INSIGHT",
    description:
      "Build practical data science skills through statistics, data analysis, visualization and machine learning.",
    topics:
      "PYTHON · STATISTICS · DATA ANALYTICS · ML",
    color: "#37e69c",
  },

  {
    number: "04",
    title: "CLOUD & DEVOPS",
    subtitle: "INFRASTRUCTURE",
    description:
      "Learn modern cloud infrastructure, automation, containers, DevOps practices and scalable systems.",
    topics:
      "CLOUD · DOCKER · DEVOPS · AUTOMATION",
    color: "#2bd9ff",
  },

  {
    number: "05",
    title: "GENERATIVE AI",
    subtitle: "CREATE",
    description:
      "Explore LLMs, prompt engineering, RAG, AI agents and real-world generative AI applications.",
    topics:
      "LLMs · RAG · AI AGENTS · AUTOMATION",
    color: "#557cff",
  },

  {
    number: "06",
    title: "EMERGING TECHNOLOGIES",
    subtitle: "FRONTIER",
    description:
      "Explore quantum computing, blockchain and other technologies shaping the next generation of digital systems.",
    topics:
      "QUANTUM · BLOCKCHAIN · WEB3 · FRONTIER TECH",
    color: "#ff8b37",
  },
];


/* =========================================================
   EXPERTISE
========================================================= */

const expertise = [
  "Artificial Intelligence & Generative AI",
  "Data Science & Machine Learning",
  "Cybersecurity & Ethical Hacking",
  "System Design & Software Architecture",
  "Cloud Computing & DevOps",
  "Networking & Infrastructure",
  "Data Engineering & Big Data",
  "Emerging Technologies",
];


/* =========================================================
   LEARNING MODEL
========================================================= */

const learningModel = [
  {
    number: "01",
    title: "THEORY",
    description:
      "Build strong conceptual foundations before moving into implementation and real-world systems.",
  },

  {
    number: "02",
    title: "HANDS-ON",
    description:
      "Learn through practical labs, demonstrations and real technology environments.",
  },

  {
    number: "03",
    title: "PROJECTS",
    description:
      "Apply knowledge through capstone projects and realistic technology challenges.",
  },

  {
    number: "04",
    title: "INDUSTRY",
    description:
      "Develop skills aligned with professional environments and current industry requirements.",
  },
];


/* =========================================================
   AUDIENCE
========================================================= */

const audiences = [
  {
    number: "01",
    title: "CORPORATES",
    description:
      "Customized technology upskilling and enterprise training programs.",
  },

  {
    number: "02",
    title: "UNIVERSITIES",
    description:
      "Industry-aligned programs that connect academic learning with practical technology.",
  },

  {
    number: "03",
    title: "ENGINEERING INSTITUTIONS",
    description:
      "Bootcamps, workshops and hands-on technical learning experiences.",
  },

  {
    number: "04",
    title: "STARTUPS",
    description:
      "Practical technology programs designed around rapidly changing startup environments.",
  },

  {
    number: "05",
    title: "GOVERNMENT",
    description:
      "Technology awareness, capability development and specialized technical programs.",
  },

  {
    number: "06",
    title: "STUDENTS & PROFESSIONALS",
    description:
      "Job-ready technical skills through projects, labs and real-world learning.",
  },
];


/* =========================================================
   MAGNETIC BUTTON
========================================================= */

function magneticMove(
  event: React.MouseEvent<HTMLElement>,
  strength = 0.3
) {
  const element = event.currentTarget;

  const rect =
    element.getBoundingClientRect();

  const x =
    event.clientX -
    (rect.left + rect.width / 2);

  const y =
    event.clientY -
    (rect.top + rect.height / 2);

  element.style.transform =
    `translate(${x * strength}px, ${y * strength}px)`;
}


function magneticReset(
  event: React.MouseEvent<HTMLElement>
) {
  event.currentTarget.style.transform = "";
}


/* =========================================================
   TRAINING PAGE
========================================================= */

export default function TrainingPage() {

  /* =======================================================
     SCROLL REVEALS
  ======================================================= */

  useEffect(() => {

    const elements =
      document.querySelectorAll<HTMLElement>(
        "[data-reveal]"
      );

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "in-view"
                );

              }

            }
          );

        },
        {
          threshold: 0.18,
          rootMargin:
            "0px 0px -8% 0px",
        }
      );


    elements.forEach(
      (element) =>
        observer.observe(element)
    );


    return () =>
      observer.disconnect();

  }, []);


  return (
    <main className="site training-page" id="main-content">

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

      <SiteNav />


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="training-page-hero">

        <div
          className="training-page-meta"
        >

          <span>
            PHOSDEEP / TRAINING
          </span>

          <span>
            PEOPLE × TECHNOLOGY
          </span>

        </div>


        <div
          className="training-hero-content"
          data-reveal
        >

          <div className="eyebrow">

            <span className="status-dot" />

            LEARN. BUILD. TRANSFORM.

          </div>


          <h1>

            TRAINING

            <br />

            <span>
              THAT BUILDS.
            </span>

          </h1>


          <p>
            We bridge the gap between
            academic learning and real-world
            technology through immersive,
            practical and industry-driven
            training.
          </p>

        </div>


        <div className="training-hero-index">

          02

          <span>
            PEOPLE
          </span>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="training-introduction">

        <div
          className="training-intro-label"
          data-reveal
        >
          THE PHOSDEEP APPROACH
        </div>


        <div
          className="training-intro-content"
          data-reveal
        >

          <h2>

            TECHNOLOGY IS

            <br />

            MOVING FAST.

            <br />

            <span>
              SO SHOULD LEARNING.
            </span>

          </h2>


          <div className="training-intro-copy">

            <p>
              Phosdeep is a technology-focused
              training and consulting company
              dedicated to bridging the gap
              between academia and industry
              through cutting-edge,
              hands-on learning experiences.
            </p>


            <p>
              Our programs combine strong
              theoretical foundations with
              real-world applications, enabling
              students, professionals and
              organizations to solve complex
              technology challenges with
              confidence.
            </p>


            <p>
              We believe learning should be
              immersive, practical and
              industry-driven — not limited
              to classrooms or theoretical
              exercises.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROGRAMS
      ===================================================== */}

      <section className="training-programs">

        <div className="training-section-header">

          <div>

            <span>
              01 — PROGRAMS
            </span>

            <h2>

              BUILD

              <br />

              <span>
                REAL SKILLS.
              </span>

            </h2>

          </div>


          <p>
            Our programs can be adapted
            to the audience, technology
            stack, duration and
            organizational objectives.
          </p>

        </div>


        <div className="training-program-grid">

          {programs.map(
            (program) => (

              <article
                key={program.number}
                className="training-program-card"
                data-reveal
                style={
                  {
                    "--program-color":
                      program.color,
                  } as React.CSSProperties
                }
                data-cursor="link"
                data-cursor-color={
                  program.color
                }
              >

                <div className="training-program-top">

                  <span>
                    {program.number}
                  </span>

                  <span className="training-program-arrow">
                    ↗
                  </span>

                </div>


                <div className="training-program-content">

                  <span className="training-program-subtitle">

                    {program.subtitle}

                  </span>


                  <h3>
                    {program.title}
                  </h3>


                  <p>
                    {program.description}
                  </p>

                </div>


                <div className="training-program-topics">

                  {program.topics}

                </div>


                <div className="training-program-line" />

              </article>

            )
          )}

        </div>

      </section>


      {/* =====================================================
          EXPERTISE
      ===================================================== */}

      <section className="training-expertise">

        <div className="training-expertise-heading">

          <span>
            02 — CORE EXPERTISE
          </span>


          <h2>

            TECHNOLOGY

            <br />

            <span>
              WE TEACH.
            </span>

          </h2>

        </div>


        <div className="training-expertise-list">

          {expertise.map(
            (item, index) => (

              <div
                className="training-expertise-item"
                key={item}
                data-reveal
              >

                <span>
                  {String(
                    index + 1
                  ).padStart(2, "0")}
                </span>


                <h3>
                  {item}
                </h3>


                <span className="expertise-arrow">
                  ↗
                </span>

              </div>

            )
          )}

        </div>

      </section>


      {/* =====================================================
          LEARNING MODEL
      ===================================================== */}

      <section className="learning-model">

        <div
          className="learning-model-heading"
          data-reveal
        >

          <span>
            03 — LEARNING MODEL
          </span>


          <h2>

            LEARN.

            <br />

            BUILD.

            <br />

            <span>
              APPLY.
            </span>

          </h2>

        </div>


        <div className="learning-model-grid">

          {learningModel.map(
            (item) => (

              <article
                className="learning-model-item"
                key={item.number}
                data-reveal
              >

                <span>
                  {item.number}
                </span>


                <h3>
                  {item.title}
                </h3>


                <p>
                  {item.description}
                </p>

              </article>

            )
          )}

        </div>

      </section>


      {/* =====================================================
          AUDIENCE
      ===================================================== */}

      <section className="training-audience">

        <div
          className="training-audience-header"
          data-reveal
        >

          <span>
            04 — WHO WE WORK WITH
          </span>


          <h2>

            FROM

            <br />

            <span>
              CLASSROOM
            </span>

            <br />

            TO

            <br />

            <span>
              BOARDROOM.
            </span>

          </h2>

        </div>


        <div className="training-audience-grid">

          {audiences.map(
            (audience) => (

              <div
                key={audience.number}
                data-reveal
              >

                <span>
                  {audience.number}
                </span>


                <h3>
                  {audience.title}
                </h3>


                <p>
                  {audience.description}
                </p>

              </div>

            )
          )}

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="training-page-cta">

        <span>
          CUSTOM TRAINING PROGRAMS
        </span>


        <h2 data-reveal>

          BUILD A

          <br />

          PROGRAM

          <br />

          <span>
            FOR YOUR PEOPLE.
          </span>

        </h2>


        <Link
          href="/contact"
          className="contact-button"
          data-cursor="magnetic"
          data-cursor-label="CONTACT"
          data-cursor-color="#a83cff"
          onMouseMove={(event) =>
            magneticMove(
              event,
              0.3
            )
          }
          onMouseLeave={
            magneticReset
          }
        >

          DISCUSS A TRAINING PROGRAM

          <span>
            ↗
          </span>

        </Link>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>

        <Link
          href="/"
          className="logo"
          data-cursor="link"
          data-cursor-label="HOME"
          data-cursor-color="#38d9ff"
        >
          PHOS<span>DEEP</span>
        </Link>


        <div>
          © 2026 PHOSDEEP
          INTERNATIONAL
        </div>


        <div>
          DELHI · INDIA
        </div>

      </footer>

    </main>
  );
}