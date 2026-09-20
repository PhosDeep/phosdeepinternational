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
   BLOCK CARD
========================================================= */

function BlockCard({
  block,
  index,
  status,
  animDelay,
}: {
  block: Block;
  index: number;
  status: string;
  animDelay: number;
}) {
  return (
    <div
      className={styles.chainBlock}
      data-status={status}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className={styles.chainBlockIndex}>
        BLOCK #{block.index + 1}
      </div>

      <div className={styles.chainBlockStatus}>
        {status === "valid" && "✓"}
        {status === "tampered" && "⚠️"}
        {status === "invalid" && "❌"}
      </div>

      {/* Transactions */}
      <ul className={styles.chainBlockTxList}>
        {block.transactions.map((tx, i) => (
          <li key={tx.id} className={styles.chainBlockTx}>
            <span>{tx.from}</span>
            <span className={styles.chainBlockTxArrow}>→</span>
            <span>{tx.to}</span>
            <span className={styles.chainBlockTxAmount}>₹{tx.amount}</span>
          </li>
        ))}
      </ul>

      {/* Hashes */}
      <div className={styles.chainBlockHashes}>
        <div className={styles.chainBlockHashRow}>
          <span className={styles.chainBlockHashKey}>PREV HASH</span>
          <span
            className={styles.chainBlockHashVal}
            data-mismatch={
              status === "invalid" && index > 0 ? "true" : "false"
            }
            title={block.previousHash}
          >
            {block.previousHash.slice(0, 14)}…
          </span>
        </div>
        <div className={styles.chainBlockHashRow}>
          <span className={styles.chainBlockHashKey}>BLOCK HASH</span>
          <span
            className={styles.chainBlockHashVal}
            style={{ color: status === "valid" ? "var(--pg-green)" : status === "tampered" ? "var(--pg-amber)" : "var(--pg-red)" }}
            title={block.hash}
          >
            {block.hash.slice(0, 14)}…
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONNECTOR
========================================================= */

function Connector({ broken }: { broken: boolean }) {
  return (
    <div className={styles.chainConnector}>
      <div
        className={styles.chainConnectorLine}
        data-broken={broken ? "true" : "false"}
      />
      <span
        className={styles.chainConnectorArrow}
        data-broken={broken ? "true" : "false"}
      >
        ›
      </span>
    </div>
  );
}

/* =========================================================
   BLOCKCHAIN VISUALIZER
========================================================= */

interface BlockchainVisualizerProps {
  blocks: Block[];
  beginnerMode: boolean;
  onBlocksChange: (blocks: Block[]) => void;
}

export default function BlockchainVisualizer({
  blocks,
  beginnerMode,
  onBlocksChange,
}: BlockchainVisualizerProps) {
  const statuses = validateChainStructure(blocks);

  // Determine which connectors are broken
  const brokenConnectors: boolean[] = blocks.slice(0, -1).map((_, i) => {
    return statuses[i + 1] === "invalid";
  });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTag}>05 — Blockchain</p>
        <h2 className={styles.sectionTitle}>The Chain</h2>
        <p className={styles.sectionDesc}>
          Each block stores a fingerprint of the previous block. This is how
          the chain is formed. Change any block and everything after it breaks.
        </p>
      </div>

      {beginnerMode && (
        <div className={styles.beginnerTip}>
          <span className={styles.beginnerTipIcon}>💡</span>
          <span>
            <strong>Previous Hash</strong> — every block stores the fingerprint
            of the block before it. This creates an unbreakable chain: change
            any block and all following blocks become invalid.
          </span>
        </div>
      )}

      <div className={styles.chainWrapper} style={{ marginTop: 20 }}>
        <div className={styles.chain}>
          {blocks.map((block, i) => (
            <div key={block.index} style={{ display: "flex", alignItems: "center" }}>
              <BlockCard
                block={block}
                index={i}
                status={statuses[i]}
                animDelay={i * 120}
              />
              {i < blocks.length - 1 && (
                <Connector broken={brokenConnectors[i]} />
              )}
            </div>
          ))}
        </div>
      </div>

      {blocks.length > 0 && statuses.some((s) => s !== "valid") && (
        <div
          className={styles.educNote}
          style={{ marginTop: 16, borderLeftColor: "var(--pg-red)", background: "rgba(255,64,90,0.06)" }}
        >
          ❌ One or more blocks are invalid because their previous hash no longer
          matches. This is exactly how blockchain detects tampering.
        </div>
      )}
    </div>
  );
}
