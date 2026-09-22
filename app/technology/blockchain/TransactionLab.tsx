"use client";

import { useCallback, useState } from "react";
import { type Transaction, uid } from "./blockchain-utils";
import styles from "./blockchain-playground.module.css";

const USERS = ["Alice", "Bob", "Charlie"] as const;
type User = (typeof USERS)[number];

interface TransactionLabProps {
  beginnerMode: boolean;
  pendingTransactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onCreateBlock: () => void;
}

function TxCard({ tx, index }: { tx: Transaction; index: number }) {
  return (
    <div className={styles.txCard} style={{ animationDelay: `${index * 80}ms` }}>
      <div className={styles.txCardHeader}>
        <span className={styles.txCardId}>
          TX #{String(index + 1).padStart(3, "0")}
        </span>
        <span className={styles.txCardStatus}>● Pending</span>
      </div>
      <div className={styles.txCardFlow}>
        <span>{tx.from}</span>
        <span className={styles.txFlowArrow}>→</span>
        <span>{tx.to}</span>
      </div>
      <div className={styles.txCardAmount}>₹{tx.amount.toLocaleString()}</div>
    </div>
  );
}

export default function TransactionLab({
  beginnerMode,
  pendingTransactions,
  onAddTransaction,
  onCreateBlock,
}: TransactionLabProps) {
  const [from, setFrom] = useState<User>("Alice");
  const [to, setTo] = useState<User>("Bob");
  const [amount, setAmount] = useState("500");
  const [creating, setCreating] = useState(false);

  const handleCreate = useCallback(async () => {
    const parsed = parseInt(amount, 10);
    if (!parsed || parsed <= 0 || from === to) return;

    setCreating(true);

    // Brief animation pause
    await new Promise((r) => setTimeout(r, 400));

    const tx: Transaction = {
      id: uid(),
      from,
      to,
      amount: parsed,
    };

    onAddTransaction(tx);
    setCreating(false);

    // Cycle to next logical sender/receiver
    if (from === "Alice" && to === "Bob") {
      setFrom("Bob");
      setTo("Charlie");
      setAmount("200");
    } else if (from === "Bob" && to === "Charlie") {
      setFrom("Charlie");
      setTo("Alice");
      setAmount("100");
    }
  }, [from, to, amount, onAddTransaction]);

  const canCreate = from !== to && parseInt(amount, 10) > 0;
  const canCreateBlock = pendingTransactions.length >= 1;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTag}>02 — Transaction Lab</p>
        <h2 className={styles.sectionTitle}>Create Transactions</h2>
        <p className={styles.sectionDesc}>
          Before blocks are created, transactions need to exist. Create at least
          one transaction to continue.
        </p>
      </div>

      {beginnerMode && (
        <div className={styles.beginnerTip}>
          <span className={styles.beginnerTipIcon}>💡</span>
          <span>
            <strong>Transaction</strong> — a record of value being transferred
            from one party to another. Think of it like a digital receipt.
          </span>
        </div>
      )}

      {/* Form */}
      <div
        className={`${styles.card} ${styles.cardRelative}`}
        style={{ marginTop: 20 }}
      >
        <div className={styles.txForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="tx-from">
              From
            </label>
            <select
              id="tx-from"
              className={styles.formSelect}
              value={from}
              onChange={(e) => setFrom(e.target.value as User)}
            >
              {USERS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="tx-to">
              To
            </label>
            <select
              id="tx-to"
              className={styles.formSelect}
              value={to}
              onChange={(e) => setTo(e.target.value as User)}
            >
              {USERS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            {from === to && (
              <span
                style={{
                  fontFamily: "var(--pg-mono)",
                  fontSize: 10,
                  color: "var(--pg-red)",
                  letterSpacing: "0.12em",
                }}
              >
                Must be different
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="tx-amount">
              Amount (₹)
            </label>
            <input
              id="tx-amount"
              className={styles.formInput}
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <button
          className={styles.btnPrimary}
          onClick={handleCreate}
          disabled={!canCreate || creating}
          id="create-transaction-btn"
        >
          {creating ? "Creating..." : "＋ Create Transaction"}
        </button>
      </div>

      {/* Transaction pool */}
      <div className={styles.txPool}>
        <div className={styles.txPoolHeader}>
          <span className={styles.txPoolLabel}>⬡ Transaction Pool</span>
          <span className={styles.txPoolCount}>
            {pendingTransactions.length} pending
          </span>
        </div>

        {pendingTransactions.length === 0 ? (
          <div className={styles.txPoolEmpty}>
            No transactions yet — create one above
          </div>
        ) : (
          <div className={styles.txPoolGrid}>
            {pendingTransactions.map((tx, i) => (
              <TxCard key={tx.id} tx={tx} index={i} />
            ))}
          </div>
        )}
      </div>

      {pendingTransactions.length > 0 && (
        <div className={styles.educNote} style={{ marginTop: 16, marginBottom: 0 }}>
          These transactions are waiting to be grouped into a block. Once you&apos;re
          ready, press <strong>Build &amp; Mine Block</strong> below.
        </div>
      )}
    </div>
  );
}
