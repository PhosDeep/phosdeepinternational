"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type Block,
  type Transaction,
  hashBlock,
  validateChainStructure,
} from "./blockchain-utils";
import styles from "./blockchain-playground.module.css";

/* =========================================================
   CASCADE STEP
========================================================= */

const CASCADE_STEPS = [
  "Transaction amount changed",
  "Block #1 hash recalculated",
  "Block #2's prev hash no longer matches",
  "Block #2 becomes invalid",
  "Block #3 becomes invalid",
];

function CascadeExplainer({ activeStep }: { activeStep: number }) {
  return (
    <div className={styles.tamperCascade}>
      {CASCADE_STEPS.map((step, i) => (
        <div key={step} className={styles.tamperCascadeStep}>
          <div
            className={styles.tamperCascadeText}
            data-active={i <= activeStep ? "true" : "false"}
          >
            {step}
          </div>
          {i < CASCADE_STEPS.length - 1 && (
            <div className={styles.tamperCascadeArrow}>↓</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   BEFORE / AFTER COMPARISON
========================================================= */

function BeforeAfter({
  block0Before,
  block0After,
  block1Before,
  block1After,
}: {
  block0Before: Block;
  block0After: Block;
  block1Before: Block;
  block1After: Block;
}) {
  return (
    <div style={{ marginTop: 28 }}>
      <h3
        style={{
          fontFamily: "var(--pg-mono)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.38em",
          color: "var(--pg-text-dim)",
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        Before / After Comparison
      </h3>

      <div className={styles.beforeAfter}>
        {/* BEFORE */}
        <div className={`${styles.beforeAfterPanel} ${styles.beforePanel}`}>
          <div className={`${styles.beforeAfterLabel} ${styles.beforeLabel}`}>
            ✓ BEFORE
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "var(--pg-text-dim)",
              marginBottom: 6,
            }}
          >
            BLOCK #1 Transaction
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--pg-green)",
              marginBottom: 12,
            }}
          >
            ₹{block0Before.transactions[0]?.amount}
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 9,
              letterSpacing: "0.16em",
              color: "var(--pg-text-dim)",
              marginBottom: 4,
            }}
          >
            BLOCK #1 HASH
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "var(--pg-green)",
              wordBreak: "break-all",
              marginBottom: 12,
            }}
          >
            {block0Before.hash.slice(0, 20)}…
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 9,
              letterSpacing: "0.16em",
              color: "var(--pg-text-dim)",
              marginBottom: 4,
            }}
          >
            BLOCK #2 STATUS
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "var(--pg-green)",
            }}
          >
            ✓ VALID
          </div>
        </div>

        {/* VS */}
        <div className={styles.beforeAfterVs}>≠</div>

        {/* AFTER */}
        <div className={`${styles.beforeAfterPanel} ${styles.afterPanel}`}>
          <div className={`${styles.beforeAfterLabel} ${styles.afterLabel}`}>
            ⚠️ AFTER
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "var(--pg-text-dim)",
              marginBottom: 6,
            }}
          >
            BLOCK #1 Transaction
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--pg-amber)",
              marginBottom: 12,
            }}
          >
            ₹{block0After.transactions[0]?.amount}{" "}
            <span style={{ color: "var(--pg-red)", fontSize: 11 }}>
              (MODIFIED)
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 9,
              letterSpacing: "0.16em",
              color: "var(--pg-text-dim)",
              marginBottom: 4,
            }}
          >
            BLOCK #1 HASH (CHANGED)
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "var(--pg-red)",
              wordBreak: "break-all",
              marginBottom: 12,
            }}
          >
            {block0After.hash.slice(0, 20)}…
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 9,
              letterSpacing: "0.16em",
              color: "var(--pg-text-dim)",
              marginBottom: 4,
            }}
          >
            BLOCK #2 STATUS
          </div>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "var(--pg-red)",
            }}
          >
            ❌ INVALID — expected {block0Before.hash.slice(0, 10)}…
          </div>
        </div>
      </div>

      <div className={styles.educNote} style={{ marginTop: 16 }}>
        Block #2 still remembers the old fingerprint of Block #1. Because
        Block #1 was changed, the fingerprints no longer match — and Block #2
        (and everything after it) is flagged as invalid.
      </div>
    </div>
  );
}

/* =========================================================
   TAMPER ATTACK
========================================================= */

