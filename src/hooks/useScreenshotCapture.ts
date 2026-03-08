import { useCallback, useRef } from "react";
import type { Screenshot } from "@/types/screenshot";
import type { StudioMode } from "@/contexts/ProVegLayoutContext";

// Global ref for the active 3D canvas - set by Tree3DPreview / Rock3DPreview
let activeRenderer: { domElement: HTMLCanvasElement; render: (scene: any, camera: any) => void } | null = null;
let activeScene: any = null;
let activeCamera: any = null;
let activeControls: any = null;

export function registerRenderer(renderer: any, scene: any, camera: any, controls: any) {
  activeRenderer = renderer;
  activeScene = scene;
  activeCamera = camera;
  activeControls = controls;
}

export function unregisterRenderer() {
  activeRenderer = null;
  activeScene = null;
  activeCamera = null;
  activeControls = null;
}

const FIXED_ANGLES: Record<string, [number, number, number]> = {
  "Front": [0, 0, 1],
  "Side": [1, 0, 0],
  "Back": [0, 0, -1],
  "3/4 View": [0.7, 0.4, 0.7],
  "Top": [0, 1, 0.01],
};

export function useScreenshotCapture() {
  const captureCurrentView = useCallback((
    label: string,
    studioMode: StudioMode,
    seed: number
  ): Screenshot | null => {
    if (!activeRenderer || !activeScene || !activeCamera) return null;

    // Force a render to ensure the canvas is up to date
    activeRenderer.render(activeScene, activeCamera);

    const dataUrl = activeRenderer.domElement.toDataURL("image/png");
    return {
      id: `ss_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      dataUrl,
      timestamp: Date.now(),
      label,
      cameraAngle: "Current View",
      studioMode,
      seed,
    };
  }, []);

  const captureFixedAngles = useCallback((
    studioMode: StudioMode,
    seed: number
  ): Screenshot[] => {
    if (!activeRenderer || !activeScene || !activeCamera || !activeControls) return [];

    const screenshots: Screenshot[] = [];
    const origPos = activeCamera.position.clone();
    const origTarget = activeControls.target.clone();
    const dist = origPos.distanceTo(origTarget);

    for (const [angleName, dir] of Object.entries(FIXED_ANGLES)) {
      // Position camera at fixed angle
      activeCamera.position.set(
        origTarget.x + dir[0] * dist,
        origTarget.y + dir[1] * dist,
        origTarget.z + dir[2] * dist
      );
      activeCamera.lookAt(origTarget);
      activeControls.update();
      activeRenderer.render(activeScene, activeCamera);

      const dataUrl = activeRenderer.domElement.toDataURL("image/png");
      screenshots.push({
        id: `ss_${Date.now()}_${Math.random().toString(36).slice(2, 6)}_${angleName}`,
        dataUrl,
        timestamp: Date.now(),
        label: `Auto: ${angleName}`,
        cameraAngle: angleName,
        studioMode,
        seed,
      });
    }

    // Restore original camera
    activeCamera.position.copy(origPos);
    activeControls.target.copy(origTarget);
    activeControls.update();
    activeRenderer.render(activeScene, activeCamera);

    return screenshots;
  }, []);

  return { captureCurrentView, captureFixedAngles };
}
