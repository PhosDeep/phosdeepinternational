/**
 * blockchain-utils.ts
 *
 * Core cryptographic and chain-validation utilities for the
 * Blockchain Playground. Uses the browser Web Crypto API so
 * hashes are real SHA-256, not simulated.
 */

/* =========================================================
   TYPES
========================================================= */

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
}

export type BlockStatus = "valid" | "invalid" | "tampered";

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  nonce: number;
  hash: string;
  status: BlockStatus;
}

/* =========================================================
   SHA-256
========================================================= */

/** Converts an ArrayBuffer to a lowercase hex string. */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Produces a real SHA-256 hash of any string using the Web Crypto API. */
export async function sha256(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return bufferToHex(hashBuffer);
}

/* =========================================================
   BLOCK HASHING
========================================================= */

/**
 * Deterministically serialises the fields that define a block's
 * identity and returns the SHA-256 hash of that payload.
 */
export async function hashBlock(
  index: number,
  timestamp: number,
  transactions: Transaction[],
  previousHash: string,
  nonce: number
): Promise<string> {
  const payload = JSON.stringify({
    index,
    timestamp,
    transactions: transactions.map((t) => ({
      id: t.id,
      from: t.from,
      to: t.to,
      amount: t.amount,
    })),
    previousHash,
    nonce,
  });
  return sha256(payload);
}

/* =========================================================
   CHAIN VALIDATION
========================================================= */

/**
 * Validates a chain of blocks.
 *
 * Rules:
 * 1. Block #0 (genesis) must have previousHash === GENESIS_PREV_HASH.
 * 2. Every subsequent block's previousHash must equal the hash of the
 *    block immediately before it.
 * 3. Hashes are NOT re-computed here (async), so validation is purely
 *    structural (previousHash linkage). Hash correctness is checked
 *    separately when a block is tampered.
 *
 * Returns an array of statuses parallel to the blocks array.
 */
export function validateChainStructure(blocks: Block[]): BlockStatus[] {
  if (blocks.length === 0) return [];

  const statuses: BlockStatus[] = new Array(blocks.length).fill("valid");

  // Propagate invalidity forward through the chain.
  for (let i = 1; i < blocks.length; i++) {
    const prev = blocks[i - 1];
    const curr = blocks[i];

    // If the previous block is already invalid/tampered, this one
    // inherits the invalidity regardless of its own linkage.
    if (statuses[i - 1] !== "valid") {
      statuses[i] = "invalid";
      continue;
    }

    if (curr.previousHash !== prev.hash) {
      statuses[i] = "invalid";
    }
  }

  return statuses;
}

/**
 * Recomputes and validates the hash of a single block.
 * Used to detect tampering (i.e. stored hash !== recomputed hash).
 */
export async function verifyBlockHash(block: Block): Promise<boolean> {
  const expected = await hashBlock(
    block.index,
    block.timestamp,
    block.transactions,
    block.previousHash,
    block.nonce
  );
  return expected === block.hash;
}

/* =========================================================
   GENESIS CONSTANTS
========================================================= */

export const GENESIS_PREV_HASH =
  "0000000000000000000000000000000000000000000000000000000000000000";

/* =========================================================
   MINING SIMULATION
========================================================= */

/**
 * Generates a sequence of "nonce attempt" objects for the educational
 * mining animation. Picks random nonces leading up to a final winning
 * nonce whose hash starts with "0000".
 *
 * Nothing here is real proof-of-work — it is purely a visual story.
 */
export function generateMiningSteps(count = 12): Array<{
  nonce: number;
  hashPreview: string;
}> {
  const steps: Array<{ nonce: number; hashPreview: string }> = [];

  const base = Math.floor(Math.random() * 80000) + 10000;
  const hexChars = "0123456789abcdef";

  const randomHash = () =>
    Array.from({ length: 16 }, () => hexChars[Math.floor(Math.random() * 16)]).join("");

  for (let i = 0; i < count - 1; i++) {
    steps.push({
      nonce: base + i,
      hashPreview: randomHash() + "...",
    });
  }

  // Winning step — hash starts with "0000"
  steps.push({
    nonce: base + count - 1,
    hashPreview: "0000" + randomHash().slice(4) + "...",
  });

  return steps;
}

/* =========================================================
   ID GENERATION
========================================================= */

/** Creates a short unique ID suitable for transaction and block IDs. */
export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}