interface TamperAttackProps {
  blocks: Block[];
  beginnerMode: boolean;
  onBlocksChange: (newBlocks: Block[]) => void;
  onComplete: () => void;
}

type TamperPhase =
  | "idle"
  | "open"
  | "modified"
  | "cascading"
  | "broken"
  | "restored";

export default function TamperAttack({
  blocks,
  beginnerMode,
  onBlocksChange,
  onComplete,
}: TamperAttackProps) {
  const [phase, setPhase] = useState<TamperPhase>("idle");
  const [tamperAmount, setTamperAmount] = useState<string>("");
  const [originalBlocks, setOriginalBlocks] = useState<Block[]>([]);
  const [block0Before, setBlock0Before] = useState<Block | null>(null);
  const [block0After, setBlock0After] = useState<Block | null>(null);
  const [cascadeStep, setCascadeStep] = useState(-1);
  const completedRef = useRef(false);

  // Snapshot of block 0's first tx amount for display
  const block0 = blocks[0];
  const originalAmount = block0?.transactions[0]?.amount ?? 500;

  const openTamper = () => {
    setTamperAmount(String(originalAmount * 10)); // Suggest ×10 amount
    setOriginalBlocks(blocks.map((b) => ({ ...b })));
    setBlock0Before(
      blocks[0] ? { ...blocks[0], transactions: [...blocks[0].transactions.map((t) => ({ ...t }))] } : null
    );
    setPhase("open");
  };

  const applyTamper = useCallback(async () => {
    if (blocks.length < 2) return;
    const newAmount = parseInt(tamperAmount, 10);
    if (!newAmount || newAmount <= 0) return;

    setPhase("modified");

    // Mutate block 0's first transaction
    const tampered = blocks.map((b, bi) => ({
      ...b,
      transactions: b.transactions.map((tx, ti) => {
        if (bi === 0 && ti === 0) return { ...tx, amount: newAmount };
        return { ...tx };
      }),
    }));

    // Recalculate block 0 hash
    const newHash0 = await hashBlock(
      tampered[0].index,
      tampered[0].timestamp,
      tampered[0].transactions,
      tampered[0].previousHash,
      tampered[0].nonce
    );
    tampered[0] = { ...tampered[0], hash: newHash0, status: "tampered" };

    setBlock0After({ ...tampered[0] });

    // Cascade invalidation with delay
    setPhase("cascading");
    for (let step = 0; step < CASCADE_STEPS.length; step++) {
      await new Promise((r) => setTimeout(r, 480));
      setCascadeStep(step);
    }

    // Apply structural validation
    const statuses = validateChainStructure(tampered);
    const finalBlocks = tampered.map((b, i) => ({
      ...b,
      status: statuses[i],
    }));

    await new Promise((r) => setTimeout(r, 600));
    setPhase("broken");
    onBlocksChange(finalBlocks);
  }, [blocks, tamperAmount, onBlocksChange]);

  const restore = useCallback(() => {
    onBlocksChange(originalBlocks);
    setPhase("restored");
    if (!completedRef.current) {
      completedRef.current = true;
      setTimeout(onComplete, 800);
    }
  }, [originalBlocks, onBlocksChange, onComplete]);

  const hasEnoughBlocks = blocks.length >= 2;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTag}>05 — Tamper Attack</p>
        <h2 className={styles.sectionTitle}>Break the Chain</h2>
        <p className={styles.sectionDesc}>
          Can you change history without breaking the chain? Let&apos;s find out.
          Modify a transaction in Block #1 and watch what happens.
        </p>
      </div>

      {beginnerMode && (
        <div className={styles.beginnerTip}>
          <span className={styles.beginnerTipIcon}>⚠️</span>
          <span>
            Because every block stores the fingerprint of the previous block,
            changing any data changes its hash — which breaks the link to the
            next block. <strong>The chain cannot be silently modified.</strong>
          </span>
        </div>
      )}

      {!hasEnoughBlocks && (
        <div
          className={styles.educNote}
          style={{
            marginTop: 20,
            borderLeftColor: "var(--pg-amber)",
            background: "rgba(255,179,71,0.06)",
          }}
        >
          You need at least 2 blocks in the chain to demonstrate the tamper
          attack. Build another block using the Transaction Lab above.
        </div>
      )}

      {/* IDLE — Show tamper button */}
      {phase === "idle" && hasEnoughBlocks && (
        <div style={{ marginTop: 20 }}>
          <p
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--pg-text-dim)",
              marginBottom: 20,
            }}
          >
            Current chain status:{" "}
            {blocks.map((_, i) => (
              <span key={i} style={{ color: "var(--pg-green)", marginRight: 6 }}>
                BLOCK #{i + 1} ✓
              </span>
            ))}
          </p>
          <button
            className={styles.btnDanger}
            onClick={openTamper}
            id="tamper-block-btn"
          >
            ⚠️ Tamper with Block #1
          </button>
        </div>
      )}

      {/* OPEN — tamper interface */}
      {phase === "open" && (
        <div className={styles.tamperLayout} style={{ marginTop: 20 }}>
          <div className={styles.tamperBlock}>
            <div className={styles.tamperTitle}>⚠️ MODIFYING — BLOCK #1</div>
            <div className={styles.tamperField}>
              <label className={styles.tamperFieldLabel} htmlFor="tamper-from">
                Transaction
              </label>
              <div
                style={{
                  fontFamily: "var(--pg-mono)",
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  color: "var(--pg-text-muted)",
                  padding: "8px 0",
                }}
              >
                {block0?.transactions[0]?.from} → {block0?.transactions[0]?.to}
              </div>
            </div>
            <div className={styles.tamperField}>
              <label className={styles.tamperFieldLabel} htmlFor="tamper-amount">
                Amount (₹) — Change this:
              </label>
              <input
                id="tamper-amount"
                className={styles.tamperInput}
                type="number"
                value={tamperAmount}
                onChange={(e) => setTamperAmount(e.target.value)}
                min="1"
              />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
              <button
                className={styles.btnDanger}
                onClick={applyTamper}
                id="apply-tamper-btn"
              >
                Modify Transaction →
              </button>
              <button
                className={styles.btnGhost}
                onClick={() => setPhase("idle")}
              >
                Cancel
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: "var(--pg-mono)",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.32em",
                color: "var(--pg-text-dim)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              What will happen:
            </div>
            <CascadeExplainer activeStep={-1} />
          </div>
        </div>
      )}

      {/* CASCADING — animate the cascade */}
      {phase === "cascading" && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontFamily: "var(--pg-mono)",
              fontSize: 10,
              letterSpacing: "0.28em",
              color: "var(--pg-amber)",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span className={styles.spinner} style={{ borderTopColor: "var(--pg-amber)" }} />
            Propagating changes through the chain...
          </div>
          <CascadeExplainer activeStep={cascadeStep} />
        </div>
      )}

      {/* BROKEN — show the broken chain + before/after */}
      {phase === "broken" && block0Before && block0After && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 18px",
              background: "rgba(255,64,90,0.08)",
              border: "1px solid rgba(255,64,90,0.3)",
              borderRadius: "var(--pg-radius)",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 20 }}>❌</span>
            <div>
              <div
                style={{
                  fontFamily: "var(--pg-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.26em",
                  color: "var(--pg-red)",
                }}
              >
                CHAIN INTEGRITY VIOLATED
              </div>
              <div
                style={{
                  fontFamily: "var(--pg-mono)",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  color: "rgba(255,64,90,0.6)",
                  marginTop: 4,
                }}
              >
                Blocks #2 and beyond are now invalid
              </div>
            </div>
          </div>

          <BeforeAfter
            block0Before={block0Before}
            block0After={block0After}
            block1Before={originalBlocks[1]}
            block1After={blocks[1]}
          />

          <div style={{ marginTop: 24 }}>
            <button
              className={styles.btnSecondary}
              onClick={restore}
              id="restore-chain-btn"
              style={{ borderColor: "rgba(55,230,156,0.4)", color: "var(--pg-green)" }}
            >
              ↺ Restore Blockchain
            </button>
          </div>
        </div>
      )}

      {/* RESTORED */}
      {phase === "restored" && (
        <div
          className={styles.miningSuccess}
          style={{ marginTop: 20 }}
        >
          <span className={styles.miningSuccessIcon}>✓</span>
          <div>
            <div className={styles.miningSuccessText}>
              BLOCKCHAIN RESTORED
            </div>
            <div className={styles.miningSuccessSub}>
              Original transactions · Chain integrity verified
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
