/**
 * BREAK THE CHAIN — network renderer.
 *
 * A small imperative canvas engine, deliberately kept outside React: the
 * animation runs at frame rate and React only ever tells it which scene to
 * play. Nothing in here re-renders a component.
 *
 * World space is CSS pixels at zoom 1. The camera stores the world point that
 * sits at the centre of the viewport, so every projection is
 * `screen = (world - camera) * zoom + halfViewport`.
 *
 * Everything drawn is a thin geometric line, a diamond, or a two-pixel
 * particle. No text — labels are HTML so they stay crisp and selectable.
 */

const VIOLET = "168, 60, 255";
const LINE = "150, 110, 255";
const ORANGE = "255, 139, 55";
const WHITE = "245, 243, 250";

export type SceneMode =
  | "dormant"
  | "explore"
  | "inspect"
  | "rewind"
  | "origin"
  | "majority"
  | "original"
  | "rebuild"
  | "settled";

export type EngineScene = {
  mode: SceneMode;
  /** Node the camera is looking at, or -1. */
  focus: number;
  /** Sub-step inside a consensus simulation. */
  step: number;
};

export type NodeScreen = {
  x: number;
  y: number;
  /** On-screen radius of the diamond, in CSS pixels. */
  r: number;
  alpha: number;
};

type NodeState = {
  index: number;
  nx: number;
  ny: number;
  /** 0.55 … 1 — drives size, brightness and parallax response. */
  depth: number;
  phase: number;
  /** World position, recomputed on resize. */
  wx: number;
  wy: number;
  /** Cursor proximity, 0 … 1. */
  prox: number;
  /** How much this node is the current subject, 0 … 1. */
  focusAmt: number;
  /** How much this node reads as the anomaly, 0 … 1. */
  anomaly: number;
  /** Base brightness for the current scene, 0 … 1. */
  lum: number;
  /** Fork displacement, in world pixels. */
  driftX: number;
  driftY: number;
  traced: boolean;
};

type LinkState = {
  a: number;
  b: number;
  chain: boolean;
  /** 0 = whole, 1 = fully broken apart at the midpoint. */
  sever: number;
  /** Transient brightness from gossip and waves. */
  energy: number;
};

type Particle = {
  link: LinkState | null;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  t: number;
  speed: number;
  dir: 1 | -1;
  warm: boolean;
  size: number;
};

type Ripple = {
  x: number;
  y: number;
  r: number;
  max: number;
  alpha: number;
  warm: boolean;
};

export type EngineOptions = {
  reducedMotion: boolean;
  /** Called after each update so the consumer can reposition DOM overlays. */
  onFrame?: () => void;
};

export type NetworkEngine = {
  screen: NodeScreen[];
  start: () => void;
  stop: () => void;
  destroy: () => void;
  resize: () => void;
  setScene: (next: Partial<EngineScene>) => void;
  setPointer: (x: number, y: number, active: boolean) => void;
  setTraced: (indices: number[]) => void;
  setReducedMotion: (value: boolean) => void;
  ripple: (index: number, warm?: boolean) => void;
  /** Hovered node index, or -1. Read by the DOM overlay each frame. */
  hovered: number;
  /** True while the pointer is a fine pointer inside the field. */
  reticle: { x: number; y: number; active: boolean };
};

/** Desktop layout — an open field, not a row. */
const LAYOUT_WIDE: Array<[number, number, number]> = [
  [0.06, 0.52, 0.72],
  [0.17, 0.2, 0.95],
  [0.25, 0.78, 0.66],
  [0.37, 0.44, 1.0],
  [0.5, 0.7, 0.88],
  [0.58, 0.24, 0.74],
  [0.71, 0.56, 1.0],
  [0.83, 0.28, 0.8],
  [0.94, 0.66, 0.62],
];

