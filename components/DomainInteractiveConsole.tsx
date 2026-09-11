"use client";

import { useEffect, useRef, useState } from "react";

type DomainProps = {
  slug: "cybersecurity" | "generative-ai" | "quantum" | "cloud" | "blockchain" | "research";
  color: string;
};

export default function DomainInteractiveConsole({ slug, color }: DomainProps) {
  const [activeConsoleMode, setActiveConsoleMode] = useState<"arcade" | "terminal">("arcade");

  return (
    <div className={`domain-console-wrapper domain-${slug}`}>
      {/* CONSOLE TOP BAR */}
      <div className="console-top-bar">
        <div className="console-status">
          <span className="console-dot" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
          <span className="console-title">{slug.toUpperCase()} // INTERACTIVE DOMAIN GAME CONSOLE</span>
        </div>

        {/* TABS */}
        <div className="console-mode-tabs">
          <button
            type="button"
            className={`mode-tab-btn ${activeConsoleMode === "arcade" ? "active" : ""}`}
            onClick={() => setActiveConsoleMode("arcade")}
            style={{ color: activeConsoleMode === "arcade" ? color : undefined }}
          >
            🎮 DOMAIN GAME SANDBOX
          </button>
          <button
            type="button"
            className={`mode-tab-btn ${activeConsoleMode === "terminal" ? "active" : ""}`}
            onClick={() => setActiveConsoleMode("terminal")}
            style={{ color: activeConsoleMode === "terminal" ? color : undefined }}
          >
            ⚡ LIVE TELEMETRY FEED
          </button>
        </div>

        <div className="console-controls">
          <span className="control-btn red" />
          <span className="control-btn yellow" />
          <span className="control-btn green" />
        </div>
      </div>

      {/* RENDER THE SPECIFIC GAME BASED ON SLUG */}
      {slug === "cybersecurity" && <CybersecurityGame color={color} activeMode={activeConsoleMode} />}
      {slug === "generative-ai" && <GenerativeAiGame color={color} activeMode={activeConsoleMode} />}
      {slug === "quantum" && <QuantumGame color={color} activeMode={activeConsoleMode} />}
      {slug === "cloud" && <CloudGame color={color} activeMode={activeConsoleMode} />}
      {slug === "blockchain" && <BlockchainGame color={color} activeMode={activeConsoleMode} />}
      {slug === "research" && <ResearchGame color={color} activeMode={activeConsoleMode} />}
    </div>
  );
}


