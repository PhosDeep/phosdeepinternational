"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";


/* =========================================================
   POINTER TRACKING
========================================================= */

function usePointerNDC() {
  const pointer = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointer.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      pointer.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener(
      "pointermove",
      handleMove
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handleMove
      );
    };
  }, []);

  return pointer;
}


/* =========================================================
   SCROLL TRACKING
========================================================= */

function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const doc =
        document.documentElement;

      const max =
        doc.scrollHeight -
        doc.clientHeight;

      progress.current =
        max > 0
          ? Math.min(
              Math.max(
                window.scrollY / max,
                0
              ),
              1
            )
          : 0;
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return progress;
}


/* =========================================================
   QUANTUM CORE
========================================================= */

function Core({
  pointer,
}: {
  pointer: React.MutableRefObject<{
    x: number;
    y: number;
  }>;
}) {
  const group =
    useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.rotation.y +=
      delta * 0.18 +
      pointer.current.x *
        delta *
        0.4;

    group.current.rotation.x =
      Math.sin(
        state.clock.elapsedTime *
          0.35
      ) *
        0.08 -
      pointer.current.y *
        0.18;
  });

  return (
    <group ref={group}>

      {/* Main Core */}

      <mesh>
        <icosahedronGeometry
          args={[1.35, 4]}
        />

        <meshStandardMaterial
          color="#111522"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>


      {/* Inner Blue Core */}

      <mesh scale={0.62}>
        <icosahedronGeometry
          args={[1.35, 3]}
        />

        <meshStandardMaterial
          color="#173b63"
          metalness={0.45}
          roughness={0.15}
          emissive="#075b9e"
          emissiveIntensity={1.5}
        />
      </mesh>


      {/* Energy Center */}

      <mesh scale={0.35}>
        <sphereGeometry
          args={[1, 32, 32]}
        />

        <meshBasicMaterial
          color="#38d9ff"
        />
      </mesh>


      {/* Cyan Wireframe */}

      <mesh scale={1.02}>
        <icosahedronGeometry
          args={[1.35, 3]}
        />

        <meshBasicMaterial
          color="#48d7ff"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>


      {/* Purple Wireframe */}

      <mesh scale={1.18}>
        <icosahedronGeometry
          args={[1.35, 2]}
        />

        <meshBasicMaterial
          color="#9b4dff"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

    </group>
  );
}


/* =========================================================
   ORBITS
========================================================= */

function Orbits({
  pointer,
}: {
  pointer: React.MutableRefObject<{
    x: number;
    y: number;
  }>;
}) {
  const group =
    useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.rotation.y +=
      delta * 0.08 +
      pointer.current.x *
        delta *
        0.15;

    group.current.rotation.x =
      Math.sin(
        state.clock.elapsedTime *
          0.2
      ) *
        0.08 +
      pointer.current.y *
        0.1;
  });

  return (
    <group ref={group}>

      {/* Cyan Orbit */}

      <mesh
        rotation={[
          Math.PI / 2,
          0.15,
          0,
        ]}
      >
        <torusGeometry
          args={[
            1.85,
            0.018,
            8,
            160,
          ]}
        />

        <meshBasicMaterial
          color="#45d9ff"
        />
      </mesh>


      {/* Purple Orbit */}

      <mesh
        rotation={[
          0.7,
          0.4,
          0.2,
        ]}
      >
        <torusGeometry
          args={[
            2.15,
            0.012,
            8,
            160,
          ]}
        />

        <meshBasicMaterial
          color="#9855ff"
        />
      </mesh>


      {/* Cyan Outer Orbit */}

      <mesh
        rotation={[
          -0.5,
          0.8,
          0.7,
        ]}
      >
        <torusGeometry
          args={[
            2.45,
            0.008,
            8,
            160,
          ]}
        />

        <meshBasicMaterial
          color="#66cfff"
          transparent
          opacity={0.55}
        />
      </mesh>


      {/* Purple Outer Orbit */}

      <mesh
        rotation={[
          1.2,
          -0.3,
          0.4,
        ]}
      >
        <torusGeometry
          args={[
            2.75,
            0.005,
            8,
            160,
          ]}
        />

        <meshBasicMaterial
          color="#9c66ff"
          transparent
          opacity={0.3}
        />
      </mesh>

    </group>
  );
}


/* =========================================================
   INTERACTIVE NETWORK FIELD
========================================================= */

