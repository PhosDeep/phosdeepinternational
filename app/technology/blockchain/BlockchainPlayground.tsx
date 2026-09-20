"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  type Block,
  type Transaction,
  GENESIS_PREV_HASH,
  hashBlock,
  uid,
} from "./blockchain-utils";
import HashLab from "./HashLab";
import TransactionLab from "./TransactionLab";
import MiningSimulation from "./MiningSimulation";
import BlockchainVisualizer from "./BlockchainVisualizer";
import TamperAttack from "./TamperAttack";
import CompletionSummary from "./CompletionSummary";
import styles from "./blockchain-playground.module.css";

/* =========================================================
   STAGE CONFIG
========================================================= */

const STAGES = [
  { id: "intro",       label: "START",        icon: "◎" },
  { id: "hash",        label: "HASH",         icon: "#" },
  { id: "transaction", label: "TX",           icon: "⇄" },
  { id: "mining",      label: "MINE",         icon: "⛏" },
  { id: "blockchain",  label: "CHAIN",        icon: "⛓" },
  { id: "tamper",      label: "ATTACK",       icon: "⚠" },
  { id: "complete",    label: "DONE",         icon: "✓" },
] as const;

type StageId = (typeof STAGES)[number]["id"];

/* =========================================================
   BLOCK DRAFT
========================================================= */

interface BlockDraft {
  transactions: Transaction[];
  previousHash: string;
  index: number;
}

/* =========================================================
   PROGRESS DOTS
========================================================= */

function StageDots({
  current,
  total,
  done,
}: {
  current: number;
  total: number;
  done: number[];
}) {
  return (
    <div className={styles.slideDots} aria-hidden="true">
      {STAGES.map((s, i) => (
        <span
          key={s.id}
          className={styles.slideDot}
          data-active={i === current ? "true" : "false"}
          data-done={done.includes(i) ? "true" : "false"}
        />
      ))}
    </div>
  );
}

/* =========================================================
   SLIDE CHROME — now just a content wrapper, no footer
========================================================= */

function SlideChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.slide}>
      <div className={styles.slideBody}>{children}</div>
    </div>
  );
}

/* =========================================================
   TOP NAV BAR — Back + Next always at the top
========================================================= */

