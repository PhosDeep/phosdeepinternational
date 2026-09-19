"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CyberDefenseGame.module.css";

type AttackId = "spam" | "brute" | "sql" | "phishing" | "ddos" | "mitm";
type Phase = "ready" | "aiming" | "flight" | "defense" | "resolved";
type Attack = { id: AttackId; name: string; icon: string; color: string; defense: string; device: string; lesson: string; failure: string; diagram: [string, string, string] };

const ATTACKS: Attack[] = [
  { id: "spam", name: "Spam Flood", icon: "///", color: "#ff4761", defense: "Rate limiter", device: "THROTTLE GATE", lesson: "Rate limits cap requests per identity or time window, so bursts cannot starve a service.", failure: "Without a request budget, repeated messages consume the service queue and delay real users.", diagram: ["BURST", "THROTTLE", "SERVICE"] },
  { id: "brute", name: "Brute Force", icon: "⌁", color: "#ff9a3d", defense: "Account lockout", device: "LOCKOUT BARRIER", lesson: "Lockout and progressive backoff stop endless password guessing after repeated failed attempts.", failure: "Unlimited guessing gives an attacker time to discover weak credentials.", diagram: ["FAIL × 3", "LOCK", "ACCOUNT"] },
  { id: "sql", name: "SQL Injection", icon: "'--", color: "#bd6cff", defense: "Parameterized queries", device: "SANITIZER FILTER", lesson: "Parameterized queries keep data separate from commands, so injected text cannot rewrite database logic.", failure: "Unsanitized input can become executable query text and expose or change records.", diagram: ["INPUT", "FILTER", "DATABASE"] },
  { id: "phishing", name: "Phishing Hook", icon: "@", color: "#49c6ff", defense: "Identity verification", device: "VERIFY SCANNER", lesson: "Sender verification and phishing-resistant MFA require a trusted identity, not just a convincing message.", failure: "A believable impersonation can trick people into handing over access or sensitive data.", diagram: ["SENDER", "VERIFY", "INBOX"] },
  { id: "ddos", name: "DDoS Volley", icon: "✦", color: "#ff59a9", defense: "Traffic load balancing", device: "SHIELD CLUSTER", lesson: "Load balancing and traffic scrubbing split legitimate demand while filtering abusive volume.", failure: "Unabsorbed volume overwhelms a single target until real users cannot connect.", diagram: ["VOLUME", "BALANCE", "NODES"] },
  { id: "mitm", name: "Man-in-the-Middle", icon: "↹", color: "#46e3b0", defense: "TLS validation", device: "TRUST RELAY", lesson: "TLS certificate validation authenticates the endpoint and catches an impostor attempting to relay a session.", failure: "A fake intermediary can read or change traffic if an endpoint accepts an untrusted certificate.", diagram: ["CLIENT", "TLS CHECK", "SERVER"] },
];
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function AttackArrow({ icon }: { icon: string }) {
  return <div className={styles.arrow} aria-hidden="true"><div className={styles.arrowAura} /><div className={styles.arrowTrail} /><div className={styles.arrowParticles}><i /><i /><i /><i /></div><div className={styles.arrowShaft}><span>{icon}</span></div><div className={styles.arrowHead} /><div className={styles.arrowFletching} /></div>;
}

function DefenseMachine({ attack, breach }: { attack: Attack; breach: boolean }) {
  return <div className={`${styles.machine} ${styles[`machine-${attack.id}`]} ${breach ? styles.machineFailed : ""}`} aria-label={`${attack.device}: ${attack.defense}`}>
    <div className={styles.machineHalo} />
    <div className={styles.machineBody}>
      {attack.id === "spam" && <><i /><i /><i /><b className={styles.gate}>|||</b></>}
      {attack.id === "brute" && <><b className={styles.lockCounter}>03</b><i className={styles.lockArm} /><i className={styles.lockArm} /></>}
      {attack.id === "sql" && <><b className={styles.filter}>⌬</b><i className={styles.filterLine} /><i className={styles.filterLine} /></>}
      {attack.id === "phishing" && <><b className={styles.verify}>✓</b><i className={styles.scanLine} /></>}
      {attack.id === "ddos" && <><b className={styles.node} /><b className={styles.node} /><b className={styles.node} /><b className={styles.node} /></>}
      {attack.id === "mitm" && <><b className={styles.tls}>TLS</b><i className={styles.relayLine} /><i className={styles.relayLine} /></>}
    </div>
    <strong>{attack.device}</strong><span>{attack.defense.toUpperCase()}</span>
  </div>;
}