/* =========================================================
   GAME 1: CYBERSECURITY - THREAT PARTICLE BLAST ARCADE
========================================================= */
function CybersecurityGame({ color, activeMode }: { color: string; activeMode: "arcade" | "terminal" }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [threats, setThreats] = useState(0);
  const [hp, setHp] = useState(100);
  const [logs, setLogs] = useState<string[]>([
    "[CYBER-GRID] Particle Threat Blast Game Online.",
    "[GOAL] Click red hacker threat particles before they hit the core!",
  ]);

  const enemiesRef = useRef<{ x: number; y: number; vx: number; vy: number; radius: number }[]>([]);
  const sparksRef = useRef<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number; color: string }[]>([]);
  const shockwavesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; color: string; alpha: number }[]>([]);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeMode !== "arcade") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 360);

    let spawnCounter = 0;
    const coreX = width / 2;
    const coreY = height / 2;

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = "rgba(255, 64, 90, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Center Core
      ctx.save();
      ctx.beginPath();
      ctx.arc(coreX, coreY, 36, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(12, 8, 24, 0.95)";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("CYBER CORE", coreX, coreY - 2);
      ctx.fillStyle = color;
      ctx.font = "bold 9px monospace";
      ctx.fillText(`${hp}% HP`, coreX, coreY + 12);

      // Spawn Enemy Threat
      spawnCounter++;
      if (spawnCounter % 40 === 0) {
        const edge = Math.floor(Math.random() * 4);
        let ex = 0, ey = 0;
        if (edge === 0) { ex = Math.random() * width; ey = -10; }
        else if (edge === 1) { ex = width + 10; ey = Math.random() * height; }
        else if (edge === 2) { ex = Math.random() * width; ey = height + 10; }
        else { ex = -10; ey = Math.random() * height; }

        const angle = Math.atan2(coreY - ey, coreX - ex);
        const speed = 1 + Math.random() * 1.2;
        enemiesRef.current.push({
          x: ex,
          y: ey,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 7,
        });
      }

      // Draw Shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 7;
        sw.alpha -= 0.04;
        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // Shockwave collision with enemies
        for (let j = enemiesRef.current.length - 1; j >= 0; j--) {
          const e = enemiesRef.current[j];
          if (Math.hypot(e.x - sw.x, e.y - sw.y) <= sw.radius + 15) {
            enemiesRef.current.splice(j, 1);
            setScore((s) => s + 100);
            setThreats((t) => t + 1);
          }
        }
      }

      // Draw & update enemies
      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const e = enemiesRef.current[i];
        e.x += e.vx;
        e.y += e.vy;

        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff405a";
        ctx.shadowColor = "#ff405a";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        // Core collision
        if (Math.hypot(e.x - coreX, e.y - coreY) <= 40) {
          enemiesRef.current.splice(i, 1);
          setHp((h) => Math.max(0, h - 5));
          const time = new Date().toLocaleTimeString();
          setLogs((prev) => [`[${time}] ⚠️ CYBER CORE IMPACTED! -5% HP`, ...prev.slice(0, 3)]);
        }
      }

      // Draw Sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const sp = sparksRef.current[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= 0.03;
        if (sp.alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.fill();
        ctx.restore();
      }

      animIdRef.current = requestAnimationFrame(render);
    }

    animIdRef.current = requestAnimationFrame(render);
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [activeMode, color, hp]);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    shockwavesRef.current.push({ x: cx, y: cy, radius: 5, maxRadius: 100, color, alpha: 1 });

    let hits = 0;
    for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
      const enemy = enemiesRef.current[i];
      if (Math.hypot(enemy.x - cx, enemy.y - cy) <= 45) {
        hits++;
        for (let k = 0; k < 12; k++) {
          const a = Math.random() * Math.PI * 2;
          const s = 1 + Math.random() * 3;
          sparksRef.current.push({ x: enemy.x, y: enemy.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, radius: 2, alpha: 1, color: "#37e69c" });
        }
        enemiesRef.current.splice(i, 1);
      }
    }

    if (hits > 0) {
      setScore((s) => s + hits * 150);
      setThreats((t) => t + hits);
      const time = new Date().toLocaleTimeString();
      setLogs((prev) => [`[${time}] 💥 DEFEATED ${hits} THREAT PARTICLES! +${hits * 150} PTS`, ...prev.slice(0, 3)]);
    }
  }

  function triggerEMP() {
    shockwavesRef.current.push({ x: 400, y: 180, radius: 10, maxRadius: 600, color: "#2bd9ff", alpha: 1 });
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ⚡ SCREEN-WIDE EMP SHOCKWAVE ACTIVATED!`, ...prev.slice(0, 3)]);
  }

  return (
    <>
      <div className="arcade-hud-bar">
        <div className="hud-stat-box"><span className="hud-label">DEFENSE SCORE</span><strong style={{ color }}>{score} PTS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">THREATS DEFEATED</span><strong style={{ color: "#37e69c" }}>{threats} THREATS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">CORE INTEGRITY</span><strong style={{ color: hp > 30 ? "#37e69c" : "#ff405a" }}>{hp}% HP</strong></div>
      </div>

      {activeMode === "arcade" ? (
        <div className="particle-canvas-wrapper">
          <div className="canvas-instruction-overlay">
            <span>🎯 CLICK/TAP INCOMING RED HACKER PARTICLES TO DESTROY THEM & DEFEND SYSTEM CORE</span>
          </div>
          <canvas ref={canvasRef} className="interactive-particle-canvas" onClick={handleCanvasClick} />
          <div className="canvas-ability-bar">
            <button type="button" className="ability-btn emp-btn" onClick={triggerEMP}>⚡ TRIGGER EMP SHOCKWAVE PULSE</button>
            <button type="button" className="ability-btn repair-btn" onClick={() => setHp(100)}>🛡️ REPAIR SYSTEM CORE (100% HP)</button>
          </div>
        </div>
      ) : (
        <ConsoleTerminalArea logs={logs} color={color} />
      )}
    </>
  );
}


/* =========================================================
   GAME 2: GENERATIVE AI - NEURAL SYNAPSE WIRING GAME
========================================================= */
function GenerativeAiGame({ color, activeMode }: { color: string; activeMode: "arcade" | "terminal" }) {
  const [trainingPoints, setTrainingPoints] = useState(0);
  const [synapsesLinked, setSynapsesLinked] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(85);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([
    "[NEURAL-ENGINE] AI Synapse Wiring Sandbox Ready.",
    "[GOAL] Click an Input Data Node on the left, then click a Hidden Layer Node to wire neural synapses!",
  ]);

  const nodes = [
    // Layer 1: Inputs
    { id: 0, label: "PROMPT TEXT", type: "input", x: 15, y: 25 },
    { id: 1, label: "IMAGE TOKENS", type: "input", x: 15, y: 50 },
    { id: 2, label: "CODE SYNTAX", type: "input", x: 15, y: 75 },

    // Layer 2: Hidden Layers
    { id: 3, label: "TRANSFORMER ATTN A", type: "hidden", x: 50, y: 20 },
    { id: 4, label: "LATENT DIFFUSION B", type: "hidden", x: 50, y: 50 },
    { id: 5, label: "VECTOR RAG SEARCH C", type: "hidden", x: 50, y: 80 },

    // Layer 3: Output Models
    { id: 6, label: "LLM REASONING", type: "output", x: 85, y: 35 },
    { id: 7, label: "AI AGENT ACTION", type: "output", x: 85, y: 65 },
  ];

  const [connections, setConnections] = useState<[number, number][]>([
    [0, 3], [1, 4], [3, 6],
  ]);

  function handleNodeClick(id: number) {
    if (selectedNode === null) {
      setSelectedNode(id);
    } else {
      if (selectedNode !== id) {
        // Prevent duplicate connection
        const exists = connections.some(
          ([a, b]) => (a === selectedNode && b === id) || (a === id && b === selectedNode)
        );

        if (!exists) {
          setConnections((prev) => [...prev, [selectedNode, id]]);
          setTrainingPoints((p) => p + 250);
          setSynapsesLinked((s) => s + 1);
          setModelAccuracy((acc) => Math.min(100, acc + 2));

          const time = new Date().toLocaleTimeString();
          const fromNode = nodes.find((n) => n.id === selectedNode)?.label;
          const toNode = nodes.find((n) => n.id === id)?.label;
          setLogs((prev) => [`[${time}] ⚡ SYNAPSE WIRED: ${fromNode} ↔ ${toNode} (+250 PTS)`, ...prev.slice(0, 3)]);
        }
      }
      setSelectedNode(null);
    }
  }

  function autoWireAll() {
    setConnections([
      [0, 3], [0, 4], [1, 4], [1, 5], [2, 3], [2, 5],
      [3, 6], [4, 6], [4, 7], [5, 7],
    ]);
    setTrainingPoints((p) => p + 1000);
    setModelAccuracy(99.8);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] 🧠 AUTO-SYNAPSE OPTIMIZATION: All Neural Layers Fully Connected!`, ...prev.slice(0, 3)]);
  }

  return (
    <>
      <div className="arcade-hud-bar">
        <div className="hud-stat-box"><span className="hud-label">TRAINING POINTS</span><strong style={{ color: "#a83cff" }}>{trainingPoints} PTS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">SYNAPSES WIRED</span><strong style={{ color: "#37e69c" }}>{synapsesLinked} LINKS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">MODEL ACCURACY</span><strong style={{ color: "#2bd9ff" }}>{modelAccuracy.toFixed(1)}% ACC</strong></div>
      </div>

      {activeMode === "arcade" ? (
        <div className="particle-canvas-wrapper" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="canvas-instruction-overlay" style={{ position: "relative", top: 0, left: 0, transform: "none" }}>
            <span>🧠 TAP AN INPUT NODE (LEFT) AND A HIDDEN/OUTPUT NODE TO WIRE SYNAPSE CONNECTIONS!</span>
          </div>

          <div style={{ position: "relative", width: "100%", height: "280px", background: "rgba(10, 6, 24, 0.9)", borderRadius: "12px", border: "1px solid rgba(168, 60, 255, 0.3)", overflow: "hidden" }}>
            {/* SVG CONNECTION LINES */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              {connections.map(([n1Id, n2Id], idx) => {
                const n1 = nodes.find((n) => n.id === n1Id);
                const n2 = nodes.find((n) => n.id === n2Id);
                if (!n1 || !n2) return null;
                return (
                  <line
                    key={idx}
                    x1={`${n1.x}%`}
                    y1={`${n1.y}%`}
                    x2={`${n2.x}%`}
                    y2={`${n2.y}%`}
                    stroke="#a83cff"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    style={{ filter: "drop-shadow(0 0 8px #a83cff)" }}
                  />
                );
              })}
            </svg>

            {/* NEURAL NODES */}
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              let nodeBg = "rgba(168, 60, 255, 0.2)";
              if (node.type === "input") nodeBg = "rgba(43, 217, 255, 0.2)";
              if (node.type === "output") nodeBg = "rgba(55, 230, 156, 0.2)";

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleNodeClick(node.id)}
                  style={{
                    position: "absolute",
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                    padding: "10px 14px",
                    background: isSelected ? "#a83cff" : nodeBg,
                    border: `2px solid ${isSelected ? "#ffffff" : "#a83cff"}`,
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: isSelected ? "0 0 20px #a83cff" : "none",
                    transition: "all 0.2s ease",
                    zIndex: 10,
                  }}
                >
                  {node.label}
                </button>
              );
            })}
          </div>

          <div className="canvas-ability-bar" style={{ position: "relative", inset: "auto" }}>
            <button type="button" className="ability-btn emp-btn" onClick={autoWireAll} style={{ borderColor: "#a83cff" }}>
              ⚡ AUTO-WIRE ALL NEURAL SYNAPSES
            </button>
            <button type="button" className="ability-btn repair-btn" onClick={() => setConnections([])}>
              🔄 CLEAR SYNAPSE MATRIX
            </button>
          </div>
        </div>
      ) : (
        <ConsoleTerminalArea logs={logs} color="#a83cff" />
      )}
    </>
  );
}


