/**
 * BREAK THE CHAIN — ledger data.
 *
 * Nine blocks of a small ledger. Every block records the hash of the block
 * before it, which is what turns a list into a chain.
 *
 * Block 021 has been altered: one transaction amount was rewritten from 40
 * to 400. Changing the contents changes the block's own hash, so 021 now
 * hashes to `2D64B07E` — but block 022 still records the hash 021 had
 * *before* the edit (`5C90AE31`). That mismatch is the only trace the edit
 * left behind, and it is what the visitor is meant to find on their own.
 *
 * Nothing here is generated at runtime: the values are fixed so server and
 * client render identically and so the inconsistency is always the same one.
 */

export type ChainTransaction = {
  from: string;
  to: string;
  amount: number;
};

export type ChainBlock = {
  /** Sequential index in the chain, 0-based. */
  index: number;
  /** Display height, zero-padded — "017" … "025". */
  label: string;
  transactions: ChainTransaction[];
  /** Hash this block records for the block before it. */
  prevHash: string;
  /** Hash of this block's own contents. */
  hash: string;
  /**
   * The hash this block had before its contents were edited. Only set on the
   * altered block, and only surfaced after the trace has run.
   */
  hashBeforeEdit?: string;
  /** Contents were rewritten. */
  altered?: boolean;
  /**
   * This block's `prevHash` no longer matches the hash of the block before
   * it — the visible symptom of the edit, one block downstream.
   */
  brokenLink?: boolean;
};

export const CHAIN_BLOCKS: ChainBlock[] = [
  {
    index: 0,
    label: "017",
    transactions: [
      { from: "K", to: "M", amount: 22 },
      { from: "R", to: "T", amount: 61 },
      { from: "B", to: "N", amount: 14 },
    ],
    prevHash: "4B12D0A7",
    hash: "C39E1F04",
  },
  {
    index: 1,
    label: "018",
    transactions: [
      { from: "D", to: "P", amount: 35 },
      { from: "A", to: "C", amount: 18 },
      { from: "W", to: "J", amount: 47 },
    ],
    prevHash: "C39E1F04",
    hash: "7A5D8B22",
  },
  {
    index: 2,
    label: "019",
    transactions: [
      { from: "F", to: "H", amount: 26 },
      { from: "M", to: "S", amount: 53 },
      { from: "T", to: "K", amount: 11 },
    ],
    prevHash: "7A5D8B22",
    hash: "E10C43F9",
  },
  {
    index: 3,
    label: "020",
    transactions: [
      { from: "N", to: "Q", amount: 19 },
      { from: "J", to: "L", amount: 72 },
      { from: "P", to: "A", amount: 33 },
    ],
    prevHash: "E10C43F9",
    hash: "8F7A91C2",
  },
  {
    index: 4,
    label: "021",
    transactions: [
      { from: "A", to: "B", amount: 400 },
      { from: "C", to: "D", amount: 12 },
      { from: "E", to: "F", amount: 17 },
    ],
    prevHash: "8F7A91C2",
    hash: "2D64B07E",
    hashBeforeEdit: "5C90AE31",
    altered: true,
  },
  {
    index: 5,
    label: "022",
    transactions: [
      { from: "S", to: "V", amount: 28 },
      { from: "H", to: "R", amount: 44 },
      { from: "L", to: "G", amount: 16 },
    ],
    prevHash: "5C90AE31",
    hash: "9B3F60D5",
    brokenLink: true,
  },
  {
    index: 6,
    label: "023",
    transactions: [
      { from: "G", to: "W", amount: 57 },
      { from: "T", to: "B", amount: 23 },
      { from: "Q", to: "M", amount: 38 },
    ],
    prevHash: "9B3F60D5",
    hash: "41E7C2A8",
  },
  {
    index: 7,
    label: "024",
    transactions: [
      { from: "V", to: "K", amount: 41 },
      { from: "C", to: "H", amount: 15 },
      { from: "N", to: "D", amount: 66 },
    ],
    prevHash: "41E7C2A8",
    hash: "D082F35B",
  },
  {
    index: 8,
    label: "025",
    transactions: [
      { from: "R", to: "F", amount: 29 },
      { from: "B", to: "P", amount: 52 },
      { from: "K", to: "T", amount: 13 },
    ],
    prevHash: "D082F35B",
    hash: "6E29A4C0",
  },
];

