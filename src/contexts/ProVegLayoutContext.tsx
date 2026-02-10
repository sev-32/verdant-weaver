import React, { createContext, useContext, useState, useCallback } from "react";
import { DEFAULT_TREE_PARAMS, type TreeParams } from "@/types/treeParams";
import { DEFAULT_ROCK_PARAMS, type RockParams } from "@/types/rockParams";

const MIN_DRAWER = 280;
const MAX_DRAWER = 480;
const DEFAULT_LEFT = 300;
const DEFAULT_RIGHT = 340;

export type StudioMode = "tree" | "rock";

export interface ViewportSettings {
  backgroundColor: string;
  ambientLightIntensity: number;
  ambientLightColor: string;
  enableShadows: boolean;
  mainLightIntensity: number;
  mainLightColor: string;
  mainLightPosition: [number, number, number];
  fillLightIntensity: number;
  fillLightColor: string;
  fillLightPosition: [number, number, number];
  hemiIntensity: number;
  hemiSkyColor: string;
  hemiGroundColor: string;
  exposure: number;
}

export const DEFAULT_VIEWPORT_SETTINGS: ViewportSettings = {
  backgroundColor: "#1a1a2e",
  ambientLightIntensity: 0.35,
  ambientLightColor: "#c8d6e5",
  enableShadows: true,
  mainLightIntensity: 0.8,
  mainLightColor: "#ffffff",
  mainLightPosition: [8, 12, 5],
  fillLightIntensity: 0.25,
  fillLightColor: "#6b8cce",
  fillLightPosition: [-4, 6, -3],
  hemiIntensity: 0.3,
  hemiSkyColor: "#c8d6e5",
  hemiGroundColor: "#1a1a2e",
  exposure: 1.0,
};

export type GroundLayerType = "simple" | "quick-grass";

interface ProVegLayoutState {
  studioMode: StudioMode;
  leftDrawerOpen: boolean;
  leftPanel: string;
  leftDrawerWidthPx: number;
  rightDrawerOpen: boolean;
  rightPanel: string;
  rightSubTab: string;
  rightDrawerWidthPx: number;
  bottomDockExpanded: boolean;
  bottomDockHeightPx: number;
  paused: boolean;
  showStats: boolean;
  treeParams: TreeParams;
  rockParams: RockParams;
  seed: number;
  isPlaying: boolean;
  groundLayer: GroundLayerType;
  viewportSettings: ViewportSettings;
}

interface ProVegLayoutContextValue extends ProVegLayoutState {
  setStudioMode: (mode: StudioMode) => void;
  setLeftDrawerOpen: (v: boolean) => void;
  openLeftPanel: (id: string) => void;
  setLeftDrawerWidthPx: (v: number) => void;
  setRightDrawerOpen: (v: boolean) => void;
  setRightPanel: (id: string) => void;
  setRightSubTab: (id: string) => void;
  openRightPanel: (id: string, subTab?: string) => void;
  setRightDrawerWidthPx: (v: number) => void;
  setBottomDockExpanded: (v: boolean) => void;
  togglePaused: () => void;
  setShowStats: (v: boolean) => void;
  setTreeParams: (partial: Partial<TreeParams>) => void;
  setTreeParam: (key: string, value: number | string | boolean) => void;
  setRockParams: (partial: Partial<RockParams>) => void;
  setRockParam: (key: string, value: number | string | boolean) => void;
  resetRockToDefaults: () => void;
  setSeed: (v: number) => void;
  setIsPlaying: (v: boolean) => void;
  setGroundLayer: (v: GroundLayerType) => void;
  setViewportSettings: (patch: Partial<ViewportSettings>) => void;
  resetToDefaults: () => void;
  minDrawerWidth: number;
  maxDrawerWidth: number;
}

const defaultState: ProVegLayoutState = {
  studioMode: "tree",
  leftDrawerOpen: false,
  leftPanel: "presets",
  leftDrawerWidthPx: DEFAULT_LEFT,
  rightDrawerOpen: true,
  rightPanel: "trunk",
  rightSubTab: "shape",
  rightDrawerWidthPx: DEFAULT_RIGHT,
  bottomDockExpanded: false,
  bottomDockHeightPx: 200,
  paused: false,
  showStats: false,
  treeParams: { ...DEFAULT_TREE_PARAMS },
  rockParams: { ...DEFAULT_ROCK_PARAMS },
  seed: 1337,
  isPlaying: true,
  groundLayer: "simple",
  viewportSettings: { ...DEFAULT_VIEWPORT_SETTINGS },
};

