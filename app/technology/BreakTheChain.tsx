"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ALTERED_INDEX,
  BROKEN_INDEX,
  CHAIN_BLOCKS,
  CONCEPTS,
  CONSENSUS_PATHS,
  TRACEABLE_INDICES,
  type ConsensusChoice,
} from "./breakTheChain.data";
import { createNetworkEngine, type NetworkEngine } from "./breakTheChain.engine";
import styles from "./break-the-chain.module.css";

/**
 * BREAK THE CHAIN.
 *
 * A short investigation that runs on the blockchain technology page. The
 * visitor is told only that a block has been altered; they find it by reading
 * the ledger, trace it, decide what the network should do, and are shown the
 * underlying ideas only once the sequence is over.
 *
 * React owns the narrative; the canvas engine owns the motion. The two meet in
 * a single effect that maps the current phase onto a scene.
 */

type Phase =
  | "intro"
  | "explore"
  | "inspect"
  | "rewind"
  | "origin"
  | "decide"
  | "simulate"
  | "reveal";

type TraceState = "idle" | "scanning" | "clean";

const NODE_COUNT = CHAIN_BLOCKS.length;
const LAST_INDEX = NODE_COUNT - 1;

/** Reads as a diegetic state word, not a statistic. */
const PHASE_READOUT: Record<Phase, string> = {
  intro: "LISTENING",
  explore: "SCANNING",
  inspect: "READING BLOCK",
  rewind: "REWINDING",
  origin: "ORIGIN FOUND",
  decide: "AWAITING NETWORK",
  simulate: "NETWORK RESPONDING",
  reveal: "SEQUENCE COMPLETE",
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default function BreakTheChain() {
  const reducedMotion = usePrefersReducedMotion();

  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<NetworkEngine | null>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const lastHoverRef = useRef(-1);
  const phaseRef = useRef<Phase>("intro");
  const timersRef = useRef<number[]>([]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [armed, setArmed] = useState(false);
  const [openBlock, setOpenBlock] = useState<number | null>(null);
  const [visited, setVisited] = useState<number[]>([]);
  const [traced, setTraced] = useState<number[]>([]);
  const [traceState, setTraceState] = useState<TraceState>("idle");
  const [rewindStep, setRewindStep] = useState(LAST_INDEX);
  const [choice, setChoice] = useState<ConsensusChoice | null>(null);
  const [beatIndex, setBeatIndex] = useState(0);

  const block = openBlock === null ? null : CHAIN_BLOCKS[openBlock];
  const path = useMemo(
    () => CONSENSUS_PATHS.find((item) => item.id === choice) ?? null,
    [choice]
  );

  /* -------------------------------------------------------------
     Engine lifecycle
  ------------------------------------------------------------- */

  /** Defers a callback and keeps the handle so unmount can cancel it. */
  const later = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((item) => item !== id);
      callback();
    }, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    const timers = timersRef;
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  /**
   * Moves the node hit-targets and the hover chip onto the canvas positions.
   * Runs inside the engine's frame callback, so it writes to the DOM directly
   * rather than going through state.
   */
  const paintOverlay = useCallback((engine: NetworkEngine) => {
    for (let i = 0; i < NODE_COUNT; i += 1) {
      const element = nodeRefs.current[i];
      if (!element) continue;
      const node = engine.screen[i];
      element.style.transform = `translate3d(${node.x}px, ${node.y}px, 0) translate(-50%, -50%)`;
    }

    const chip = chipRef.current;
    if (!chip) return;

    const hovered = phaseRef.current === "explore" ? engine.hovered : -1;
    if (hovered !== lastHoverRef.current) {
      lastHoverRef.current = hovered;
      if (hovered >= 0) {
        const data = CHAIN_BLOCKS[hovered];
        const [title, meta] = chip.children;
        title.textContent = `BLOCK ${data.label}`;
        meta.textContent = `${data.transactions.length} TX · VERIFIED`;
      }
      chip.dataset.visible = hovered >= 0 ? "true" : "false";
    }

    if (hovered >= 0) {
      const node = engine.screen[hovered];
      chip.style.transform = `translate3d(${node.x}px, ${node.y - node.r - 18}px, 0) translate(-50%, -100%)`;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const engine = createNetworkEngine(canvas, {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onFrame: () => paintOverlay(engine),
    });
    engineRef.current = engine;

    const resizeObserver = new ResizeObserver(() => engine.resize());
    resizeObserver.observe(stage);

    // Only burn frames while the field is actually on screen.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          engine.start();
          setArmed(true);
        } else {
          engine.stop();
        }
      },
      { threshold: 0.2 }
    );
    visibility.observe(stage);

    return () => {
      resizeObserver.disconnect();
      visibility.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [paintOverlay]);

  useEffect(() => {
    engineRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    engineRef.current?.setTraced(traced);
  }, [traced]);

  /* -------------------------------------------------------------
     Phase → scene
  ------------------------------------------------------------- */

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    switch (phase) {
      case "intro":
        engine.setScene({ mode: "dormant", focus: -1, step: 0 });
        break;
      case "explore":
        engine.setScene({ mode: "explore", focus: -1, step: 0 });
        break;
      case "inspect":
        engine.setScene({ mode: "inspect", focus: openBlock ?? -1, step: 0 });
        break;
      case "rewind":
        engine.setScene({ mode: "rewind", focus: rewindStep, step: 0 });
        break;
      case "origin":
      case "decide":
        engine.setScene({ mode: "origin", focus: ALTERED_INDEX, step: 0 });
        break;
      case "simulate":
        if (choice) {
          engine.setScene({ mode: choice, focus: -1, step: Math.min(beatIndex, 3) });
        }
        break;
      case "reveal":
        engine.setScene({ mode: "settled", focus: -1, step: 0 });
        break;
    }
  }, [phase, openBlock, rewindStep, choice, beatIndex]);

  /* -------------------------------------------------------------
     Timed sequences
  ------------------------------------------------------------- */

  // The opening statement holds alone before the field becomes live.
  useEffect(() => {
    if (!armed || phase !== "intro") return;
    const id = window.setTimeout(() => setPhase("explore"), reducedMotion ? 900 : 2400);
    return () => window.clearTimeout(id);
  }, [armed, phase, reducedMotion]);

  // Rewind walks the camera from the chain tip back to its first block.
  useEffect(() => {
    if (phase !== "rewind") return;

    let step = LAST_INDEX;
    let settle = 0;
    setRewindStep(step);

    const interval = window.setInterval(
      () => {
        step -= 1;
        if (step < 0) {
          window.clearInterval(interval);
          settle = window.setTimeout(() => setPhase("origin"), reducedMotion ? 300 : 800);
          return;
        }
        setRewindStep(step);
      },
      reducedMotion ? 380 : 640
    );

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(settle);
    };
  }, [phase, reducedMotion]);

  // The origin statement lands, then the network asks its question.
  useEffect(() => {
    if (phase !== "origin") return;
    const id = window.setTimeout(() => setPhase("decide"), reducedMotion ? 2200 : 4000);
    return () => window.clearTimeout(id);
  }, [phase, reducedMotion]);

  // Consequence beats for whichever path the visitor chose.
  useEffect(() => {
    if (phase !== "simulate" || !path) return;

    if (beatIndex >= path.beats.length) {
      const id = window.setTimeout(() => setPhase("reveal"), reducedMotion ? 2400 : 4200);
      return () => window.clearTimeout(id);
    }

    const hold = reducedMotion
      ? Math.min(1800, path.beats[beatIndex].hold)
      : path.beats[beatIndex].hold;
    const id = window.setTimeout(() => setBeatIndex((value) => value + 1), hold);
    return () => window.clearTimeout(id);
  }, [phase, path, beatIndex, reducedMotion]);

  /* -------------------------------------------------------------
     Pointer
  ------------------------------------------------------------- */

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const engine = engineRef.current;
    const stage = stageRef.current;
    if (!engine || !stage) return;

    const rect = stage.getBoundingClientRect();
    engine.setPointer(event.clientX - rect.left, event.clientY - rect.top, true);

    // The scanner reticle stands in for the cursor, so it is limited to fine
    // pointers and to the phases where the field is the thing being touched.
    const exploring = phaseRef.current === "explore" || phaseRef.current === "intro";
    engine.reticle.active =
      exploring && (event.pointerType === "mouse" || event.pointerType === "pen");
  }, []);

  const handlePointerLeave = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setPointer(0, 0, false);
    engine.reticle.active = false;
  }, []);

  /* -------------------------------------------------------------
     Actions
  ------------------------------------------------------------- */

  const openBlockAt = useCallback((index: number) => {
    engineRef.current?.ripple(index);
    setOpenBlock(index);
    setTraceState("idle");
    setVisited((current) => (current.includes(index) ? current : [...current, index]));
    setPhase("inspect");
  }, []);

  const closeBlock = useCallback(() => {
    setOpenBlock(null);
    setTraceState("idle");
    setPhase("explore");
  }, []);

  const stepBlock = useCallback(
    (delta: number) => {
      if (openBlock === null) return;
      const next = Math.min(LAST_INDEX, Math.max(0, openBlock + delta));
      if (next === openBlock) return;

      setOpenBlock(next);
      setTraceState("idle");
      setVisited((current) => (current.includes(next) ? current : [...current, next]));
    },
    [openBlock]
  );

  const runTrace = useCallback(() => {
    if (openBlock === null || traceState !== "idle") return;
    const target = openBlock;
    setTraceState("scanning");

    later(
      () => {
        if (TRACEABLE_INDICES.includes(target)) {
          setOpenBlock(null);
          setTraceState("idle");
          setPhase("rewind");
          return;
        }

        setTraced((current) => (current.includes(target) ? current : [...current, target]));
        setTraceState("clean");
        later(() => setTraceState("idle"), reducedMotion ? 1200 : 2000);
      },
      reducedMotion ? 400 : 1150
    );
  }, [openBlock, traceState, reducedMotion, later]);

  const pickPath = useCallback((id: ConsensusChoice) => {
    setChoice(id);
    setBeatIndex(0);
    setPhase("simulate");
  }, []);

  const restart = useCallback(() => {
    setOpenBlock(null);
    setVisited([]);
    setTraced([]);
    setTraceState("idle");
    setRewindStep(LAST_INDEX);
    setChoice(null);
    setBeatIndex(0);
    setPhase("explore");
  }, []);

  const skip = useCallback(() => {
    if (phase === "rewind") setPhase("origin");
    else if (phase === "simulate") setPhase("reveal");
  }, [phase]);

  /* -------------------------------------------------------------
     Keyboard
  ------------------------------------------------------------- */

  useEffect(() => {
    if (phase !== "inspect") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeBlock();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepBlock(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stepBlock(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, closeBlock, stepBlock]);

  /* -------------------------------------------------------------
     Derived copy
  ------------------------------------------------------------- */

  /**
   * Escalating nudges, so nobody stalls — they point at the mechanism, never
   * at the block.
   */
  const hint = useMemo(() => {
    if (traced.length >= 2 || visited.length >= 6) {
      return "ONE OF THOSE FINGERPRINTS NO LONGER MATCHES.";
    }
    if (visited.length >= 3) {
      return "EVERY BLOCK CARRIES THE FINGERPRINT OF THE ONE BEFORE IT.";
    }
    return null;
  }, [visited.length, traced.length]);

  const rewindCaption = useMemo(() => {
    if (phase !== "rewind") return "";
    const current = CHAIN_BLOCKS[rewindStep];
    if (rewindStep === BROKEN_INDEX) return `BLOCK ${current.label} — POINTER DOES NOT MATCH`;
    if (rewindStep === ALTERED_INDEX) return `BLOCK ${current.label} — CONTENTS HASH DIFFERENTLY`;
    return `BLOCK ${current.label} — LINK HOLDS`;
  }, [phase, rewindStep]);

  const announcement = useMemo(() => {
    if (phase === "rewind") return rewindCaption;
    if (phase === "origin") return "The first change occurred at block 021.";
    if (phase === "simulate" && path) {
      return beatIndex >= path.beats.length ? path.outcome : path.beats[beatIndex].caption;
    }
    if (phase === "reveal") return "Sequence complete.";
    return "";
  }, [phase, rewindCaption, path, beatIndex]);

  /* -------------------------------------------------------------
     Render
  ------------------------------------------------------------- */

  return (
    <section
      className={styles.experience}
      aria-label="Break the chain — an interactive network investigation"
      data-phase={phase}
    >
      <div className={styles.frame}>
        <span>BREAK THE CHAIN</span>
        <span className={styles.frameState}>
          <i className={styles.frameDot} aria-hidden="true" />
          {PHASE_READOUT[phase]}
        </span>
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        data-phase={phase}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
      >
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        {/* -------- node hit-targets -------- */}
        <div
          className={styles.nodeLayer}
          data-active={phase === "explore" ? "true" : "false"}
          aria-hidden={phase !== "explore"}
        >
          {CHAIN_BLOCKS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              ref={(element) => {
                nodeRefs.current[index] = element;
              }}
              className={styles.nodeHit}
              tabIndex={phase === "explore" ? 0 : -1}
              onClick={() => openBlockAt(index)}
              onFocus={() => {
                const engine = engineRef.current;
                if (!engine) return;
                const node = engine.screen[index];
                engine.setPointer(node.x, node.y, true);
              }}
            >
              <span className={styles.srOnly}>{`Inspect block ${item.label}`}</span>
            </button>
          ))}
        </div>

        {/* -------- hover readout -------- */}
        <div ref={chipRef} className={styles.chip} data-visible="false" aria-hidden="true">
          <strong />
          <span />
        </div>

        {/* -------- opening statement -------- */}
        {(phase === "intro" || phase === "explore") && (
          <div className={styles.opening} data-live={phase === "explore" ? "true" : "false"}>
            <h2 className={styles.openingLine}>A BLOCK HAS BEEN ALTERED.</h2>
            <p className={styles.openingPrompt}>
              <span className={styles.openingRule} aria-hidden="true" />
              FIND IT
            </p>
          </div>
        )}

        {/* -------- block inspector -------- */}
        {phase === "inspect" && block && (
          <div className={styles.inspectorLayer}>
            <article
              className={styles.inspector}
              data-scanning={traceState === "scanning" ? "true" : "false"}
              aria-label={`Block ${block.label}`}
            >
              <header className={styles.inspectorHead}>
                <div className={styles.inspectorId}>
                  <span>BLOCK</span>
                  <strong>{block.label}</strong>
                </div>

                <div className={styles.inspectorNav}>
                  <button
                    type="button"
                    onClick={() => stepBlock(-1)}
                    disabled={block.index === 0}
                    aria-label="Previous block"
                  >
                    ←
                  </button>
                  <span aria-hidden="true">
                    {String(block.index + 1).padStart(2, "0")}/{NODE_COUNT}
                  </span>
                  <button
                    type="button"
                    onClick={() => stepBlock(1)}
                    disabled={block.index === LAST_INDEX}
                    aria-label="Next block"
                  >
                    →
                  </button>
                </div>

                <button type="button" className={styles.inspectorClose} onClick={closeBlock}>
                  CLOSE
                </button>
              </header>

              <ul className={styles.ledger}>
                {block.transactions.map((transaction, index) => (
                  <li key={`${block.label}-${index}`}>
                    <span className={styles.ledgerIndex}>
                      TRANSACTION {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.ledgerFlow}>
                      {transaction.from}
                      <i aria-hidden="true">→</i>
                      {transaction.to}
                    </span>
                    <span className={styles.ledgerAmount}>{transaction.amount}</span>
                  </li>
                ))}
              </ul>

              <dl className={styles.hashes}>
                <div>
                  <dt>PREVIOUS HASH</dt>
                  <dd>
                    {block.index > 0 ? (
                      <button
                        type="button"
                        className={styles.hashLink}
                        onClick={() => stepBlock(-1)}
                        title={`Open block ${CHAIN_BLOCKS[block.index - 1].label}`}
                      >
                        {block.prevHash}
                      </button>
                    ) : (
                      <span>{block.prevHash}</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>BLOCK HASH</dt>
                  <dd>
                    <span>{block.hash}</span>
                  </dd>
                </div>
              </dl>

              <footer className={styles.inspectorFoot}>
                <div className={styles.status}>
                  <span>STATUS</span>
                  <strong data-state={traceState}>
                    {traceState === "scanning"
                      ? "TRACING"
                      : traceState === "clean"
                        ? "LINK INTACT"
                        : "VERIFIED"}
                  </strong>
                </div>

                <button
                  type="button"
                  className={styles.trace}
                  onClick={runTrace}
                  disabled={traceState !== "idle"}
                >
                  {traceState === "clean" ? "NO DIVERGENCE" : "TRACE"}
                  <i aria-hidden="true">→</i>
                </button>
              </footer>

              {hint && traceState === "idle" && <p className={styles.hint}>{hint}</p>}
            </article>
          </div>
        )}

        {/* -------- rewind -------- */}
        {phase === "rewind" && (
          <div className={styles.rewind}>
            <div className={styles.ladder} aria-hidden="true">
              {[...CHAIN_BLOCKS].reverse().map((item) => {
                const passed = item.index >= rewindStep;
                const broken = item.index === ALTERED_INDEX || item.index === BROKEN_INDEX;
                return (
                  <div
                    key={item.label}
                    className={styles.ladderRow}
                    data-passed={passed ? "true" : "false"}
                    data-current={item.index === rewindStep ? "true" : "false"}
                    data-broken={passed && broken ? "true" : "false"}
                  >
                    <span className={styles.ladderLabel}>{item.label}</span>
                    <span className={styles.ladderRule} />
                    <span className={styles.ladderState}>
                      {!passed ? "" : broken ? "MISMATCH" : "OK"}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className={styles.rewindCaption} key={rewindStep}>
              {rewindCaption}
            </p>
          </div>
        )}

        {/* -------- origin + decision -------- */}
        {(phase === "origin" || phase === "decide") && (
          <div className={styles.verdict}>
            <h2 className={styles.verdictLine}>THE FIRST CHANGE OCCURRED HERE.</h2>
            <p className={styles.verdictNote}>
              BLOCK 021 NOW HASHES TO{" "}
              <em>{CHAIN_BLOCKS[ALTERED_INDEX].hash}</em>. BLOCK 022 STILL POINTS AT{" "}
              <em>{CHAIN_BLOCKS[ALTERED_INDEX].hashBeforeEdit}</em>.
            </p>

            {phase === "decide" && (
              <div className={styles.choices}>
                <p className={styles.choicesQuestion}>WHAT SHOULD THE NETWORK DO?</p>
                {CONSENSUS_PATHS.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.choice}
                    onClick={() => pickPath(item.id)}
                    style={{ animationDelay: `${index * 110}ms` }}
                  >
                    <span className={styles.choiceIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.choiceLabel}>{item.label}</span>
                    <span className={styles.choiceHint}>{item.hint}</span>
                    <span className={styles.choiceArrow} aria-hidden="true">
                      →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------- consequence -------- */}
        {phase === "simulate" && path && (
          <div className={styles.simulate}>
            <div className={styles.rail} aria-hidden="true">
              {path.beats.map((beat, index) => (
                <span
                  key={beat.caption}
                  data-filled={index <= beatIndex ? "true" : "false"}
                />
              ))}
            </div>

            {beatIndex < path.beats.length ? (
              <p className={styles.beat} key={beatIndex}>
                {path.beats[beatIndex].caption}
              </p>
            ) : (
              <p className={styles.outcome}>{path.outcome}</p>
            )}
          </div>
        )}

        {/* -------- reveal -------- */}
        {phase === "reveal" && (
          <div className={styles.reveal}>
            <div className={styles.revealInner}>
              <h2 className={styles.revealLead}>
                WHAT YOU JUST INVESTIGATED IS THE CORE PROBLEM BLOCKCHAIN WAS DESIGNED TO
                ADDRESS.
              </h2>

              <ol className={styles.concepts}>
                {CONCEPTS.map((concept, index) => (
                  <li
                    key={concept.title}
                    className={styles.concept}
                    style={{ animationDelay: `${600 + index * 420}ms` }}
                  >
                    <h3>{concept.title}</h3>
                    <p>{concept.body}</p>
                    {index < CONCEPTS.length - 1 && (
                      <span className={styles.conceptLink} aria-hidden="true">
                        ↓
                      </span>
                    )}
                  </li>
                ))}
              </ol>

              <button
                type="button"
                className={styles.restart}
                onClick={restart}
                style={{ animationDelay: `${600 + CONCEPTS.length * 420}ms` }}
              >
                RUN THE SEQUENCE AGAIN
                <i aria-hidden="true">↺</i>
              </button>
            </div>
          </div>
        )}

        {(phase === "rewind" || phase === "simulate") && (
          <button type="button" className={styles.skip} onClick={skip}>
            SKIP
          </button>
        )}

        <p className={styles.srOnly} aria-live="polite">
          {announcement}
        </p>
      </div>
    </section>
  );
}
