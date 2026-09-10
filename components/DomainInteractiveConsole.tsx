"use client";

import { useState } from "react";

type DomainProps = {
  slug: "cybersecurity" | "generative-ai" | "quantum" | "cloud" | "blockchain" | "research";
  color: string;
};

export default function DomainInteractiveConsole({ slug, color }: DomainProps) {
  const [activeTab, setActiveTab] = useState<string>("default");
  const [logs, setLogs] = useState<string[]>(() => getInitialLogs(slug));
  const [isProcessing, setIsProcessing] = useState(false);

  function getInitialLogs(domainSlug: string): string[] {
    switch (domainSlug) {
      case "cybersecurity":
        return [
          "[CYBER-OPS] Initializing Offensive Vulnerability Matrix v4.8...",
          "[SCAN] Monitoring Port 443, 8080, 22 [OPEN - TLS 1.3 SECURED]",
          "[THREAT-INTEL] Adversarial Defense Active across 1,024 Nodes",
          "[PENETRATION] Zero-Day Vulnerability Check: 0 Exploits Found",
          "[STATUS] Defense Matrix Operating at Peak Security",
        ];
      case "generative-ai":
        return [
          "[NEURAL-ENGINE] Connecting to Autonomous Multi-Agent Swarm...",
          "[RAG-VECTOR] Vector Embeddings Synced (1,000,000 Documents)",
          "[LLM-PIPELINE] Context Window: 128k Tokens | Temp: 0.2",
          "[AGENT-01] Task Allocation: Code Refactoring & Security Audit",
          "[STATUS] Agent Swarm Ready for High-Concurrency Synthesis",
        ];
      case "quantum":
        return [
          "[QUBIT-MATRIX] Initializing Superposition Engine Q-01...",
          "[STATE] |Ψ⟩ = 1/√2 (|00⟩ + |11⟩) [BELL STATE ENTANGLED]",
          "[DECOHERENCE] Quantum Coherence Time: 120μs [STABLE]",
          "[SHOR-ALGO] Quantum Gate Array: 64 Qubits Synchronized",
          "[STATUS] Quantum Fidelity Operating at 99.995%",
        ];
      case "cloud":
        return [
          "[CLOUD-INFRA] Zero-Trust Cluster Pipeline Online...",
          "[CLUSTER-US] Active Serverless Microservices: 128 / 128",
          "[EDGE-NODE] Concurrency Load: 45,000 Requests/sec [SLO 99.999%]",
          "[KUBERNETES] Auto-Scaler Ready for Peak High-Concurrency Load",
          "[STATUS] Cloud Mesh Latency: 1.2ms",
        ];
      case "blockchain":
        return [
          "[LEDGER-NODE] Syncing Distributed Hash Chain Block #19842109...",
          "[CONTRACT] Keccak-256 Audit: Reentrancy Check [PASSED]",
          "[ZK-PROOF] Zero-Knowledge Proof Verification: VALIDATED",
          "[GAS-OPT] Smart Contract Execution Gas Reduction: -42%",
          "[STATUS] Decentralized State Finality Achieved",
        ];
      case "research":
        return [
          "[FRONTIER-LABS] Loading Deep Tech R&D Telemetry 2026...",
          "[EXP-01] Post-Quantum Cryptographic Lattices: STABLE",
          "[EXP-02] Neural Architecture Search: CONVERGED",
          "[PAPERS] 14 Frontier Research Papers Published to Repository",
          "[STATUS] Lab Experiment Matrix Operational",
        ];
      default:
        return ["System Ready."];
    }
  }

  function handleAction(actionType: string, logMsg: string) {
    if (isProcessing) return;
    setIsProcessing(true);
    setActiveTab(actionType);

    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${logMsg}`, ...prev.slice(0, 5)]);

    setTimeout(() => {
      setIsProcessing(false);
    }, 600);
  }

  return (
    <div className={`domain-console-wrapper domain-${slug}`}>
      {/* CONSOLE HEADER */}
      <div className="console-top-bar">
        <div className="console-status">
          <span className="console-dot" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
          <span className="console-title">{slug.toUpperCase()} // DOMAIN TERMINAL</span>
        </div>
        <div className="console-controls">
          <span className="control-btn red" />
          <span className="control-btn yellow" />
          <span className="control-btn green" />
        </div>
      </div>

      {/* INTERACTIVE ACTION BUTTONS TAILORED FOR THIS SPECIFIC DOMAIN */}
      <div className="console-action-buttons">
        {slug === "cybersecurity" && (
          <>
            <button
              type="button"
              className={`console-btn ${activeTab === "scan" ? "active" : ""}`}
              onClick={() => handleAction("scan", "PENETRATION SCAN COMPLETE: 0 Threat Vectors Found. Firewall Reinforced.")}
            >
              <span>⚡ RUN PENETRATION SCAN</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "shield" ? "active" : ""}`}
              onClick={() => handleAction("shield", "ZERO-TRUST SHIELD DEPLOYED: Enforced 2FA & Micro-segmentation.")}
            >
              <span>🛡️ DEPLOY ZERO-TRUST SHIELD</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "exploit" ? "active" : ""}`}
              onClick={() => handleAction("exploit", "ADVERSARIAL ATTACK TEST: Exploit Payload Neutralized in Sandbox.")}
            >
              <span>🔍 TEST EXPLOIT SANDBOX</span>
            </button>
          </>
        )}

        {slug === "generative-ai" && (
          <>
            <button
              type="button"
              className={`console-btn ${activeTab === "agent" ? "active" : ""}`}
              onClick={() => handleAction("agent", "AUTONOMOUS AGENT EXECUTION: Refactored 1,200 Lines of Code in 0.4s.")}
            >
              <span>✦ EXECUTE AGENT SWARM</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "rag" ? "active" : ""}`}
              onClick={() => handleAction("rag", "RAG VECTOR SEARCH: Retreived 15 Relevant Document Embeddings.")}
            >
              <span>🧠 QUERY RAG VECTOR DB</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "llm" ? "active" : ""}`}
              onClick={() => handleAction("llm", "LLM SYNTHESIS: Tokens Streamed at 140 Tokens/sec.")}
            >
              <span>⚡ STREAM TOKEN RESPONSE</span>
            </button>
          </>
        )}

        {slug === "quantum" && (
          <>
            <button
              type="button"
              className={`console-btn ${activeTab === "hadamard" ? "active" : ""}`}
              onClick={() => handleAction("hadamard", "HADAMARD GATE APPLIED: Qubit put into Superposition State |+⟩.")}
            >
              <span>◎ APPLY HADAMARD GATE</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "entangle" ? "active" : ""}`}
              onClick={() => handleAction("entangle", "CNOT ENTANGLEMENT: Bell State Created with 99.99% Fidelity.")}
            >
              <span>✦ ENTANGLE QUBIT PAIR</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "measure" ? "active" : ""}`}
              onClick={() => handleAction("measure", "QUANTUM MEASUREMENT: State Collapsed to 010101 (Probability 50/50).")}
            >
              <span>📊 MEASURE QUBIT ARRAY</span>
            </button>
          </>
        )}

        {slug === "cloud" && (
          <>
            <button
              type="button"
              className={`console-btn ${activeTab === "scale" ? "active" : ""}`}
              onClick={() => handleAction("scale", "AUTO-SCALE TRIGGERED: Scaled from 10 Pods to 250 Kubernetes Nodes.")}
            >
              <span>🚀 SIMULATE TRAFFIC SPIKE</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "failover" ? "active" : ""}`}
              onClick={() => handleAction("failover", "DISASTER FAILOVER: Re-routed 100% Traffic to Secondary Region in 1.2ms.")}
            >
              <span>⚡ EXECUTE REGIONAL FAILOVER</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "policy" ? "active" : ""}`}
              onClick={() => handleAction("policy", "ZERO-TRUST NETWORK POLICY: mTLS Mutual Auth Enforced on API Mesh.")}
            >
              <span>🔒 ENFORCE MESH SECURITY</span>
            </button>
          </>
        )}

        {slug === "blockchain" && (
          <>
            <button
              type="button"
              className={`console-btn ${activeTab === "hash" ? "active" : ""}`}
              onClick={() => handleAction("hash", "KECCAK-256 HASH GENERATED: 0x7f8a901bc3d...d4e5 (Block #19842110).")}
            >
              <span>🔐 GENERATE SHA-256 HASH</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "audit" ? "active" : ""}`}
              onClick={() => handleAction("audit", "SMART CONTRACT AUDIT: Verified Zero Reentrancy or Overflow Bugs.")}
            >
              <span>📜 AUDIT SMART CONTRACT</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "zk" ? "active" : ""}`}
              onClick={() => handleAction("zk", "ZERO-KNOWLEDGE PROOF: zk-SNARK Verification Succeeded in 12ms.")}
            >
              <span>⚡ VERIFY ZK-PROOF</span>
            </button>
          </>
        )}

        {slug === "research" && (
          <>
            <button
              type="button"
              className={`console-btn ${activeTab === "exp" ? "active" : ""}`}
              onClick={() => handleAction("exp", "R&D EXPERIMENT INITIALIZED: Quantum Optics Coherence Simulation Converged.")}
            >
              <span>🔬 RUN LAB EXPERIMENT</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "paper" ? "active" : ""}`}
              onClick={() => handleAction("paper", "R&D PAPER REPOSITORY: Fetched Abstract 'Post-Quantum Lattice Encryption'.")}
            >
              <span>📄 FETCH RESEARCH PAPER</span>
            </button>
            <button
              type="button"
              className={`console-btn ${activeTab === "patent" ? "active" : ""}`}
              onClick={() => handleAction("patent", "PATENT REGISTRY: Verified 08 Deep Tech R&D Patent Filings.")}
            >
              <span>🌐 INSPECT PATENT MATRIX</span>
            </button>
          </>
        )}
      </div>

      {/* LIVE LOG OUTPUT TERMINAL */}
      <div className="console-log-area">
        <div className="console-log-header">
          <span>REALTIME TERMINAL FEED</span>
          <span className="console-ping" style={{ color }}>
            {isProcessing ? "PROCESSING..." : "LIVE SYNC"}
          </span>
        </div>
        <div className="console-log-lines">
          {logs.map((log, i) => (
            <div key={i} className="log-line">
              <span className="log-prompt" style={{ color }}>&gt;</span>
              <span className="log-text">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