function InteractiveField({
  pointer,
}: {
  pointer: React.MutableRefObject<{
    x: number;
    y: number;
  }>;
}) {
  const pointsRef =
    useRef<THREE.Points>(null);

  const { camera } =
    useThree();

  const basePositions =
    useMemo(() => {
      const result: THREE.Vector3[] =
        [];

      for (
        let ring = 0;
        ring < 5;
        ring++
      ) {
        const radius =
          1.9 + ring * 0.22;

        const count =
          18 + ring * 4;

        for (
          let i = 0;
          i < count;
          i++
        ) {
          const angle =
            (i / count) *
            Math.PI *
            2;

          result.push(
            new THREE.Vector3(
              Math.cos(angle) *
                radius,

              Math.sin(angle) *
                radius *
                0.7,

              Math.sin(
                angle * 2 +
                  ring
              ) * 0.35
            )
          );
        }
      }

      return result;
    }, []);


  const positionArray =
    useMemo(
      () =>
        new Float32Array(
          basePositions.length * 3
        ),
      [basePositions]
    );


  const velocitiesRef = useRef(
    basePositions.map(
      () => new THREE.Vector3()
    )
  );


  useEffect(() => {
    basePositions.forEach(
      (point, index) => {
        positionArray[
          index * 3
        ] = point.x;

        positionArray[
          index * 3 + 1
        ] = point.y;

        positionArray[
          index * 3 + 2
        ] = point.z;
      }
    );
  }, [
    basePositions,
    positionArray,
  ]);


  const raycaster =
    useMemo(
      () =>
        new THREE.Raycaster(),
      []
    );


  const plane =
    useMemo(
      () =>
        new THREE.Plane(
          new THREE.Vector3(
            0,
            0,
            1
          ),
          0
        ),
      []
    );


  const mouseWorld =
    useMemo(
      () =>
        new THREE.Vector3(),
      []
    );


  const ndc =
    useMemo(
      () =>
        new THREE.Vector2(),
      []
    );


  useFrame(() => {
    if (!pointsRef.current)
      return;

    ndc.set(
      pointer.current.x,
      pointer.current.y
    );

    raycaster.setFromCamera(
      ndc,
      camera
    );

    raycaster.ray.intersectPlane(
      plane,
      mouseWorld
    );

    const posAttr =
      pointsRef.current
        .geometry.attributes
        .position as THREE.BufferAttribute;


    for (
      let i = 0;
      i < basePositions.length;
      i++
    ) {
      const base =
        basePositions[i];

      const velocity =
        velocitiesRef.current[i];

      const px =
        posAttr.getX(i);

      const py =
        posAttr.getY(i);

      const pz =
        posAttr.getZ(i);


      const dx =
        px - mouseWorld.x;

      const dy =
        py - mouseWorld.y;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        ) || 0.0001;


      const repelRadius =
        1.15;


      if (
        distance <
        repelRadius
      ) {
        const force =
          (repelRadius -
            distance) /
          repelRadius;

        velocity.x +=
          (dx / distance) *
          force *
          0.03;

        velocity.y +=
          (dy / distance) *
          force *
          0.03;
      }


      /* Spring back */

      velocity.x +=
        (base.x - px) *
        0.012;

      velocity.y +=
        (base.y - py) *
        0.012;

      velocity.z +=
        (base.z - pz) *
        0.012;


      /* Damping */

      velocity.multiplyScalar(
        0.9
      );


      posAttr.setXYZ(
        i,
        px + velocity.x,
        py + velocity.y,
        pz + velocity.z
      );
    }

    posAttr.needsUpdate = true;
  });


  return (
    <points ref={pointsRef}>

      <bufferGeometry>

        <bufferAttribute
          attach="attributes-position"
          args={[positionArray, 3]}
          count={
            basePositions.length
          }
          array={positionArray}
          itemSize={3}
        />

      </bufferGeometry>


      <pointsMaterial
        color="#7cdbff"
        size={0.058}
        sizeAttenuation
        transparent
        opacity={0.9}
      />

    </points>
  );
}


/* =========================================================
   PARTICLES
========================================================= */

function Particles() {
  return (
    <Sparkles
      count={600}
      scale={[
        7,
        7,
        7,
      ]}
      size={1.8}
      speed={0.18}
      noise={1.2}
      color="#6fdcff"
    />
  );
}


/* =========================================================
   LIGHTING
========================================================= */

