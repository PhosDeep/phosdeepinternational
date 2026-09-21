import React from "react";
import styles from "./robot-sequence.module.css";

const COGNITIVE_STAGES = [
  {
    step: "01 // INPUT LAYER",
    title: "Multimodal Perception",
    description:
      "Physical and environmental signals are captured across high-dimensional sensor spaces. Vision tokens, spatial vectors, and contextual prompts are normalized into dense latent representations.",
    tags: ["Vision Transformers", "Spatial Embeddings", "Contextual Streams"],
  },
  {
    step: "02 // NEURAL CORE",
    title: "Latent Reasoning & Processing",
    description:
      "Deep neural networks route tokens through billions of attention heads. Contextual patterns are cross-referenced against learned world models, synthesizing understanding in real time.",
    tags: ["Multi-Head Attention", "World Models", "Deterministic Latent Flow"],
  },
  {
    step: "03 // SYNTHESIS",
    title: "Autonomous Generation",
    description:
      "Understanding converges into intentional action. The model generates new expressions, code, robotic kinematics, and creative constructs tailored to human intent.",
    tags: ["Kinematic Planning", "Generative Diffusion", "Agentic Execution"],
  },
];

export default function GenerativeAIOverview() {
  return (
    <section className={styles.explanationSection} id="generative-ai-overview">
      <div className={styles.explanationWrapper}>
        <header className={styles.explanationHeader} data-reveal>
          <div className={styles.explanationEyebrow}>
            COGNITIVE BREAKDOWN
          </div>

          <h2 className={styles.explanationTitle}>
            WHAT JUST HAPPENED?
            <br />
            <span>PERCEPTION → PROCESSING → GENERATION</span>
          </h2>

          <p className={styles.explanationLead}>
            As you scrolled, you guided an embodied artificial intelligence
            through its core cognitive cycle. Generative AI is no longer just
            text completion — it is an active feedback loop between sensory
            inputs, neural models, and real-world synthesis.
          </p>
        </header>

        <div className={styles.cognitiveGrid} data-reveal>
          {COGNITIVE_STAGES.map((stage, idx) => (
            <div key={idx} className={styles.cognitiveCard}>
              <div className={styles.cardGlow} />
              <div className={styles.cardStepNumber}>{stage.step}</div>
              <h3 className={styles.cardTitle}>{stage.title}</h3>
              <p className={styles.cardDescription}>{stage.description}</p>
              <div className={styles.cardTags}>
                {stage.tags.map((tag, tIdx) => (
                  <span key={tIdx} className={styles.cardTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
