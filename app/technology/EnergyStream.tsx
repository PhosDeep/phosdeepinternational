"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";

export interface EnergyStreamProps {
  colors?: string[];
  background?: string;
  particles?: number;
  shape?: { height?: number; waist?: number; flare?: number; twist?: number };
  lean?: number;
  size?: number;
  core?: { show?: boolean; diameter?: number; color?: string; spin?: number };
  glow?: number;
  repel?: number;
  flow?: number;
  spin?: number;
  className?: string;
  style?: CSSProperties;
}

const vertexShader = `
precision highp float;
uniform float uTime, uFlow, uSize, uMinY, uMaxY, uWaist, uFlare, uTwist, uSpin;
uniform vec2 uPointer;
uniform float uHover, uReach, uPush, uAspect;
uniform vec3 uColors[8];
uniform float uColorCount;
attribute vec3 aRandom;
varying float vAlpha;
varying vec3 vTint;
varying float vAngle;
varying float vOuter;
float radiusAtY(float y) { return uWaist * sqrt(1.0 + (y * y) / (uFlare * uFlare)); }
vec3 paletteAt(float t) {
  float count = max(1.0, uColorCount);
  float scaled = clamp(t, 0.0, 0.9999) * (count - 1.0);
  float lower = floor(scaled);
  int first = int(lower);
  int second = int(mod(lower + 1.0, count));
  vec3 a = uColors[0];
  vec3 b = uColors[0];
  for (int index = 0; index < 8; index++) {
    if (index == first) a = uColors[index];
    if (index == second) b = uColors[index];
  }
  return mix(a, b, scaled - lower);
}
void main() {
  float speed = 0.8 + 0.4 * aRandom.z;
  float progress = fract(aRandom.x + uTime * uFlow * speed);
  float y = mix(uMaxY, uMinY, progress);
  vOuter = smoothstep(0.68, 1.0, aRandom.z);
  float outerReach = mix(0.0, 0.72, pow(vOuter, 2.4));
  float radius = radiusAtY(y) * (0.88 + outerReach);
  float phi = 6.2831853 * aRandom.y + progress * 6.2831853 * uTwist + uSpin;
  vec3 position = vec3(radius * cos(phi), y, radius * sin(phi));
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vec4 clipPosition = projectionMatrix * viewPosition;
  float repel = 0.0;
  if (uHover > 0.001 && clipPosition.w > 0.0) {
    vec2 ndc = clipPosition.xy / clipPosition.w;
    vec2 away = vec2((ndc.x - uPointer.x) * uAspect, ndc.y - uPointer.y);
    float distanceToPointer = length(away);
    float falloff = 1.0 - smoothstep(0.0, uReach, distanceToPointer);
    repel = falloff * uHover;
    vec2 direction = distanceToPointer > 0.0001 ? away / distanceToPointer : vec2(1.0, 0.0);
    clipPosition.xy += vec2(direction.x / uAspect, direction.y) * repel * uPush * clipPosition.w;
  }
  gl_Position = clipPosition;
  gl_PointSize = uSize / max(0.0001, -viewPosition.z) * (1.0 + repel * 0.45);
  float neck = 1.0 - smoothstep(0.0, 0.28 * uMaxY, abs(y));
  float edge = smoothstep(0.0, 0.06, progress) * (1.0 - smoothstep(0.94, 1.0, progress));
  vAlpha = (0.2 + 0.65 * neck * edge + repel * 0.12) * (1.0 - vOuter * 0.72);
  vTint = paletteAt(1.0 - aRandom.z);
  vAngle = phi;
}`;

const fragmentShader = `
precision highp float;
varying float vAlpha;
varying vec3 vTint;
varying float vAngle;
varying float vOuter;
void main() {
  vec2 point = gl_PointCoord * 2.0 - 1.0;
  float sine = sin(vAngle);
  float cosine = cos(vAngle);
  point = vec2(point.x * cosine - point.y * sine, point.x * sine + point.y * cosine);
  point.y *= 0.13;
  float radius = dot(point, point);
  if (radius > 1.0) discard;
  float falloff = pow(1.0 - radius, 1.8);
  float hot = smoothstep(0.62, 1.0, vTint.r);
  gl_FragColor = vec4(vTint * (1.8 + hot * 1.7), min(1.0, vAlpha * (1.7 + hot * 0.9)) * falloff);
}`;

const coreGlowVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const coreGlowFragmentShader = `
precision highp float;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float radius = distance(vUv, vec2(0.5)) * 2.0;
  float voidMask = 1.0 - smoothstep(0.68, 0.82, radius);
  vec3 color = vec3(0.002, 0.001, 0.008);
  float alpha = voidMask * 0.98;
  if (radius > 1.0) discard;
  gl_FragColor = vec4(color, alpha);
}`;

const quadVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const bloomFragmentShader = `
precision highp float;
uniform sampler2D tDiffuse;
uniform vec2 uTexel;
uniform float uThreshold;
varying vec2 vUv;
void main() {
  vec3 color = texture2D(tDiffuse, vUv).rgb;
  float brightness = max(color.r, max(color.g, color.b));
  float mask = smoothstep(uThreshold, uThreshold + 0.28, brightness);
  vec3 sum = color * mask * 0.22;
  sum += texture2D(tDiffuse, vUv + uTexel * vec2(1.0, 0.0)).rgb * mask * 0.16;
  sum += texture2D(tDiffuse, vUv - uTexel * vec2(1.0, 0.0)).rgb * mask * 0.16;
  sum += texture2D(tDiffuse, vUv + uTexel * vec2(0.0, 1.0)).rgb * mask * 0.16;
  sum += texture2D(tDiffuse, vUv - uTexel * vec2(0.0, 1.0)).rgb * mask * 0.16;
  gl_FragColor = vec4(sum, 1.0);
}`;

const compositeFragmentShader = `
precision highp float;
uniform sampler2D tBase;
uniform sampler2D tBloom;
uniform float uStrength;
varying vec2 vUv;
void main() {
  vec4 base = texture2D(tBase, vUv);
  vec3 bloom = texture2D(tBloom, vUv).rgb * uStrength;
  gl_FragColor = vec4(base.rgb + bloom, base.a);
}`;