/* =========================================================
   GAME 3: QUANTUM COMPUTING - QUBIT SPIN FLIPPER
========================================================= */
function QuantumGame({ color, activeMode }: { color: string; activeMode: "arcade" | "terminal" }) {
  const [coherenceScore, setCoherenceScore] = useState(0);
  const [qubitsFixed, setQubitsFixed] = useState(0);
  const [phaseStability, setPhaseStability] = useState(100);
  const [logs, setLogs] = useState<string[]>([
    "[QUANTUM-SIMULATOR] Superposition State Stabilizer Online.",
    "[GOAL] Click red unstable decohered Qubits to execute Pauli-X Gates & flip them back to entangled blue states!",
  ]);

  // 3x3 Grid of Qubit States
  const [qubitStates, setQubitsStates] = useState<Array<{ id: number; state: string; isStable: boolean }>>([
    { id: 0, state: "|0⟩", isStable: true },
    { id: 1, state: "|1⟩", isStable: true },
    { id: 2, state: "|+⟩", isStable: true },
    { id: 3, state: "|-⟩", isStable: true },
    { id: 4, state: "|ψ⟩", isStable: false }, // center unstable
    { id: 5, state: "|0⟩", isStable: true },
    { id: 6, state: "|1⟩", isStable: true },
    { id: 7, state: "|+⟩", isStable: true },
    { id: 8, state: "|-⟩", isStable: true },
  ]);

  // Periodically flip random Qubit into unstable red state
  useEffect(() => {
    const timer = setInterval(() => {
      setQubitsStates((prev) => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        updated[randomIndex] = { ...updated[randomIndex], isStable: false, state: "|ERR⟩" };
        return updated;
      });

      setPhaseStability((stability) => {
        const next = Math.max(20, stability - 3);
        return next;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  function handleQubitClick(index: number) {
    const target = qubitStates[index];
    if (!target.isStable) {
      setQubitsStates((prev) => {
        const updated = [...prev];
        const nextStates = ["|0⟩", "|1⟩", "|+⟩", "|-⟩"];
        updated[index] = {
          id: index,
          state: nextStates[Math.floor(Math.random() * nextStates.length)],
          isStable: true,
        };
        return updated;
      });

      setCoherenceScore((s) => s + 200);
      setQubitsFixed((q) => q + 1);
      setPhaseStability((ps) => Math.min(100, ps + 8));

      const time = new Date().toLocaleTimeString();
      setLogs((prev) => [`[${time}] ⚛️ PAULI-X GATE APPLIED: Qubit #${index} Stabilized (+200 PTS)`, ...prev.slice(0, 3)]);
    }
  }

  function applyHadamardWave() {
    setQubitsStates((prev) =>
      prev.map((q, i) => ({ id: i, state: ["|0⟩", "|1⟩", "|+⟩"][i % 3], isStable: true }))
    );
    setPhaseStability(100);
    setCoherenceScore((s) => s + 800);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] 🌀 HADAMARD QUANTUM WAVE: All 9 Qubits Entangled to 100% Phase Coherence!`, ...prev.slice(0, 3)]);
  }

  return (
    <>
      <div className="arcade-hud-bar">
        <div className="hud-stat-box"><span className="hud-label">COHERENCE SCORE</span><strong style={{ color: "#557cff" }}>{coherenceScore} PTS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">QUBITS STABILIZED</span><strong style={{ color: "#37e69c" }}>{qubitsFixed} QUBITS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">PHASE STABILITY</span><strong style={{ color: phaseStability > 40 ? "#2bd9ff" : "#ff405a" }}>{phaseStability}% COHERENT</strong></div>
      </div>

      {activeMode === "arcade" ? (
        <div className="particle-canvas-wrapper" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="canvas-instruction-overlay" style={{ position: "relative", top: 0, left: 0, transform: "none" }}>
            <span>⚛️ CLICK UNSTABLE RED QUBITS TO APPLY PAULI-X GATES & STABILIZE SUPERPOSITION!</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", height: "280px", alignItems: "center" }}>
            {qubitStates.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                onClick={() => handleQubitClick(idx)}
                style={{
                  height: "75px",
                  background: q.isStable ? "rgba(85, 124, 255, 0.15)" : "rgba(255, 64, 90, 0.3)",
                  border: `2px solid ${q.isStable ? "#557cff" : "#ff405a"}`,
                  borderRadius: "12px",
                  color: q.isStable ? "#ffffff" : "#ff405a",
                  fontFamily: "monospace",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: q.isStable ? "default" : "pointer",
                  boxShadow: q.isStable ? "0 0 15px rgba(85, 124, 255, 0.3)" : "0 0 25px rgba(255, 64, 90, 0.8)",
                  animation: !q.isStable ? "pulse 1s infinite alternate" : "none",
                }}
              >
                <div>{q.state}</div>
                <div style={{ fontSize: "9px", opacity: 0.8, marginTop: "4px" }}>
                  {q.isStable ? "SUPERPOSITION" : "DECOHERED!"}
                </div>
              </button>
            ))}
          </div>

          <div className="canvas-ability-bar" style={{ position: "relative", inset: "auto" }}>
            <button type="button" className="ability-btn emp-btn" onClick={applyHadamardWave} style={{ borderColor: "#557cff" }}>
              ⚛️ HADAMARD ENTANGLEMENT PULSE
            </button>
            <button type="button" className="ability-btn repair-btn" onClick={() => setPhaseStability(100)}>
              🌀 RESTORE PHASE COHERENCE (100%)
            </button>
          </div>
        </div>
      ) : (
        <ConsoleTerminalArea logs={logs} color="#557cff" />
      )}
    </>
  );
}


/* =========================================================
   GAME 4: CLOUD INFRASTRUCTURE - LOAD BALANCER TRAFFIC ROUTER
========================================================= */
function CloudGame({ color, activeMode }: { color: string; activeMode: "arcade" | "terminal" }) {
  const [uptimeScore, setUptimeScore] = useState(0);
  const [packetsRouted, setPacketsRouted] = useState(0);
  const [clusterHealth, setClusterHealth] = useState(98);
  const [valveState, setValveState] = useState<"US-EAST" | "EU-WEST" | "AP-SOUTH">("US-EAST");
  const [logs, setLogs] = useState<string[]>([
    "[CLOUD-BALANCER] Multi-Region Traffic Pipeline Switcher Active.",
    "[GOAL] Click the Load Balancer Valve button to switch traffic towards low-load cloud servers!",
  ]);

  const [servers, setServers] = useState([
    { name: "US-EAST (N. VIRGINIA)", load: 78, color: "#2bd9ff" },
    { name: "EU-WEST (FRANKFURT)", load: 35, color: "#37e69c" },
    { name: "AP-SOUTH (MUMBAI)", load: 22, color: "#a83cff" },
  ]);

  // Dynamic traffic load simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setServers((prev) =>
        prev.map((srv) => {
          const isTargeted = srv.name.startsWith(valveState);
          const loadChange = isTargeted ? Math.floor(Math.random() * 8) + 2 : -Math.floor(Math.random() * 5);
          const newLoad = Math.min(100, Math.max(10, srv.load + loadChange));
          return { ...srv, load: newLoad };
        })
      );
    }, 1800);

    return () => clearInterval(timer);
  }, [valveState]);

  function switchValve() {
    const regions: ("US-EAST" | "EU-WEST" | "AP-SOUTH")[] = ["US-EAST", "EU-WEST", "AP-SOUTH"];
    const nextRegion = regions[(regions.indexOf(valveState) + 1) % regions.length];
    setValveState(nextRegion);

    setUptimeScore((s) => s + 180);
    setPacketsRouted((p) => p + 45);
    setClusterHealth(99.9);

    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ☁️ TRAFFIC SWITCHED TO ${nextRegion}: Load Re-balanced! (+180 PTS)`, ...prev.slice(0, 3)]);
  }

  function autoScaleBurst() {
    setServers((prev) => prev.map((s) => ({ ...s, load: 25 })));
    setClusterHealth(100);
    setUptimeScore((s) => s + 750);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ⚡ AUTO-SCALE CLUSTER BURST: All 3 Regions Provisioned at 25% Load!`, ...prev.slice(0, 3)]);
  }

  return (
    <>
      <div className="arcade-hud-bar">
        <div className="hud-stat-box"><span className="hud-label">UPTIME SCORE</span><strong style={{ color: "#2bd9ff" }}>{uptimeScore} PTS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">PACKETS ROUTED</span><strong style={{ color: "#37e69c" }}>{packetsRouted} REQS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">SLA AVAILABILITY</span><strong style={{ color: "#2bd9ff" }}>{clusterHealth}% SLA</strong></div>
      </div>

      {activeMode === "arcade" ? (
        <div className="particle-canvas-wrapper" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="canvas-instruction-overlay" style={{ position: "relative", top: 0, left: 0, transform: "none" }}>
            <span>☁️ CLICK 'SWITCH LOAD BALANCER ROUTE' TO PREVENT SERVER OVERLOAD!</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", height: "280px", justifyContent: "center" }}>
            {servers.map((srv) => (
              <div key={srv.name} style={{ background: "rgba(8, 20, 36, 0.9)", padding: "14px 18px", borderRadius: "10px", border: `1px solid ${srv.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontFamily: "monospace", fontSize: "12px", color: "#ffffff" }}>
                  <span>{srv.name} {srv.name.startsWith(valveState) ? "⚡ [ACTIVE TRAFFIC ROUTE]" : ""}</span>
                  <strong style={{ color: srv.load > 80 ? "#ff405a" : srv.color }}>{srv.load}% CPU LOAD</strong>
                </div>

                {/* Progress bar */}
                <div style={{ width: "100%", height: "10px", background: "rgba(255,255,255,0.1)", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{ width: `${srv.load}%`, height: "100%", background: srv.load > 80 ? "#ff405a" : srv.color, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="canvas-ability-bar" style={{ position: "relative", inset: "auto" }}>
            <button type="button" className="ability-btn emp-btn" onClick={switchValve} style={{ borderColor: "#2bd9ff" }}>
              🔄 SWITCH LOAD BALANCER ROUTE ({valveState})
            </button>
            <button type="button" className="ability-btn repair-btn" onClick={autoScaleBurst}>
              ☁️ TRIGGER AUTO-SCALE CLUSTER BURST
            </button>
          </div>
        </div>
      ) : (
        <ConsoleTerminalArea logs={logs} color="#2bd9ff" />
      )}
    </>
  );
}


/* =========================================================
   GAME 5: BLOCKCHAIN - BLOCK MINER & HASH CONSTRUCTOR
========================================================= */
function BlockchainGame({ color, activeMode }: { color: string; activeMode: "arcade" | "terminal" }) {
  const [gasSaved, setGasSaved] = useState(0);
  const [blocksMined, setBlocksMined] = useState(0);
  const [vaultHp, setVaultHp] = useState(100);
  const [logs, setLogs] = useState<string[]>([
    "[SMART-CONTRACT] Cryptographic Block Mining Engine Active.",
    "[GOAL] Click 'MINE BLOCK' when the Nonce target reaches valid 0x00... hash solution!",
  ]);

  const [nonceHash, setNonceHash] = useState("0x7F9A...4B2C");
  const [isValidHash, setIsValidHash] = useState(false);

  // Hash ticker animation
  useEffect(() => {
    const timer = setInterval(() => {
      const isWinner = Math.random() > 0.6;
      setIsValidHash(isWinner);
      if (isWinner) {
        setNonceHash("0x0000...9F41 [VALID]");
      } else {
        const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
        setNonceHash(`0x${hex}...3A8E`);
      }
    }, 900);

    return () => clearInterval(timer);
  }, []);

  function mineBlock() {
    if (isValidHash) {
      setGasSaved((g) => g + 350);
      setBlocksMined((b) => b + 1);
      setVaultHp(100);
      const time = new Date().toLocaleTimeString();
      setLogs((prev) => [`[${time}] 🔗 BLOCK MINED! Cryptographic Nonce Hash Solved (+350 GAS SAVED)`, ...prev.slice(0, 3)]);
    } else {
      setVaultHp((h) => Math.max(0, h - 10));
      const time = new Date().toLocaleTimeString();
      setLogs((prev) => [`[${time}] ⚠️ INVALID NONCE HASH! Failed Block Proposal (-10% VAULT)`, ...prev.slice(0, 3)]);
    }
  }

  function zkProofShield() {
    setVaultHp(100);
    setGasSaved((g) => g + 1000);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] 🔒 ZERO-KNOWLEDGE PROOF SHIELD: Smart Contract Vault Sealed!`, ...prev.slice(0, 3)]);
  }

  return (
    <>
      <div className="arcade-hud-bar">
        <div className="hud-stat-box"><span className="hud-label">GAS SAVED</span><strong style={{ color: "#ff8b37" }}>{gasSaved} GWEI</strong></div>
        <div className="hud-stat-box"><span className="hud-label">BLOCKS MINED</span><strong style={{ color: "#37e69c" }}>{blocksMined} BLOCKS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">VAULT INTEGRITY</span><strong style={{ color: vaultHp > 40 ? "#37e69c" : "#ff405a" }}>{vaultHp}% SECURE</strong></div>
      </div>

      {activeMode === "arcade" ? (
        <div className="particle-canvas-wrapper" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="canvas-instruction-overlay" style={{ position: "relative", top: 0, left: 0, transform: "none" }}>
            <span>🔗 CLICK 'MINE CRYPTOGRAPHIC BLOCK' WHEN NONCE DISPLAYS GREEN VALID 0x0000 HASH!</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "280px", gap: "20px", background: "rgba(30, 16, 6, 0.9)", borderRadius: "12px", border: "1px solid rgba(255, 139, 55, 0.3)" }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)" }}>
              MEMPOOL TARGET NONCE SOLUTION
            </div>

            <div
              style={{
                fontFamily: "monospace",
                fontSize: "26px",
                fontWeight: "bold",
                color: isValidHash ? "#37e69c" : "#ff8b37",
                textShadow: isValidHash ? "0 0 20px #37e69c" : "0 0 10px #ff8b37",
                padding: "16px 30px",
                background: "rgba(0,0,0,0.5)",
                borderRadius: "10px",
                border: `2px solid ${isValidHash ? "#37e69c" : "#ff8b37"}`,
              }}
            >
              {nonceHash}
            </div>

            <button
              type="button"
              onClick={mineBlock}
              style={{
                padding: "14px 40px",
                background: isValidHash ? "#37e69c" : "#ff8b37",
                color: "#000000",
                fontFamily: "monospace",
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: isValidHash ? "0 0 25px #37e69c" : "0 0 15px #ff8b37",
                border: "none",
              }}
            >
              🔨 MINE BLOCK TO CHAIN
            </button>
          </div>

          <div className="canvas-ability-bar" style={{ position: "relative", inset: "auto" }}>
            <button type="button" className="ability-btn emp-btn" onClick={zkProofShield} style={{ borderColor: "#ff8b37" }}>
              🔒 ZERO-KNOWLEDGE PROOF SHIELD
            </button>
            <button type="button" className="ability-btn repair-btn" onClick={() => setVaultHp(100)}>
              🔑 RE-KEY CONTRACT VAULT (100%)
            </button>
          </div>
        </div>
      ) : (
        <ConsoleTerminalArea logs={logs} color="#ff8b37" />
      )}
    </>
  );
}


/* =========================================================
   GAME 6: FRONTIER RESEARCH - OPTICAL PRISM LASER REFRACTOR
========================================================= */
function ResearchGame({ color, activeMode }: { color: string; activeMode: "arcade" | "terminal" }) {
  const [discoveryScore, setDiscoveryScore] = useState(0);
  const [crystalsCharged, setCrystalsCharged] = useState(0);
  const [latticeStrength, setLatticeStrength] = useState(100);
  const [logs, setLogs] = useState<string[]>([
    "[QUANTUM-RESEARCH] Post-Quantum Laser Refractor Matrix Online.",
    "[GOAL] Click optical mirror prisms to rotate them and align the green laser into target research crystals!",
  ]);

  // 4 Optical Prisms with rotation angles (0, 90, 180, 270 deg)
  const [prisms, setPrisms] = useState([
    { id: 0, angle: 0, label: "PRISM α" },
    { id: 1, angle: 90, label: "PRISM β" },
    { id: 2, angle: 180, label: "PRISM γ" },
    { id: 3, angle: 270, label: "PRISM δ" },
  ]);

  function rotatePrism(index: number) {
    setPrisms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], angle: (updated[index].angle + 90) % 360 };
      return updated;
    });

    setDiscoveryScore((d) => d + 220);
    setCrystalsCharged((c) => c + 1);

    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] 🔬 OPTICAL PRISM #${index} ROTATED: Laser Refracted (+220 DISCOVERY PTS)`, ...prev.slice(0, 3)]);
  }

  function autoAlignMatrix() {
    setPrisms((prev) => prev.map((p) => ({ ...p, angle: 90 })));
    setDiscoveryScore((d) => d + 900);
    setLatticeStrength(100);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] 💠 LATTICE VECTOR RE-ENCRYPTION: Laser Refractor Perfectly Aligned!`, ...prev.slice(0, 3)]);
  }

  return (
    <>
      <div className="arcade-hud-bar">
        <div className="hud-stat-box"><span className="hud-label">DISCOVERY SCORE</span><strong style={{ color: "#37e69c" }}>{discoveryScore} PTS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">CRYSTALS CHARGED</span><strong style={{ color: "#2bd9ff" }}>{crystalsCharged} CRYSTALS</strong></div>
        <div className="hud-stat-box"><span className="hud-label">LATTICE STRENGTH</span><strong style={{ color: "#37e69c" }}>{latticeStrength}% STRENGTH</strong></div>
      </div>

      {activeMode === "arcade" ? (
        <div className="particle-canvas-wrapper" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="canvas-instruction-overlay" style={{ position: "relative", top: 0, left: 0, transform: "none" }}>
            <span>🔬 CLICK OPTICAL PRISMS TO ROTATE LASER BEAMS INTO TARGET RESEARCH CRYSTALS!</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", height: "280px", alignItems: "center" }}>
            {prisms.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => rotatePrism(idx)}
                style={{
                  height: "100px",
                  background: "rgba(6, 26, 18, 0.9)",
                  border: "2px solid #37e69c",
                  borderRadius: "12px",
                  color: "#37e69c",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 0 15px rgba(55, 230, 156, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ transform: `rotate(${p.angle}deg)`, fontSize: "24px", transition: "transform 0.3s ease" }}>
                  📐 ↗
                </div>
                <span>{p.label} [{p.angle}°]</span>
              </button>
            ))}
          </div>

          <div className="canvas-ability-bar" style={{ position: "relative", inset: "auto" }}>
            <button type="button" className="ability-btn emp-btn" onClick={autoAlignMatrix} style={{ borderColor: "#37e69c" }}>
              💠 LATTICE VECTOR RE-ENCRYPTION
            </button>
            <button type="button" className="ability-btn repair-btn" onClick={() => setLatticeStrength(100)}>
              🔬 RE-CRYSTALLIZE LATTICE (100%)
            </button>
          </div>
        </div>
      ) : (
        <ConsoleTerminalArea logs={logs} color="#37e69c" />
      )}
    </>
  );
}


/* =========================================================
   COMMON TELEMETRY TERMINAL AREA
========================================================= */
function ConsoleTerminalArea({ logs, color }: { logs: string[]; color: string }) {
  return (
    <div className="console-log-area">
      <div className="console-log-header">
        <span>REALTIME THREAT TELEMETRY FEED</span>
        <span className="console-ping" style={{ color }}>
          LIVE SYNC
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
  );
}