/** The block whose contents were rewritten. */
export const ALTERED_INDEX = 4;

/** The block that still points at the pre-edit hash — where the break shows. */
export const BROKEN_INDEX = 5;

/**
 * Tracing either of these reveals the divergence: 021 because its contents no
 * longer hash to what the chain expects, 022 because its back-pointer is the
 * thing that stopped matching. Every other block traces clean.
 */
export const TRACEABLE_INDICES = [ALTERED_INDEX, BROKEN_INDEX];

export type ConsensusChoice = "majority" | "original" | "rebuild";

export type ConsensusBeat = {
  /** Scene the network engine should play for this beat. */
  step: number;
  caption: string;
  /** Milliseconds this beat holds before the next one starts. */
  hold: number;
};

export type ConsensusPath = {
  id: ConsensusChoice;
  label: string;
  /** One-line framing shown on the choice itself. */
  hint: string;
  beats: ConsensusBeat[];
  /** What the network ended up proving. Shown once the simulation settles. */
  outcome: string;
};

export const CONSENSUS_PATHS: ConsensusPath[] = [
  {
    id: "majority",
    label: "TRUST THE MAJORITY",
    hint: "Let the copies vote.",
    beats: [
      { step: 0, caption: "EVERY NODE OFFERS ITS COPY OF THE HISTORY.", hold: 3000 },
      { step: 1, caption: "EIGHT COPIES AGREE. ONE DOES NOT.", hold: 3000 },
      { step: 2, caption: "THE MINORITY HISTORY IS DROPPED.", hold: 2800 },
      { step: 3, caption: "THE NETWORK SETTLES ON THE RECORD IT SHARES.", hold: 3200 },
    ],
    outcome: "THE EDIT SURVIVED ON ONE MACHINE. IT DID NOT SURVIVE THE NETWORK.",
  },
  {
    id: "original",
    label: "TRUST THE ORIGINAL RECORD",
    hint: "Name one copy as the truth.",
    beats: [
      { step: 0, caption: "THE NETWORK LOOKS FOR AN ORIGINAL.", hold: 2900 },
      { step: 1, caption: "ONE COPY IS MADE AUTHORITATIVE. THE REST DEFER.", hold: 3100 },
      { step: 2, caption: "NOTHING IS LEFT TO VERIFY THE AUTHORITY ITSELF.", hold: 3000 },
      { step: 3, caption: "THE CHAIN FORKS. TWO HISTORIES, NO ARBITER.", hold: 3300 },
    ],
    outcome: "A SINGLE SOURCE OF TRUTH IS ALSO A SINGLE POINT OF FAILURE.",
  },
  {
    id: "rebuild",
    label: "REBUILD CONSENSUS",
    hint: "Re-derive the chain from its origin.",
    beats: [
      { step: 0, caption: "EVERY BLOCK IS HASHED AGAIN, FROM THE ORIGIN FORWARD.", hold: 3100 },
      { step: 1, caption: "THE FIRST HASH THAT DISAGREES IS BLOCK 021.", hold: 3000 },
      { step: 2, caption: "021 IS REBUILT FROM THE HISTORY THE NETWORK SHARES.", hold: 3000 },
      { step: 3, caption: "EVERY POINTER AFTER IT MATCHES AGAIN.", hold: 3200 },
    ],
    outcome: "THE RECORD REPAIRED ITSELF WITHOUT ANYONE BEING PUT IN CHARGE.",
  },
];

export type Concept = {
  title: string;
  body: string;
};

export const CONCEPTS: Concept[] = [
  {
    title: "HASHING",
    body: "A tiny change creates a completely different fingerprint.",
  },
  {
    title: "IMMUTABILITY",
    body: "Changing one block breaks everything connected after it.",
  },
  {
    title: "DISTRIBUTED RECORD",
    body: "The record exists across many independent nodes at once.",
  },
  {
    title: "CONSENSUS",
    body: "The network needs a way to agree on which history is valid.",
  },
];
