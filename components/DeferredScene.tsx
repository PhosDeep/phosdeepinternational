"use client";

import { useEffect, useState } from "react";

type SceneComponent = typeof import("./PhosdeepScene")["default"];

export default function DeferredScene() {
  const [Scene, setScene] = useState<SceneComponent | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadScene = () => {
      import("./PhosdeepScene").then(({ default: LoadedScene }) => {
        if (!cancelled) {
          setScene(() => LoadedScene);
        }
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(loadScene, { timeout: 1200 });

      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    timeoutId = setTimeout(loadScene, 350);

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return Scene ? <Scene /> : null;
}