export default function CyberDefenseGame({ color }: { color: string }) {
  const arena = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const advanceTimer = useRef<number | null>(null);
  const hasAssignedBreach = useRef(false);
  const [selected, setSelected] = useState<AttackId>("spam");
  const [phase, setPhase] = useState<Phase>("ready");
  const [aim, setAim] = useState(0);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [systemScore, setSystemScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [safeRuns, setSafeRuns] = useState(0);
  const [breachIn, setBreachIn] = useState(2);
  const [unlocked, setUnlocked] = useState<AttackId[]>(["spam", "brute", "sql", "phishing", "ddos"]);
  const attack = ATTACKS.find((item) => item.id === selected) ?? ATTACKS[0];
  const breach = safeRuns + 1 >= breachIn;
  const canFire = phase === "ready" || phase === "aiming";

  useEffect(() => () => { timers.current.forEach(window.clearTimeout); if (advanceTimer.current) window.clearTimeout(advanceTimer.current); }, []);
  function targetAim(x: number, y: number) { const element = arena.current; if (!element || !canFire) return; const rect = element.getBoundingClientRect(); setAim(clamp(Math.atan2(y - (rect.top + rect.height * .58), x - (rect.left + rect.width * .15)) * 180 / Math.PI, -17, 17)); setPhase("aiming"); }
  function fire() { if (!canFire) return; if (!hasAssignedBreach.current) { setBreachIn(Math.floor(Math.random() * 3) + 1); hasAssignedBreach.current = true; } timers.current.forEach(window.clearTimeout); setPhase("flight"); timers.current = [window.setTimeout(() => setPhase("defense"), 720), window.setTimeout(() => setPhase("resolved"), 1600)]; }
  function nextRound() { if (phase !== "resolved") return; if (breach) { setStreak(0); setSystemScore((value) => value + 100); setSafeRuns(0); setBreachIn(Math.floor(Math.random() * 3) + 1); } else { setStreak((value) => value + 1); setScore((value) => value + 100 + streak * 25); setSafeRuns((value) => value + 1); } if (round === 2) setUnlocked((value) => [...value, "mitm"]); setRound((value) => value + 1); setAim(0); setPhase("ready"); }
  useEffect(() => { if (phase !== "resolved") return; advanceTimer.current = window.setTimeout(nextRound, breach ? 4600 : 3600); return () => { if (advanceTimer.current) window.clearTimeout(advanceTimer.current); }; }, [phase, breach, round, streak]);

  return <section className={styles.game} style={{ "--accent": color, "--attack": attack.color } as React.CSSProperties}>
    <header className={styles.header}><div><span>PHOSDEEP SECURITY LAB</span><h2>VECTOR <i>vs.</i> VECTOR</h2></div><p>Choose an attack vector. Draw the shot. See the defense system respond.</p><div className={styles.mission}><span>LIVE EXERCISE</span><strong>RND {String(round).padStart(2, "0")}</strong></div></header>
    <div className={styles.hud}><div className={styles.userScore}><span>OPERATOR POINTS</span><strong>{score.toString().padStart(4, "0")}</strong></div><div className={styles.vsScore}><span>USER <i>VS</i> SYSTEM</span><strong><b>{score.toString().padStart(4, "0")}</b><i>:</i><em>{systemScore.toString().padStart(4, "0")}</em></strong></div><div><span>SYSTEM POINTS</span><strong>{systemScore.toString().padStart(4, "0")}</strong></div><div><span>DEFENSE STREAK</span><strong className={breach ? styles.alert : ""}>{streak}×</strong></div></div>
    <div className={styles.loadout}><span>VECTOR LOADOUT</span><div>{ATTACKS.map((item) => { const available = unlocked.includes(item.id); return <button type="button" key={item.id} disabled={!available || !canFire} onClick={() => available && setSelected(item.id)} className={selected === item.id ? styles.selected : ""} style={{ "--button": item.color } as React.CSSProperties}><i>{available ? item.icon : "×"}</i><b>{item.name}</b><small>{available ? "ARMED" : "LOCKED"}</small></button>; })}</div></div>
    <div ref={arena} className={`${styles.arena} ${styles[`attack-${attack.id}`]} ${styles[`phase-${phase}`]} ${breach ? styles.breach : ""}`} onPointerMove={(event) => { if (event.buttons) targetAim(event.clientX, event.clientY); }}>
      <div className={styles.stars} /><div className={styles.atmosphere} /><div className={styles.horizon} /><div className={styles.scanlines} /><div className={styles.arenaMeta}><span>ORIGIN / OFFENSE</span><span>TARGET / PROTECTED SYSTEM</span></div>
      <div className={styles.launcher}><div className={styles.launcherRing} /><div className={styles.launcherCore}><span>01</span></div><button type="button" aria-label="Drag to aim, then release to launch" className={styles.aimControl} style={{ transform: `rotate(${aim}deg)` }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); targetAim(event.clientX, event.clientY); }} onPointerMove={(event) => targetAim(event.clientX, event.clientY)} onPointerUp={(event) => { targetAim(event.clientX, event.clientY); fire(); }}><AttackArrow icon={attack.icon} /></button><strong>VECTOR LAUNCHER</strong><small>DRAG + RELEASE</small></div>
      <div className={styles.targetSystem}><div className={styles.systemOrbits}><i /><i /><i /></div><div className={styles.systemOrb}><span>SYS</span></div><div className={styles.systemExplosion}><i /><i /><i /></div><div className={styles.systemShards}><i /><i /><i /><i /><i /></div><div className={styles.systemGrid} /><strong>CORE SYSTEM</strong><small>PROTECTED TARGET</small></div>
      <DefenseMachine attack={attack} breach={breach} />
      <div className={styles.impact}><i /><i /><i /><span /></div>
      {phase === "defense" && <div className={styles.defenseText}>{breach ? "DEFENSE OVERLOADED" : `${attack.device} DEPLOYED`}</div>}
      {phase === "resolved" && <div className={`${styles.resultBurst} ${breach ? styles.resultFail : ""}`}><div className={styles.burstLines} /><strong>{breach ? "SYSTEM BREACHED" : "ATTACK NEUTRALIZED"}</strong><span>{breach ? "DEFENSE GAP DETECTED" : `+${100 + streak * 25} SECURITY POINTS`}</span></div>}
      {phase === "resolved" && breach && <article className={styles.breachModal} aria-live="polite"><div className={styles.lessonTag}>INCIDENT REPORT // WHY THIS MATTERS</div><div className={styles.lessonContent}><div><h3>A defense gap changed the outcome.</h3><p>{attack.failure}</p></div><div className={styles.diagram}>{attack.diagram.map((label, index) => <span key={label} className={index === 1 ? styles.diagramCenter : ""}>{label}</span>)}</div></div><footer><span>HARDENING SYSTEM · NEXT ROUND LOADING</span></footer></article>}
    </div>
    <div className={styles.controls}><div><span>ACTIVE VECTOR</span><strong style={{ color: attack.color }}>{attack.name.toUpperCase()}</strong></div><p>{breach ? "This round simulates an under-defended system. Observe the consequence." : "Drag the launcher to aim your projectile, then release to fire."}</p><button type="button" disabled={!canFire} onClick={fire}>{phase === "aiming" ? "RELEASE SHOT" : "LAUNCH VECTOR ↗"}</button></div>
    {phase === "resolved" && !breach && <article className={styles.lesson} aria-live="polite"><div className={styles.lessonTag}>KNOWLEDGE UNLOCKED // DEFENSE IN DEPTH</div><div className={styles.lessonContent}><div><h3>{attack.defense}</h3><p>{attack.lesson}</p></div><div className={styles.diagram}>{attack.diagram.map((label, index) => <span key={label} className={index === 1 ? styles.diagramCenter : ""}>{label}</span>)}</div></div><footer><span>CONCEPT SECURED · NEXT ROUND LOADING</span></footer></article>}
  </section>;
}