function SlideNav({
  slideIndex,
  canAdvance,
  onNext,
  onPrev,
  nextLabel,
  hideNext,
}: {
  slideIndex: number;
  canAdvance: boolean;
  onNext: () => void;
  onPrev: () => void;
  nextLabel?: string;
  hideNext?: boolean;
}) {
  if (slideIndex === 0) return null; // intro has no nav
  return (
    <div className={styles.slideNavBar}>
      <button
        className={styles.slidePrevBtn}
        onClick={onPrev}
        aria-label="Previous stage"
      >
        ← Back
      </button>

      {!hideNext && (
        <button
          className={styles.slideNextBtn}
          onClick={onNext}
          disabled={!canAdvance}
          data-ready={canAdvance ? "true" : "false"}
          aria-label="Next stage"
        >
          {canAdvance ? (nextLabel ?? "Next Stage →") : "Complete this stage first"}
          {canAdvance && <span className={styles.slideNextArrow} aria-hidden="true">›</span>}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   INTRO SLIDE
========================================================= */

function IntroSlide({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.intro}>
      <p className={styles.introTag}>PHOSDEEP / BLOCKCHAIN / INTERACTIVE</p>
      <h1 className={styles.introTitle}>
        Blockchain
        <br />
        Playground
      </h1>
      <p className={styles.introSub}>
        Don&apos;t just learn how blockchain works.{" "}
        <strong>Build one. Break one. Understand why it works.</strong>
      </p>

      <div className={styles.introFlow} aria-hidden="true">
        {["HASH", "TX", "BLOCK", "MINE", "CHAIN", "ATTACK"].map((item, i, arr) => (
          <span key={item} className={styles.progressStep}>
            <span className={styles.introFlowItem}>{item}</span>
            {i < arr.length - 1 && (
              <span className={styles.introFlowArrow}>›</span>
            )}
          </span>
        ))}
      </div>

      <button
        className={styles.btnPrimary}
        onClick={onStart}
        id="start-playground-btn"
      >
        ⚡ Start Playground
      </button>
    </div>
  );
}

/* =========================================================
   BLOCK BUILDER PANEL (shown inside mining slide)
========================================================= */

function BlockBuilderPanel({ draft, beginnerMode }: { draft: BlockDraft; beginnerMode: boolean }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTag}>Block Preview</p>
        <h2 className={styles.sectionTitle}>Block #{draft.index + 1}</h2>
      </div>

      {beginnerMode && (
        <div className={styles.beginnerTip} style={{ marginBottom: 16 }}>
          <span className={styles.beginnerTipIcon}>💡</span>
          <span>
            <strong>Block</strong> — a container holding transactions, the
            previous block&apos;s fingerprint, and a nonce. Mining produces its hash.
          </span>
        </div>
      )}

      <div className={`${styles.card} ${styles.cardRelative}`}>
        <div className={styles.blockField}>
          <span className={styles.blockFieldKey}>Transactions</span>
          {draft.transactions.map((tx) => (
            <span key={tx.id} className={styles.blockFieldVal}>
              {tx.from} → {tx.to} · ₹{tx.amount}
            </span>
          ))}
        </div>
        <div className={styles.blockField}>
          <span className={styles.blockFieldKey}>Previous Hash</span>
          <span className={styles.blockFieldVal} data-accent="violet">
            {draft.previousHash.slice(0, 20)}…
          </span>
        </div>
        <div className={styles.blockField} style={{ borderBottom: "none" }}>
          <span className={styles.blockFieldKey}>Status</span>
          <span className={styles.blockFieldVal} data-accent="dim">
            Ready to mine ↓
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PLAYGROUND
========================================================= */

export default function BlockchainPlayground() {
  /* ── core slide state ── */
  const [slideIndex, setSlideIndex] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);
  const [doneSlidesSet, setDoneSlidesSet] = useState<Set<number>>(new Set());
  const [beginnerMode, setBeginnerMode] = useState(true);
  const playgroundRef = useRef<HTMLElement | null>(null);

  /* ── blockchain data ── */
  const [pendingTxs, setPendingTxs] = useState<Transaction[]>([]);
  const [currentDraft, setCurrentDraft] = useState<BlockDraft | null>(null);
  const [currentMinedBlock, setCurrentMinedBlock] = useState<Block | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  /* ── flags ── */
  const [hashDone, setHashDone] = useState(false);
  const [miningDone, setMiningDone] = useState(false);
  const [addedToChain, setAddedToChain] = useState(false);
  const [tamperDone, setTamperDone] = useState(false);
  // When user goes back from blockchain to build another block
  const [buildingExtra, setBuildingExtra] = useState(false);

  /* ── swipe ── */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  /* ── slide advance/back ── */
  const markDone = useCallback((index: number) => {
    setDoneSlidesSet((prev) => new Set([...prev, index]));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      markDone(slideIndex);
      setSlideIndex(index);
      setCanAdvance(false);
      // Snap playground top into view instantly — no smooth scroll that races with slide animation
      requestAnimationFrame(() => {
        playgroundRef.current?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
      });
    },
    [slideIndex, markDone]
  );

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    goTo(slideIndex + 1);
  }, [canAdvance, slideIndex, goTo]);

  const goPrev = useCallback(() => {
    if (slideIndex === 0) return;
    // Skip the Mining slide (3) when going back if there's no active draft
    // (draft is cleared after adding to chain — empty mining slide is confusing)
    const target = slideIndex === 4 && !currentDraft ? 2 : slideIndex - 1;
    setSlideIndex(target);
    setCanAdvance(true); // already completed a prev slide
  }, [slideIndex, currentDraft]);

  /* ── touch / swipe ── */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      // Only handle horizontal swipe if it dominates
      if (Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (Math.abs(dx) < 48) return;
      if (dx > 0) goNext(); // swipe left = next
      else goPrev();        // swipe right = prev
    },
    [goNext, goPrev]
  );

  /* ── per-stage canAdvance logic ── */

  // Slide 0 (intro): canAdvance not used — button directly calls goTo(1)

  // Slide 1 (hash): enabled after hash comparison shown
  const onHashComplete = useCallback(() => {
    setHashDone(true);
    setCanAdvance(true);
  }, []);

  // Slide 2 (transaction): enabled when pool has ≥1 tx
  useEffect(() => {
    if (slideIndex === 2) {
      setCanAdvance(pendingTxs.length >= 1);
    }
  }, [slideIndex, pendingTxs.length]);

  // Slide 3 (mining): enabled after "Add to Blockchain" clicked
  useEffect(() => {
    if (slideIndex === 3) {
      setCanAdvance(addedToChain);
    }
  }, [slideIndex, addedToChain]);

  // Slide 4 (blockchain): enabled once ≥2 blocks built
  useEffect(() => {
    if (slideIndex === 4) {
      setCanAdvance(blocks.length >= 2);
    }
  }, [slideIndex, blocks.length]);

  // Slide 5 (tamper): enabled after tamper + restore
  useEffect(() => {
    if (slideIndex === 5) {
      setCanAdvance(tamperDone);
    }
  }, [slideIndex, tamperDone]);

  /* ── transaction creation ── */
  const addTransaction = useCallback((tx: Transaction) => {
    setPendingTxs((prev) => [...prev, tx]);
  }, []);

  /* ── create block: called from Transaction slide "Create Block" button ── */
  const createBlock = useCallback(() => {
    const prevHash =
      blocks.length > 0 ? blocks[blocks.length - 1].hash : GENESIS_PREV_HASH;

    const draft: BlockDraft = {
      transactions: [...pendingTxs],
      previousHash: prevHash,
      index: blocks.length,
    };
    setCurrentDraft(draft);
    setCurrentMinedBlock(null);
    setMiningDone(false);
    setAddedToChain(false);
    // Advance to mining slide
    markDone(2);
    setSlideIndex(3);
    setCanAdvance(false);
  }, [blocks, pendingTxs, markDone]);

  /* ── mining callbacks ── */
  const onMined = useCallback(
    (nonce: number, hash: string) => {
      if (!currentDraft) return;
      const newBlock: Block = {
        index: currentDraft.index,
        timestamp: Date.now(),
        transactions: currentDraft.transactions,
        previousHash: currentDraft.previousHash,
        nonce,
        hash,
        status: "valid",
      };
      setCurrentMinedBlock(newBlock);
      setMiningDone(true);
    },
    [currentDraft]
  );

  const onAddToChain = useCallback(() => {
    if (!currentMinedBlock) return;
    const newBlocks = [...blocks, currentMinedBlock];
    setBlocks(newBlocks);
    setPendingTxs([]);
    setCurrentDraft(null);
    setCurrentMinedBlock(null);
    setAddedToChain(true);

    if (buildingExtra) {
      // Go back to blockchain slide
      setBuildingExtra(false);
      markDone(3);
      setSlideIndex(4);
      setCanAdvance(newBlocks.length >= 2);
    } else {
      setCanAdvance(true);
    }
  }, [currentMinedBlock, blocks, buildingExtra, markDone]);

  /* ── build another block from blockchain slide ── */
  const buildAnotherBlock = useCallback(() => {
    setBuildingExtra(true);
    setAddedToChain(false);
    setSlideIndex(2);
    setCanAdvance(pendingTxs.length >= 1);
  }, [pendingTxs.length]);

  /* ── tamper complete ── */
  const onTamperComplete = useCallback(() => {
    setTamperDone(true);
    setCanAdvance(true);
  }, []);

  /* ── replay ── */
  const replay = useCallback(() => {
    setSlideIndex(0);
    setCanAdvance(false);
    setDoneSlidesSet(new Set());
    setPendingTxs([]);
    setCurrentDraft(null);
    setCurrentMinedBlock(null);
    setBlocks([]);
    setHashDone(false);
    setMiningDone(false);
    setAddedToChain(false);
    setTamperDone(false);
    setBuildingExtra(false);
  }, []);

  /* ── miningBlock helper ── */
  const miningBlock: Block | null = currentMinedBlock ?? (
    currentDraft
      ? {
          index: currentDraft.index,
          timestamp: Date.now(),
          transactions: currentDraft.transactions,
          previousHash: currentDraft.previousHash,
          nonce: 0,
          hash: "",
          status: "valid",
        }
      : null
  );

  const doneArray = Array.from(doneSlidesSet);

  /* ── next label per slide ── */
  const nextLabels: Record<number, string> = {
    1: "Create Transactions →",
    2: "Build & Mine Block →",
    3: buildingExtra ? "Back to Blockchain →" : "View the Blockchain →",
    4: "Try the Tamper Attack →",
    5: "See Your Results →",
  };

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <section
      className={styles.playground}
      ref={playgroundRef}
      aria-label="Blockchain Playground — interactive learning experience"
    >
      {/* Top bar */}
      <div className={styles.slideTopBar}>
        <span className={styles.slideTopTitle}>
          PHOSDEEP / BLOCKCHAIN PLAYGROUND
        </span>

        <StageDots
          current={slideIndex}
          total={STAGES.length}
          done={doneArray}
        />

        {/* Beginner mode toggle */}
        {slideIndex > 0 && (
          <button
            className={styles.beginnerToggle}
            style={{ marginBottom: 0 }}
            onClick={() => setBeginnerMode((b) => !b)}
            data-on={beginnerMode ? "true" : "false"}
            aria-pressed={beginnerMode}
          >
            <span
              className={styles.beginnerToggleTrack}
              data-on={beginnerMode ? "true" : "false"}
            >
              <span className={styles.beginnerToggleThumb} />
            </span>
            <span className={styles.beginnerToggleLabel}>
              {beginnerMode ? "Beginner ON" : "Beginner OFF"}
            </span>
          </button>
        )}
      </div>

      {/* Persistent top nav — Back and Next always above the slide content */}
      <SlideNav
        slideIndex={slideIndex}
        canAdvance={canAdvance}
        onNext={
          slideIndex === 2
            ? createBlock                          // slide 2: must call createBlock to set draft
            : slideIndex === 3 && addedToChain && buildingExtra
            ? () => { /* handled by Add to Chain */ }
            : goNext
        }
        onPrev={goPrev}
        nextLabel={nextLabels[slideIndex]}
        hideNext={slideIndex === 3 && !addedToChain}
      />

      {/* Slide viewport */}
      <div
        className={styles.slideViewport}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className={styles.slideTrack}
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >

          {/* ── SLIDE 0: INTRO ── */}
          <div className={styles.slide}>
            <div className={styles.slideBody}>
              <IntroSlide
                onStart={() => {
                  markDone(0);
                  setSlideIndex(1);
                  setCanAdvance(false);
                }}
              />
            </div>
          </div>

          {/* ── SLIDE 1: HASH LAB ── */}
          <SlideChrome>
            <HashLab
              beginnerMode={beginnerMode}
              onComplete={onHashComplete}
            />
          </SlideChrome>

          {/* ── SLIDE 2: TRANSACTION LAB ── */}
          <SlideChrome>
            <TransactionLab
              beginnerMode={beginnerMode}
              pendingTransactions={pendingTxs}
              onAddTransaction={addTransaction}
              onCreateBlock={createBlock}
            />
          </SlideChrome>

          {/* ── SLIDE 3: MINING ── */}
          <SlideChrome>
            {currentDraft && (
              <BlockBuilderPanel
                draft={currentDraft}
                beginnerMode={beginnerMode}
              />
            )}
            {miningBlock && currentDraft && (
              <MiningSimulation
                block={miningBlock}
                beginnerMode={beginnerMode}
                onMined={onMined}
                onAddToChain={onAddToChain}
              />
            )}
            {!currentDraft && !miningBlock && (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--pg-mono)",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    color: "var(--pg-text-dim)",
                  }}
                >
                  Go back and create transactions first.
                </p>
              </div>
            )}
          </SlideChrome>

          {/* ── SLIDE 4: BLOCKCHAIN ── */}
          <SlideChrome>
            <BlockchainVisualizer
              blocks={blocks}
              beginnerMode={beginnerMode}
              onBlocksChange={setBlocks}
            />
            <div style={{ marginTop: 28 }}>
              <button
                className={styles.btnSecondary}
                onClick={buildAnotherBlock}
                id="add-more-blocks-btn"
              >
                ＋ Build Another Block
              </button>
              {blocks.length < 2 && (
                <p style={{ marginTop: 12, fontFamily: "var(--pg-mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--pg-text-dim)" }}>
                  Build 1 more block to unlock the Tamper Attack
                </p>
              )}
            </div>
          </SlideChrome>

          {/* ── SLIDE 5: TAMPER ATTACK ── */}
          <SlideChrome>
            <TamperAttack
              blocks={blocks}
              beginnerMode={beginnerMode}
              onBlocksChange={setBlocks}
              onComplete={onTamperComplete}
            />
            {blocks.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <div className={styles.divider} />
                <BlockchainVisualizer
                  blocks={blocks}
                  beginnerMode={false}
                  onBlocksChange={setBlocks}
                />
              </div>
            )}
          </SlideChrome>

          {/* ── SLIDE 6: COMPLETE ── */}
          <div className={styles.slide}>
            <div className={styles.slideBody}>
              <CompletionSummary
                progress={{
                  hashing: hashDone,
                  transactions: blocks.length > 0,
                  blocks: blocks.length > 0,
                  mining: miningDone || blocks.length > 0,
                  blockchain: blocks.length >= 2,
                  tamper: tamperDone,
                }}
                onReplay={replay}
              />
            </div>
          </div>

        </div>
        {/* end slideTrack */}
      </div>
      {/* end slideViewport */}

      {/* Stage label strip */}
      <div className={styles.stageLabelStrip}>
        <span className={styles.stageLabelCurrent}>
          {STAGES[slideIndex]?.icon} {STAGES[slideIndex]?.label}
        </span>
        <span className={styles.stageLabelCounter}>
          {slideIndex + 1} / {STAGES.length}
        </span>
      </div>
    </section>
  );
}