export default function EnergyStream({
  colors = ["#37E69C", "#2BD9FF"],
  background = "transparent",
  particles = 180000,
  shape = {},
  lean = 0,
  size = 5,
  core = { show: true, diameter: 1.8, color: "#FFF1A8", spin: 1 },
  glow = 1,
  repel = 4,
  flow = 1,
  spin = 1,
  className,
  style,
}: EnergyStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch (error) {
      console.error("[energy-stream] could not create a WebGL context:", error);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 200);
    const rig = new THREE.Group();
    scene.add(rig);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = glow;
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    container.appendChild(renderer.domElement);

    const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
    });
    const bloomTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    const quadScene = new THREE.Scene();
    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    quad.frustumCulled = false;
    quadScene.add(quad);
    const bloomMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uTexel: { value: new THREE.Vector2() },
        uThreshold: { value: 0.58 },
      },
      vertexShader: quadVertexShader,
      fragmentShader: bloomFragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    const compositeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tBase: { value: null },
        tBloom: { value: null },
        uStrength: { value: 1.55 },
      },
      vertexShader: quadVertexShader,
      fragmentShader: compositeFragmentShader,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const height = Math.max(1, shape.height ?? 10);
    const count = Math.max(1000, Math.round(particles));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const random = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      random[index * 3] = Math.random();
      random[index * 3 + 1] = Math.random();
      random[index * 3 + 2] = Math.random();
    }
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(random, 3));

    const color = new THREE.Color(core.color || colors[0] || "#00F5D4");
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }, uFlow: { value: 0.2 * flow }, uSize: { value: size * 2.4 },
        uMinY: { value: -height / 2 }, uMaxY: { value: height / 2 }, uWaist: { value: shape.waist ?? 2.2 },
        uFlare: { value: 12.5 / Math.max(0.3, shape.flare ?? 5) }, uTwist: { value: shape.twist ?? 0.5 }, uSpin: { value: 0 },
        uPointer: { value: new THREE.Vector2() }, uHover: { value: 0 }, uReach: { value: 0.08 + repel * 0.056 },
        uPush: { value: repel * 0.03 }, uAspect: { value: 1 },
        uColors: { value: Array.from({ length: 8 }, () => new THREE.Color(colors[0] || "#00E5FF")) },
        uColorCount: { value: Math.min(8, colors.length) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const stream = new THREE.Points(geometry, material);
    stream.frustumCulled = false;
    rig.add(stream);

    const coreMaterial = new THREE.PointsMaterial({ color, size: 0.06, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const coreMesh = new THREE.Points(new THREE.SphereGeometry(1.2, 32, 32), coreMaterial);
    coreMesh.visible = false;
    rig.add(coreMesh);

    const coreGlowMaterial = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(core.color || "#FFF1A8") } },
      vertexShader: coreGlowVertexShader,
      fragmentShader: coreGlowFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const coreGlow = new THREE.Sprite(coreGlowMaterial as unknown as THREE.SpriteMaterial);
    coreGlow.visible = core.show ?? true;
    coreGlow.renderOrder = 2;
    rig.add(coreGlow);

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const elementHeight = Math.max(1, container.clientHeight);
      renderer.setSize(width, elementHeight, false);
      camera.aspect = width / elementHeight;
      camera.updateProjectionMatrix();
      material.uniforms.uSize.value = size * 2.4 * (renderer.getPixelRatio() * elementHeight / 900);
      const pixelWidth = Math.max(1, Math.round(width * renderer.getPixelRatio()));
      const pixelHeight = Math.max(1, Math.round(elementHeight * renderer.getPixelRatio()));
      renderTarget.setSize(pixelWidth, pixelHeight);
      bloomTarget.setSize(Math.max(1, pixelWidth >> 1), Math.max(1, pixelHeight >> 1));
      bloomMaterial.uniforms.uTexel.value.set(1 / Math.max(1, pixelWidth >> 1), 1 / Math.max(1, pixelHeight >> 1));
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const pointer = new THREE.Vector2();
    let pointerInside = false;
    const updatePointer = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      pointer.set(
        ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1,
        1 - ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2
      );
      pointerInside = true;
    };
    const clearPointer = () => {
      pointerInside = false;
    };
    container.addEventListener("pointermove", updatePointer);
    container.addEventListener("pointerenter", updatePointer);
    container.addEventListener("pointerleave", clearPointer);

    let onScreen = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    intersectionObserver.observe(container);

    const cameraRadius = 3 + 25 * Math.pow(1 - Math.min(10, Math.max(0, 7)) / 10, 2);
    const elevation = 80 * Math.PI / 180;
    camera.position.set(0, cameraRadius * Math.sin(elevation), cameraRadius * Math.cos(elevation));
    camera.up.set(0, Math.cos(elevation), -Math.sin(elevation));
    camera.lookAt(0, 0, 0);
    rig.rotation.z = lean * Math.PI / 180;
    let elapsed = 0;
    let last = performance.now();
    let reducedMotion = false;
    try {
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}

    function render(now = performance.now()) {
      if (!onScreen) return;
      const delta = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!reducedMotion) elapsed += delta;
      material.uniforms.uTime.value = elapsed;
      for (let index = 0; index < Math.min(8, colors.length); index += 1) {
        material.uniforms.uColors.value[index].set(colors[index]);
      }
      material.uniforms.uPointer.value.copy(pointer);
      material.uniforms.uAspect.value = camera.aspect || 1;
      const targetHover = pointerInside ? 1 : 0;
      material.uniforms.uHover.value += (targetHover - material.uniforms.uHover.value) * (1 - Math.exp(-delta * 8));
      material.uniforms.uSpin.value = elapsed * 0.01 * spin;
      stream.rotation.y = material.uniforms.uSpin.value;
      coreMesh.rotation.y = elapsed * 0.06 * (core.spin ?? 2);
      coreMesh.scale.setScalar((core.diameter ?? 2.4) / 2.4);
      coreGlow.scale.setScalar((core.diameter ?? 1.8) / 1.8 * 1.7);
      coreGlowMaterial.uniforms.uColor.value.set(core.color || "#FFF1A8");
      renderer.setRenderTarget(renderTarget);
      renderer.clear(true, true, true);
      renderer.render(scene, camera);

      bloomMaterial.uniforms.tDiffuse.value = renderTarget.texture;
      quad.material = bloomMaterial;
      renderer.setRenderTarget(bloomTarget);
      renderer.clear(true, false, false);
      renderer.render(quadScene, quadCamera);

      compositeMaterial.uniforms.tBase.value = renderTarget.texture;
      compositeMaterial.uniforms.tBloom.value = bloomTarget.texture;
      quad.material = compositeMaterial;
      renderer.setRenderTarget(null);
      renderer.render(quadScene, quadCamera);
    }

    renderer.setAnimationLoop(render);
    if (reducedMotion) render(performance.now());

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener("pointermove", updatePointer);
      container.removeEventListener("pointerenter", updatePointer);
      container.removeEventListener("pointerleave", clearPointer);
      geometry.dispose();
      material.dispose();
      coreMesh.geometry.dispose();
      coreMaterial.dispose();
      coreGlow.geometry.dispose();
      coreGlowMaterial.dispose();
      renderTarget.dispose();
      bloomTarget.dispose();
      quad.geometry.dispose();
      bloomMaterial.dispose();
      compositeMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [colors, background, particles, shape, lean, size, core, glow, repel, flow, spin]);

  return <div ref={containerRef} className={className} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background, ...style }} />;
}