function Lights() {
  return (
    <>
      <ambientLight
        intensity={0.3}
      />

      <pointLight
        position={[
          4,
          3,
          5,
        ]}
        intensity={14}
        distance={12}
        color="#4bd8ff"
      />

      <pointLight
        position={[
          -4,
          -2,
          3,
        ]}
        intensity={10}
        distance={12}
        color="#8b4cff"
      />

      <pointLight
        position={[
          0,
          4,
          -4,
        ]}
        intensity={5}
        distance={10}
        color="#ffffff"
      />
    </>
  );
}


/* =========================================================
   CAMERA + SCROLL REVEAL
========================================================= */

function CameraRig({
  pointer,
  scroll,
}: {
  pointer: React.MutableRefObject<{
    x: number;
    y: number;
  }>;

  scroll: React.MutableRefObject<number>;
}) {
  useFrame(
    (
      state,
      delta
    ) => {

      /* ===================================================
         CAMERA MOVEMENT
      =================================================== */

      const ease =
        Math.min(
          delta * 2.2,
          1
        );


      const targetX =
        pointer.current.x *
        0.9;


      const targetY =
        pointer.current.y *
          0.55 +
        scroll.current *
          0.6;


      const targetZ =
        7 +
        scroll.current *
          5.5;


      state.camera.position.x +=
        (
          targetX -
          state.camera.position.x
        ) * ease;


      state.camera.position.y +=
        (
          targetY -
          state.camera.position.y
        ) * ease;


      state.camera.position.z +=
        (
          targetZ -
          state.camera.position.z
        ) * ease;


      state.camera.rotation.z +=
        (
          scroll.current *
            -0.12 -
          state.camera.rotation.z
        ) * ease;


      state.camera.lookAt(
        0,
        0,
        0
      );


      /* ===================================================
         75% → 90% SCROLL REVEAL
      =================================================== */

      /*
        Initial opacity:

        75%

        This means the quantum system is
        clearly visible immediately.
      */

      const startOpacity =
        0.75;


      /*
        Maximum opacity:

        90%
      */

      const endOpacity =
        0.90;


      /*
        The transition happens during
        the first 35% of page scrolling.
      */

      const revealProgress =
        THREE.MathUtils.clamp(
          scroll.current / 0.35,
          0,
          1
        );


      /*
        Smooth cinematic easing.
      */

      const smoothReveal =
        THREE.MathUtils.smoothstep(
          revealProgress,
          0,
          1
        );


      /*
        Calculate target opacity.
      */

      const targetOpacity =
        THREE.MathUtils.lerp(
          startOpacity,
          endOpacity,
          smoothReveal
        );


      /*
        Read current opacity.
      */

      const currentOpacity =
        parseFloat(
          state.gl.domElement.style
            .opacity ||
            String(
              startOpacity
            )
        );


      /*
        Smooth transition instead
        of instantly changing opacity.
      */

      const newOpacity =
        THREE.MathUtils.lerp(
          currentOpacity,
          targetOpacity,
          Math.min(
            delta * 4,
            1
          )
        );


      state.gl.domElement.style.opacity =
        String(
          newOpacity
        );
    }
  );


  return null;
}


/* =========================================================
   SCENE
========================================================= */

function Scene() {
  const pointer =
    usePointerNDC();

  const scroll =
    useScrollProgress();


  return (
    <>
      <CameraRig
        pointer={pointer}
        scroll={scroll}
      />

      <Lights />

      <Float
        speed={0.7}
        rotationIntensity={0.08}
        floatIntensity={0.25}
      >

        <Core
          pointer={pointer}
        />

        <Orbits
          pointer={pointer}
        />

        <InteractiveField
          pointer={pointer}
        />

      </Float>

      <Particles />
    </>
  );
}


/* =========================================================
   MAIN CANVAS
========================================================= */

export default function PhosdeepScene() {
  return (
    <Canvas
      camera={{
        position: [
          0,
          0,
          7,
        ],

        fov: 40,

        near: 0.1,

        far: 100,
      }}


      dpr={[
        1,
        1.5,
      ]}


      gl={{
        alpha: true,

        antialias: true,

        powerPreference:
          "high-performance",
      }}


      onCreated={({
        gl,
      }) => {

        /*
          Transparent WebGL canvas.
        */

        gl.setClearColor(
          new THREE.Color(
            "#000000"
          ),
          0
        );


        /*
          START AT 75%
        */

        gl.domElement.style.opacity =
          "0.75";
      }}


      style={{
        width: "100%",

        height: "100%",

        display: "block",

        background:
          "transparent",

        /*
          START AT 75%
        */

        opacity: 0.75,

        transition:
          "none",
      }}
    >

      <Scene />

    </Canvas>
  );
}