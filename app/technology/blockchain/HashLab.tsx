"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sha256 } from "./blockchain-utils";
import styles from "./blockchain-playground.module.css";

interface HashLabProps {
  beginnerMode: boolean;
  onComplete: () => void;
}

type HashState = "idle" | "processing" | "done";

function AnimatedHash({ value }: { value: string }) {
  return (
    <span>
      {value.split("").map((char, i) => (
        <span
          key={i}
          className={styles.hashChar}
          style={{ animationDelay: `${i * 18}ms` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default function HashLab({ beginnerMode, onComplete }: HashLabProps) {
  const [input, setInput] = useState("Hello Blockchain");
  const [hash, setHash] = useState<string | null>(null);
  const [hashState, setHashState] = useState<HashState>("idle");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [compareHash, setCompareHash] = useState<string | null>(null);
  const [compareInput, setCompareInput] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const completedRef = useRef(false);

  const generateHash = useCallback(async () => {
    if (hashState === "processing") return;
    setHashState("processing");
    setShowCompare(false);

    await new Promise((r) => setTimeout(r, 600));

    const result = await sha256(input);
    setHash(result);
    setHashState("done");
    setHasGenerated(true);
  }, [input, hashState]);

  const compareWithNew = useCallback(async () => {
    if (!hash) return;
    const newInput = input.endsWith("!") ? input.slice(0, -1) : input + "!";
    const newHash = await sha256(newInput);
    setCompareInput(newInput);
    setCompareHash(newHash);
    setShowCompare(true);
  }, [hash, input]);

  // Mark stage complete once comparison shown
  useEffect(() => {
    if (showCompare && !completedRef.current) {
      completedRef.current = true;
      setTimeout(onComplete, 1200);
    }
  }, [showCompare, onComplete]);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTag}>01 — Hash Lab</p>
        <h2 className={styles.sectionTitle}>
          What is a Hash?
        </h2>
        <p className={styles.sectionDesc}>
          A hash is like a digital fingerprint of data. Change even one
          character and the entire fingerprint changes completely.
        </p>
      </div>

      {beginnerMode && (
        <div className={styles.beginnerTip}>
          <span className={styles.beginnerTipIcon}>💡</span>
          <span>
            <strong>Hash</strong> — a digital fingerprint of data. Any input,
            any size, always produces a fixed-length unique output. It&apos;s
            impossible to reverse.
          </span>
        </div>
      )}

      <div className={`${styles.card} ${styles.cardRelative}`} style={{ marginTop: 20 }}>
        {/* Input */}
        <div className={styles.formGroup} style={{ marginBottom: 20 }}>
          <label className={styles.formLabel} htmlFor="hash-input">
            Message
          </label>
          <input
            id="hash-input"
            className={styles.formInput}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (hash) {
                setHash(null);
                setHashState("idle");
                setShowCompare(false);
              }
            }}
            placeholder="Type anything..."
          />
        </div>

        {/* Algorithm badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <span className={styles.formLabel}>Algorithm</span>
          <span
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: "var(--pg-violet)",
              padding: "4px 10px",
              border: "1px solid rgba(168,60,255,0.3)",
              borderRadius: "var(--pg-radius)",
              background: "rgba(168,60,255,0.08)",
            }}
          >
            SHA-256
          </span>
        </div>

        {/* Hash output */}
        <div className={styles.hashDisplay} style={{ marginBottom: 20 }}>
          <span className={styles.hashLabel}>Hash Output</span>
          {hashState === "processing" ? (
            <div className={styles.hashProcessing}>
              <span className={styles.spinner} />
              Computing SHA-256...
            </div>
          ) : hash ? (
            <div className={styles.hashValue}>
              <AnimatedHash value={hash} />
            </div>
          ) : (
            <div className={styles.hashValue} data-empty="true">
              Hash will appear here...
            </div>
          )}
        </div>

        {/* Generate button */}
        <div className={styles.flex} style={{ gap: 12, flexWrap: "wrap" }}>
          <button
            className={styles.btnPrimary}
            onClick={generateHash}
            disabled={hashState === "processing" || !input.trim()}
            id="generate-hash-btn"
          >
            {hashState === "processing" ? "Computing..." : "⚡ Generate Hash"}
          </button>

          {hasGenerated && !showCompare && hash && (
            <button
              className={styles.btnSecondary}
              onClick={compareWithNew}
              id="compare-hash-btn"
            >
              Change 1 Character →
            </button>
          )}
        </div>
      </div>

      {/* Hash comparison */}
      {showCompare && compareHash && compareInput && (
        <>
          <div
            className={styles.educNote}
            style={{ marginTop: 24, marginBottom: 0 }}
          >
            ↓ Now change just <strong>one character</strong> and watch what
            happens to the fingerprint.
          </div>

          <div className={styles.hashComparison}>
            <div className={styles.hashCompBadge} style={{ background: "rgba(168,60,255,0.06)", borderColor: "rgba(168,60,255,0.3)" }}>
              <span className={styles.hashCompLabel} style={{ color: "var(--pg-violet)" }}>
                OLD HASH ← &quot;{input}&quot;
              </span>
              <span className={styles.hashCompValue} style={{ color: "var(--pg-violet)", fontSize: 11, wordBreak: "break-all", lineHeight: 1.6 }}>
                {hash}
              </span>
            </div>

            <div className={styles.hashCompArrow} style={{ fontSize: 22, padding: "24px 4px 0" }}>
              ≠
            </div>

            <div className={styles.hashCompBadge} style={{ background: "rgba(43,217,255,0.06)", borderColor: "rgba(43,217,255,0.3)" }}>
              <span className={styles.hashCompLabel} style={{ color: "var(--pg-blue)" }}>
                NEW HASH ← &quot;{compareInput}&quot;
              </span>
              <span className={styles.hashCompValue} style={{ color: "var(--pg-blue)", fontSize: 11, wordBreak: "break-all", lineHeight: 1.6 }}>
                <AnimatedHash value={compareHash} />
              </span>
            </div>
          </div>

          <div className={styles.hashDiffNote}>
            <div className={styles.hashDiffItem}>
              <span className={styles.hashDiffItemKey}>Input Change</span>
              <span className={styles.hashDiffItemVal}>1 character</span>
            </div>
            <div className={styles.hashDiffItem}>
              <span className={styles.hashDiffItemKey}>Hash Change</span>
              <span className={styles.hashDiffItemVal} style={{ color: "var(--pg-red)" }}>
                Completely different
              </span>
            </div>
          </div>

          <div className={styles.educNote}>
            Even a tiny change in input produces a completely different hash.
            This is what makes blockchain tamper-evident — you can&apos;t change
            data without changing its fingerprint.
          </div>
        </>
      )}
    </div>
  );
}