const ProVegLayoutContext = createContext<ProVegLayoutContextValue | null>(null);

export function ProVegLayoutProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProVegLayoutState>(defaultState);

  const setTreeParam = useCallback((key: string, value: number | string | boolean) => {
    setState((s) => ({ ...s, treeParams: { ...s.treeParams, [key]: value } }));
  }, []);

  const setTreeParams = useCallback((partial: Partial<TreeParams>) => {
    setState((s) => ({ ...s, treeParams: { ...s.treeParams, ...partial } }));
  }, []);

  const setRockParam = useCallback((key: string, value: number | string | boolean) => {
    setState((s) => ({ ...s, rockParams: { ...s.rockParams, [key]: value } }));
  }, []);

  const setRockParams = useCallback((partial: Partial<RockParams>) => {
    setState((s) => ({ ...s, rockParams: { ...s.rockParams, ...partial } }));
  }, []);

  const value: ProVegLayoutContextValue = {
    ...state,
    setTreeParam,
    setTreeParams,
    setRockParam,
    setRockParams,
    resetRockToDefaults: () => setState((s) => ({ ...s, rockParams: { ...DEFAULT_ROCK_PARAMS } })),
    setStudioMode: (mode) =>
      setState((s) => ({
        ...s,
        studioMode: mode,
        rightPanel: mode === "rock" ? "rock-shape" : "trunk",
        rightSubTab: "",
        leftPanel: "presets",
      })),
    setLeftDrawerOpen: (v) => setState((s) => ({ ...s, leftDrawerOpen: v })),
    openLeftPanel: (id) =>
      setState((s) => ({
        ...s,
        leftPanel: id,
        leftDrawerOpen: !(s.leftDrawerOpen && s.leftPanel === id),
      })),
    setLeftDrawerWidthPx: (v) =>
      setState((s) => ({ ...s, leftDrawerWidthPx: Math.max(MIN_DRAWER, Math.min(MAX_DRAWER, v)) })),
    setRightDrawerOpen: (v) => setState((s) => ({ ...s, rightDrawerOpen: v })),
    setRightPanel: (id) => setState((s) => ({ ...s, rightPanel: id, rightSubTab: "" })),
    setRightSubTab: (id) => setState((s) => ({ ...s, rightSubTab: id })),
    openRightPanel: (id, subTab) =>
      setState((s) => ({
        ...s,
        rightPanel: id,
        rightSubTab: subTab ?? "",
        rightDrawerOpen: !(s.rightDrawerOpen && s.rightPanel === id),
      })),
    setRightDrawerWidthPx: (v) =>
      setState((s) => ({ ...s, rightDrawerWidthPx: Math.max(MIN_DRAWER, Math.min(MAX_DRAWER, v)) })),
    setBottomDockExpanded: (v) => setState((s) => ({ ...s, bottomDockExpanded: v })),
    togglePaused: () => setState((s) => ({ ...s, paused: !s.paused })),
    setShowStats: (v) => setState((s) => ({ ...s, showStats: v })),
    setSeed: (v) => setState((s) => ({ ...s, seed: v })),
    setIsPlaying: (v) => setState((s) => ({ ...s, isPlaying: v })),
    setGroundLayer: (v) => setState((s) => ({ ...s, groundLayer: v })),
    setViewportSettings: (patch) =>
      setState((s) => ({ ...s, viewportSettings: { ...s.viewportSettings, ...patch } })),
    resetToDefaults: () => setState(defaultState),
    minDrawerWidth: MIN_DRAWER,
    maxDrawerWidth: MAX_DRAWER,
  };

  return (
    <ProVegLayoutContext.Provider value={value}>
      {children}
    </ProVegLayoutContext.Provider>
  );
}

export function useProVegLayout() {
  const ctx = useContext(ProVegLayoutContext);
  if (!ctx) throw new Error("useProVegLayout must be used within ProVegLayoutProvider");
  return ctx;
}