/** Portrait layout — the chain descends the screen. */
const LAYOUT_TALL: Array<[number, number, number]> = [
  [0.24, 0.05, 0.7],
  [0.72, 0.15, 0.95],
  [0.3, 0.26, 0.8],
  [0.74, 0.37, 1.0],
  [0.36, 0.48, 0.9],
  [0.72, 0.59, 0.78],
  [0.27, 0.69, 1.0],
  [0.68, 0.8, 0.84],
  [0.35, 0.93, 0.66],
];

/** Non-sequential links, so the field reads as a network and not a queue. */
const MESH: Array<[number, number]> = [
  [0, 3],
  [1, 3],
  [2, 4],
  [3, 6],
  [1, 5],
  [4, 6],
  [5, 7],
  [6, 8],
];

const ALTERED = 4;
const AUTHORITY = 6;
const FORK_LEFT = [0, 1, 2, 3, 4];

const MAX_PARTICLES = 72;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Frame-rate independent approach, so motion feels identical at 60 and 144Hz. */
function approach(current: number, target: number, rate: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-rate * dt));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function createNetworkEngine(
  canvas: HTMLCanvasElement,
  options: EngineOptions
): NetworkEngine {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  let reducedMotion = options.reducedMotion;
  let running = false;
  let rafId = 0;
  let lastTime = 0;
  let time = 0;
  let stepTime = 0;

  let cssW = 1;
  let cssH = 1;
  let tall = false;

  const scene: EngineScene = { mode: "dormant", focus: -1, step: 0 };

  const nodes: NodeState[] = LAYOUT_WIDE.map(([nx, ny, depth], index) => ({
    index,
    nx,
    ny,
    depth,
    phase: index * 0.83,
    wx: 0,
    wy: 0,
    prox: 0,
    focusAmt: 0,
    anomaly: 0,
    lum: 0.5,
    driftX: 0,
    driftY: 0,
    traced: false,
  }));

  const links: LinkState[] = [];
  for (let i = 0; i < nodes.length - 1; i += 1) {
    links.push({ a: i, b: i + 1, chain: true, sever: 0, energy: 0 });
  }
  for (const [a, b] of MESH) {
    links.push({ a, b, chain: false, sever: 0, energy: 0 });
  }

  const particles: Particle[] = [];
  const ripples: Ripple[] = [];

  const screen: NodeScreen[] = nodes.map(() => ({ x: 0, y: 0, r: 0, alpha: 0 }));

  const camera = { x: 0, y: 0, z: 1, tx: 0, ty: 0, tz: 1 };
  const pointer = { x: 0, y: 0, wx: 0, wy: 0, active: false };
  const parallax = { x: 0, y: 0 };

  /** Progress of the re-hash front along the chain, 0 … 1. */
  let rebuildFront = 0;
  /** Horizontal position of the convergence sweep, in world pixels. */
  let sweepX = -1;

  const engine: NetworkEngine = {
    screen,
    hovered: -1,
    reticle: { x: 0, y: 0, active: false },
    start,
    stop,
    destroy,
    resize,
    setScene,
    setPointer,
    setTraced,
    setReducedMotion,
    ripple,
  };

  /* -------------------------------------------------------------
     Layout
  ------------------------------------------------------------- */

  function resize() {
    const rect = canvas.getBoundingClientRect();
    cssW = Math.max(1, rect.width);
    cssH = Math.max(1, rect.height);
    tall = cssW < 760;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    const layout = tall ? LAYOUT_TALL : LAYOUT_WIDE;
    const padX = tall ? cssW * 0.14 : cssW * 0.07;
    const padTop = tall ? cssH * 0.1 : cssH * 0.16;
    const padBottom = tall ? cssH * 0.1 : cssH * 0.18;
    const fieldW = cssW - padX * 2;
    const fieldH = cssH - padTop - padBottom;

    nodes.forEach((node, i) => {
      const [nx, ny, depth] = layout[i];
      node.nx = nx;
      node.ny = ny;
      node.depth = depth;
      node.wx = padX + nx * fieldW;
      node.wy = padTop + ny * fieldH;
    });

    camera.x = cssW / 2;
    camera.y = cssH / 2;
    applySceneCamera(true);
  }

  /* -------------------------------------------------------------
     Scene control
  ------------------------------------------------------------- */

  function setScene(next: Partial<EngineScene>) {
    const changed =
      (next.mode !== undefined && next.mode !== scene.mode) ||
      (next.step !== undefined && next.step !== scene.step);

    if (next.mode !== undefined) scene.mode = next.mode;
    if (next.focus !== undefined) scene.focus = next.focus;
    if (next.step !== undefined) scene.step = next.step;

    if (changed) {
      stepTime = 0;
      rebuildFront = 0;
      sweepX = -1;
      if (scene.mode === "majority" && scene.step === 3) sweepX = 0;
    }

    applySceneCamera(reducedMotion);
  }

  /** Camera target that puts `node` at a given fraction of the viewport. */
  function frameNode(index: number, fx: number, fy: number, zoom: number) {
    const node = nodes[index];
    if (!node) return;
    camera.tz = zoom;
    camera.tx = node.wx - (fx - 0.5) * (cssW / zoom);
    camera.ty = node.wy - (fy - 0.5) * (cssH / zoom);
  }

  function applySceneCamera(snap: boolean) {
    switch (scene.mode) {
      case "inspect": {
        if (scene.focus < 0) break;
        if (tall) frameNode(scene.focus, 0.5, 0.22, 1.5);
        else frameNode(scene.focus, 0.26, 0.5, 1.75);
        break;
      }
      case "rewind": {
        if (scene.focus < 0) break;
        frameNode(scene.focus, 0.5, tall ? 0.42 : 0.5, tall ? 1.35 : 1.55);
        break;
      }
      case "origin": {
        frameNode(ALTERED, 0.5, tall ? 0.38 : 0.44, tall ? 1.5 : 1.85);
        break;
      }
      case "settled": {
        camera.tx = cssW / 2;
        camera.ty = cssH / 2;
        camera.tz = 0.88;
        break;
      }
      default: {
        camera.tx = cssW / 2;
        camera.ty = cssH / 2;
        camera.tz = 1;
      }
    }

    if (snap) {
      camera.x = camera.tx;
      camera.y = camera.ty;
      camera.z = camera.tz;
    }
  }

  function setPointer(x: number, y: number, active: boolean) {
    pointer.x = x;
    pointer.y = y;
    pointer.active = active;
    engine.reticle.x = x;
    engine.reticle.y = y;
    engine.reticle.active = active;
  }

  function setTraced(indices: number[]) {
    const set = new Set(indices);
    nodes.forEach((node) => {
      node.traced = set.has(node.index);
    });
  }

  function setReducedMotion(value: boolean) {
    reducedMotion = value;
    if (value) {
      particles.length = 0;
      ripples.length = 0;
      applySceneCamera(true);
    }
  }

  function ripple(index: number, warm = false) {
    if (reducedMotion) return;
    const node = nodes[index];
    if (!node) return;
    ripples.push({
      x: node.wx + node.driftX,
      y: node.wy + node.driftY,
      r: 8,
      max: 150,
      alpha: 0.5,
      warm,
    });
  }

  /* -------------------------------------------------------------
     Per-scene targets
  ------------------------------------------------------------- */

  /** Brightness each node should settle at for the current scene. */
  function targetLum(node: NodeState) {
    const i = node.index;
    switch (scene.mode) {
      case "dormant":
        return 0.3;
      case "inspect":
        return i === scene.focus ? 1 : 0.14;
      case "rewind":
        return i === scene.focus ? 1 : i > scene.focus ? 0.4 : 0.12;
      case "origin":
        return i === ALTERED ? 1 : 0.16;
      case "majority":
        if (scene.step === 0) return 0.6;
        if (scene.step === 1) return i === ALTERED ? 0.9 : 0.85;
        if (scene.step === 2) return i === ALTERED ? 0.2 : 0.8;
        return 0.9;
      case "original":
        if (scene.step === 0) return i === AUTHORITY ? 0.95 : 0.3;
        if (scene.step === 1) return i === AUTHORITY ? 1 : 0.45;
        if (scene.step === 2) return i === AUTHORITY ? 0.55 : 0.4;
        return 0.6;
      case "rebuild": {
        if (scene.step === 0) {
          const front = rebuildFront * (nodes.length - 1);
          return i <= front ? 0.95 : 0.25;
        }
        if (scene.step === 1) return i === ALTERED ? 1 : i < ALTERED ? 0.7 : 0.2;
        if (scene.step === 2) return i === ALTERED ? 1 : 0.45;
        return 0.85;
      }
      case "settled":
        return 0.42;
      default:
        return 0.55;
    }
  }

  /** How strongly a node should read as the anomaly. */
  function targetAnomaly(node: NodeState) {
    if (node.index !== ALTERED) {
      // During the fork the authority node is the one under strain.
      if (scene.mode === "original" && scene.step >= 2 && node.index === AUTHORITY) {
        return 0.7;
      }
      return 0;
    }
    switch (scene.mode) {
      case "origin":
        return 1;
      case "majority":
        return scene.step === 1 ? 1 : scene.step === 2 ? 0.7 : 0;
      case "rebuild":
        return scene.step === 1 ? 1 : scene.step === 2 ? 0.5 : 0;
      case "rewind":
        return scene.focus === ALTERED ? 0.8 : 0;
      default:
        return 0;
    }
  }

  /** How broken each link should look. */
  function targetSever(link: LinkState) {
    switch (scene.mode) {
      case "majority": {
        const touchesAltered = link.a === ALTERED || link.b === ALTERED;
        if (scene.step === 2 && touchesAltered) return 1;
        return 0;
      }
      case "original": {
        if (scene.step === 1) return link.chain ? 0.75 : 0.9;
        if (scene.step === 2) return 0.55;
        if (scene.step === 3) {
          const aLeft = FORK_LEFT.includes(link.a);
          const bLeft = FORK_LEFT.includes(link.b);
          return aLeft === bLeft ? 0.25 : 1;
        }
        return 0;
      }
      case "rebuild": {
        if (scene.step <= 1) {
          // Everything past the divergence is unverified until it is rebuilt.
          return link.chain && link.a >= ALTERED ? 0.8 : 0;
        }
        if (scene.step === 2) return link.chain && link.a >= ALTERED ? 0.4 : 0;
        return 0;
      }
      case "rewind": {
        // The chain retracts behind the camera as history is wound back.
        if (!link.chain) return scene.focus >= 0 ? 0.6 : 0;
        return link.a >= scene.focus ? 0.9 : 0;
      }
      case "origin":
        return link.chain && link.a === ALTERED ? 1 : link.chain ? 0 : 0.5;
      case "inspect":
        return 0;
      default:
        return 0;
    }
  }

  function targetDrift(node: NodeState) {
    if (scene.mode === "original" && scene.step === 3) {
      const left = FORK_LEFT.includes(node.index);
      const amount = tall ? cssW * 0.06 : cssW * 0.05;
      return left
        ? { x: -amount, y: tall ? -cssH * 0.02 : -cssH * 0.03 }
        : { x: amount, y: tall ? cssH * 0.02 : cssH * 0.03 };
    }
    return { x: 0, y: 0 };
  }

  /* -------------------------------------------------------------
     Update
  ------------------------------------------------------------- */

  function spawnRate() {
    switch (scene.mode) {
      case "dormant":
        return 3;
      case "explore":
        return 7;
      case "inspect":
        return 4;
      case "rewind":
        return 16;
      case "origin":
        return 2;
      case "majority":
        return scene.step === 0 ? 26 : scene.step === 3 ? 14 : 6;
      case "original":
        return scene.step <= 1 ? 12 : 3;
      case "rebuild":
        return scene.step === 2 ? 20 : 8;
      case "settled":
        return 3;
      default:
        return 6;
    }
  }

  function spawnParticle() {
    if (particles.length >= MAX_PARTICLES) return;

    // Block 021 pulling itself back together from the shared history.
    if (scene.mode === "rebuild" && scene.step === 2) {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const target = nodes[ALTERED];
      if (source.index === ALTERED) return;
      particles.push({
        link: null,
        ax: source.wx + source.driftX,
        ay: source.wy + source.driftY,
        bx: target.wx + target.driftX,
        by: target.wy + target.driftY,
        t: 0,
        speed: 0.6 + Math.random() * 0.4,
        dir: 1,
        warm: Math.random() < 0.4,
        size: 1.4 + Math.random() * 1.2,
      });
      return;
    }

    const candidates = links.filter((link) => link.sever < 0.5);
    if (!candidates.length) return;

    const link = candidates[Math.floor(Math.random() * candidates.length)];
    const reverse = scene.mode === "rewind";

    particles.push({
      link,
      ax: 0,
      ay: 0,
      bx: 0,
      by: 0,
      t: reverse ? 1 : 0,
      speed: (link.chain ? 0.34 : 0.24) * (0.7 + Math.random() * 0.8) * (reverse ? 2.2 : 1),
      dir: reverse ? -1 : 1,
      warm: Math.random() < 0.12,
      size: 1.1 + Math.random() * 1.1,
    });
  }

  function update(dt: number) {
    if (!reducedMotion) {
      time += dt;
      stepTime += dt;
    }

    // Camera.
    camera.x = approach(camera.x, camera.tx, 3.2, dt);
    camera.y = approach(camera.y, camera.ty, 3.2, dt);
    camera.z = approach(camera.z, camera.tz, 3.4, dt);

    // Parallax follows the pointer, scaled per node by depth.
    const targetPx = pointer.active ? (pointer.x / cssW - 0.5) * 2 : 0;
    const targetPy = pointer.active ? (pointer.y / cssH - 0.5) * 2 : 0;
    parallax.x = approach(parallax.x, reducedMotion ? 0 : targetPx, 2.4, dt);
    parallax.y = approach(parallax.y, reducedMotion ? 0 : targetPy, 2.4, dt);

    // Pointer in world space, for proximity tests.
    pointer.wx = (pointer.x - cssW / 2) / camera.z + camera.x;
    pointer.wy = (pointer.y - cssH / 2) / camera.z + camera.y;

    if (scene.mode === "rebuild" && scene.step === 0) {
      rebuildFront = Math.min(1, stepTime / 2.4);
    } else if (scene.mode === "rebuild" && scene.step >= 1) {
      rebuildFront = ALTERED / (nodes.length - 1);
    }

    if (sweepX >= 0) {
      sweepX += (reducedMotion ? 0 : dt) * cssW * 0.9;
      if (sweepX > cssW * 1.2) sweepX = -1;
    }

    const interactive =
      scene.mode === "explore" || scene.mode === "dormant" || scene.mode === "settled";
    const proximityRadius = tall ? 110 : 165;

    let hovered = -1;
    let hoveredDistance = Infinity;

    nodes.forEach((node) => {
      const drift = targetDrift(node);
      node.driftX = approach(node.driftX, drift.x, reducedMotion ? 60 : 2.2, dt);
      node.driftY = approach(node.driftY, drift.y, reducedMotion ? 60 : 2.2, dt);

      let prox = 0;
      if (interactive && pointer.active) {
        const dx = pointer.wx - (node.wx + node.driftX);
        const dy = pointer.wy - (node.wy + node.driftY);
        const distance = Math.hypot(dx, dy);
        prox = Math.max(0, 1 - distance / proximityRadius);
        prox *= prox;
        if (distance < hoveredDistance && distance < proximityRadius * 0.5) {
          hoveredDistance = distance;
          hovered = node.index;
        }
      }

      node.prox = approach(node.prox, prox, 9, dt);
      node.lum = approach(node.lum, targetLum(node), 3.6, dt);
      node.anomaly = approach(node.anomaly, targetAnomaly(node), 4, dt);
      node.focusAmt = approach(
        node.focusAmt,
        scene.focus === node.index && scene.mode !== "explore" ? 1 : 0,
        4.5,
        dt
      );
    });

    engine.hovered = hovered;

    links.forEach((link) => {
      link.sever = approach(link.sever, targetSever(link), reducedMotion ? 60 : 2.8, dt);
      link.energy = approach(link.energy, 0, 2.2, dt);
    });

    // Gossip: during the majority poll every edge lights in turn.
    if (!reducedMotion && scene.mode === "majority" && scene.step === 0) {
      links.forEach((link, i) => {
        const wave = Math.sin(time * 2.4 - i * 0.55);
        if (wave > 0.94) link.energy = 1;
      });
    }

    // Re-hash front: chain links light as the recomputation passes through.
    if (scene.mode === "rebuild" && scene.step === 0) {
      const front = rebuildFront * (nodes.length - 1);
      links.forEach((link) => {
        if (!link.chain) return;
        const distance = Math.abs(front - link.a - 0.5);
        if (distance < 0.9) link.energy = Math.max(link.energy, 1 - distance);
      });
    }

    // Particles.
    if (!reducedMotion) {
      const expected = spawnRate() * dt;
      let spawns = Math.floor(expected);
      if (Math.random() < expected - spawns) spawns += 1;
      for (let i = 0; i < spawns; i += 1) spawnParticle();

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.t += particle.speed * particle.dir * dt;
        if (particle.t < -0.05 || particle.t > 1.05) {
          particles.splice(i, 1);
          continue;
        }
        if (particle.link && particle.link.sever > 0.6) {
          particles.splice(i, 1);
        }
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const r = ripples[i];
        r.r += dt * 210;
        r.alpha -= dt * 0.85;
        if (r.alpha <= 0 || r.r > r.max) ripples.splice(i, 1);
      }
    }

    // Publish screen positions for the DOM overlay.
    nodes.forEach((node, i) => {
      const { x, y } = project(node);
      const breath = reducedMotion ? 0 : Math.sin(time * 0.9 + node.phase) * 0.06;
      const radius =
        (tall ? 15 : 19) *
        (0.72 + node.depth * 0.34) *
        (1 + node.prox * 0.3 + node.focusAmt * 0.32 + breath) *
        camera.z;

      screen[i].x = x;
      screen[i].y = y;
      screen[i].r = radius;
      screen[i].alpha = node.lum;
    });
  }

  /* -------------------------------------------------------------
     Draw
  ------------------------------------------------------------- */

  function project(node: NodeState) {
    const depthShift = (node.depth - 0.8) * 26;
    const wx = node.wx + node.driftX + parallax.x * depthShift;
    const wy = node.wy + node.driftY + parallax.y * depthShift * 0.6;
    return {
      x: (wx - camera.x) * camera.z + cssW / 2,
      y: (wy - camera.y) * camera.z + cssH / 2,
      wx,
      wy,
    };
  }

  function projectWorld(wx: number, wy: number) {
    return {
      x: (wx - camera.x) * camera.z + cssW / 2,
      y: (wy - camera.y) * camera.z + cssH / 2,
    };
  }

  function drawLinks() {
    const c = ctx!;
    c.lineCap = "round";

    links.forEach((link) => {
      const a = project(nodes[link.a]);
      const b = project(nodes[link.b]);

      const lum = Math.max(nodes[link.a].lum, nodes[link.b].lum);
      const prox = Math.max(nodes[link.a].prox, nodes[link.b].prox);
      const base = link.chain ? 0.2 : 0.1;
      const alpha = (base + prox * 0.5 + link.energy * 0.55) * (0.25 + lum * 0.75);

      if (alpha <= 0.012) return;

      const gap = link.sever * 0.46;
      c.strokeStyle = `rgba(${link.energy > 0.35 ? ORANGE : LINE}, ${alpha.toFixed(3)})`;
      c.lineWidth = (link.chain ? 1.1 : 0.8) * (1 + prox * 0.6) * Math.min(camera.z, 1.6);

      if (gap < 0.01) {
        c.beginPath();
        c.moveTo(a.x, a.y);
        c.lineTo(b.x, b.y);
        c.stroke();
        return;
      }

      // A severed link retracts from the midpoint outwards.
      const mid = 0.5;
      const from = mid - gap;
      const to = mid + gap;
      c.beginPath();
      c.moveTo(a.x, a.y);
      c.lineTo(lerp(a.x, b.x, from), lerp(a.y, b.y, from));
      c.moveTo(lerp(a.x, b.x, to), lerp(a.y, b.y, to));
      c.lineTo(b.x, b.y);
      c.stroke();
    });
  }

  function drawParticles() {
    const c = ctx!;
    particles.forEach((particle) => {
      let ax = particle.ax;
      let ay = particle.ay;
      let bx = particle.bx;
      let by = particle.by;

      if (particle.link) {
        const a = project(nodes[particle.link.a]);
        const b = project(nodes[particle.link.b]);
        ax = a.x;
        ay = a.y;
        bx = b.x;
        by = b.y;
      } else {
        const a = projectWorld(particle.ax, particle.ay);
        const b = projectWorld(particle.bx, particle.by);
        ax = a.x;
        ay = a.y;
        bx = b.x;
        by = b.y;
      }

      const t = Math.min(1, Math.max(0, particle.t));
      const x = lerp(ax, bx, t);
      const y = lerp(ay, by, t);
      const fade = Math.sin(t * Math.PI);

      c.fillStyle = `rgba(${particle.warm ? ORANGE : WHITE}, ${(fade * 0.8).toFixed(3)})`;
      c.beginPath();
      c.arc(x, y, particle.size * Math.min(camera.z, 1.5), 0, Math.PI * 2);
      c.fill();
    });
  }

  function drawRipples() {
    const c = ctx!;
    ripples.forEach((r) => {
      const p = projectWorld(r.x, r.y);
      c.strokeStyle = `rgba(${r.warm ? ORANGE : VIOLET}, ${r.alpha.toFixed(3)})`;
      c.lineWidth = 1;
      c.beginPath();
      diamondPath(c, p.x, p.y, r.r * camera.z);
      c.stroke();
    });
  }

  function diamondPath(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
    c.moveTo(x, y - r);
    c.lineTo(x + r, y);
    c.lineTo(x, y + r);
    c.lineTo(x - r, y);
    c.closePath();
  }

  function drawNodes() {
    const c = ctx!;

    nodes.forEach((node, i) => {
      const { x, y, r, alpha } = screen[i];
      const heat = node.anomaly;
      const rgb = heat > 0.02 ? ORANGE : VIOLET;
      const intensity = alpha * (0.45 + node.prox * 0.55 + node.focusAmt * 0.5);

      // Atmosphere behind bright nodes only — glows are the expensive part.
      if (intensity > 0.38) {
        const glow = c.createRadialGradient(x, y, 0, x, y, r * 4.2);
        glow.addColorStop(0, `rgba(${rgb}, ${(intensity * 0.2).toFixed(3)})`);
        glow.addColorStop(1, `rgba(${rgb}, 0)`);
        c.fillStyle = glow;
        c.beginPath();
        c.arc(x, y, r * 4.2, 0, Math.PI * 2);
        c.fill();
      }

      // Outer diamond.
      c.strokeStyle = `rgba(${rgb}, ${(0.16 + intensity * 0.78).toFixed(3)})`;
      c.lineWidth = 1 + node.focusAmt * 0.8;
      c.beginPath();
      diamondPath(c, x, y, r);
      c.stroke();

      // Inner diamond.
      c.fillStyle = `rgba(${rgb}, ${(0.05 + intensity * 0.26).toFixed(3)})`;
      c.beginPath();
      diamondPath(c, x, y, r * 0.52);
      c.fill();

      // Core.
      c.fillStyle = `rgba(${WHITE}, ${(0.22 + intensity * 0.72).toFixed(3)})`;
      c.beginPath();
      c.arc(x, y, Math.max(1.1, r * 0.11), 0, Math.PI * 2);
      c.fill();

      // A cleared block keeps a small mark, so the search stays legible.
      if (node.traced) {
        c.strokeStyle = `rgba(${ORANGE}, ${(0.3 + alpha * 0.45).toFixed(3)})`;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(x - r * 0.28, y + r * 1.42);
        c.lineTo(x + r * 0.28, y + r * 1.42);
        c.stroke();
      }

      // Focus brackets.
      if (node.focusAmt > 0.02) {
        const spread = r * (1.65 + (1 - node.focusAmt) * 0.7);
        const tick = r * 0.34;
        c.strokeStyle = `rgba(${rgb}, ${(node.focusAmt * 0.65).toFixed(3)})`;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(x - spread, y - tick);
        c.lineTo(x - spread, y + tick);
        c.moveTo(x + spread, y - tick);
        c.lineTo(x + spread, y + tick);
        c.stroke();
      }
    });
  }

  function drawSweep() {
    if (sweepX < 0) return;
    const c = ctx!;
    const p = projectWorld(sweepX, 0);
    const gradient = c.createLinearGradient(p.x - 90, 0, p.x + 90, 0);
    gradient.addColorStop(0, `rgba(${VIOLET}, 0)`);
    gradient.addColorStop(0.5, `rgba(${VIOLET}, 0.14)`);
    gradient.addColorStop(1, `rgba(${VIOLET}, 0)`);
    c.fillStyle = gradient;
    c.fillRect(p.x - 90, 0, 180, cssH);
  }

  function drawReticle() {
    if (!engine.reticle.active || reducedMotion) return;
    const c = ctx!;
    const { x, y } = engine.reticle;
    const spin = time * 0.5;
    const r = 21;

    c.save();
    c.translate(x, y);
    c.rotate(spin);
    c.lineWidth = 1;

    // Four corner ticks of a diamond bracket; one runs warm.
    for (let i = 0; i < 4; i += 1) {
      const angle = (i * Math.PI) / 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      c.strokeStyle = `rgba(${i === 0 ? ORANGE : WHITE}, ${i === 0 ? 0.55 : 0.32})`;
      c.beginPath();
      c.moveTo(cos * r, sin * r);
      c.lineTo(cos * (r - 6) - sin * 5, sin * (r - 6) + cos * 5);
      c.moveTo(cos * r, sin * r);
      c.lineTo(cos * (r - 6) + sin * 5, sin * (r - 6) - cos * 5);
      c.stroke();
    }
    c.restore();

    // Slow scanning pulse.
    const pulse = (time % 2.6) / 2.6;
    if (pulse < 0.7) {
      const eased = easeInOut(pulse / 0.7);
      c.strokeStyle = `rgba(${VIOLET}, ${(0.26 * (1 - eased)).toFixed(3)})`;
      c.lineWidth = 1;
      c.beginPath();
      diamondPath(c, x, y, 16 + eased * 44);
      c.stroke();
    }

    c.fillStyle = `rgba(${WHITE}, 0.8)`;
    c.beginPath();
    c.arc(x, y, 1.6, 0, Math.PI * 2);
    c.fill();
  }

  function draw() {
    const c = ctx!;
    c.clearRect(0, 0, cssW, cssH);
    drawSweep();
    drawLinks();
    drawParticles();
    drawRipples();
    drawNodes();
    drawReticle();
  }

  /* -------------------------------------------------------------
     Loop
  ------------------------------------------------------------- */

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - lastTime) / 1000 || 0);
    lastTime = now;

    update(dt);
    draw();
    options.onFrame?.();

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function destroy() {
    stop();
    particles.length = 0;
    ripples.length = 0;
  }

  resize();
  return engine;
}
