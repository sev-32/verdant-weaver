import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function WindLODPanel({ subTab }: { subTab: string }) {
  const { treeParams } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;

  if (subTab === "wind") return (
    <div className="space-y-3">
      <SliderRow label="Wind Strength" value={get("windStrength", "vegetation.wind.gustStrength", 0.6)} min={0} max={2} step={0.05} keyPrimary="windStrength" keyAlt="vegetation.wind.gustStrength" />
      <SliderRow label="Trunk Bend" value={get("trunkBend", "vegetation.wind.trunkBend", 0.02)} min={0} max={0.1} step={0.005} keyPrimary="trunkBend" keyAlt="vegetation.wind.trunkBend" />
      <SliderRow label="Branch Bend" value={get("branchBend", "vegetation.wind.branchBend", 0.08)} min={0} max={0.5} step={0.01} keyPrimary="branchBend" keyAlt="vegetation.wind.branchBend" />
      <SliderRow label="Leaf Flutter" value={get("leafFlutter", "vegetation.wind.leafFlutter", 0.35)} min={0} max={1} step={0.05} keyPrimary="leafFlutter" keyAlt="vegetation.wind.leafFlutter" />
      <SliderRow label="Gust Frequency" value={get("windGustFrequency", "vegetation.wind.gustFrequency", 1.0)} min={0.1} max={3} step={0.1} keyPrimary="windGustFrequency" keyAlt="vegetation.wind.gustFrequency" />
      <SliderRow label="Turbulence" value={get("windTurbulence", "vegetation.wind.turbulence", 0.5)} min={0} max={1} step={0.05} keyPrimary="windTurbulence" keyAlt="vegetation.wind.turbulence" />
      <SliderRow label="Rest Lean" value={get("restLean", "vegetation.wind.restLean", 0.22)} min={0} max={1} step={0.05} keyPrimary="restLean" keyAlt="vegetation.wind.restLean" />
    </div>
  );
  if (subTab === "lod") return (
    <div className="space-y-3">
      <SliderRow label="LOD1 Octave Cap" value={get("octaveCapLod1", "vegetation.lod.octaveCap.lod1", 5)} min={1} max={8} step={1} keyPrimary="octaveCapLod1" keyAlt="vegetation.lod.octaveCap.lod1" format={(v) => v.toFixed(0)} />
      <SliderRow label="LOD2 Octave Cap" value={get("octaveCapLod2", "vegetation.lod.octaveCap.lod2", 3)} min={1} max={6} step={1} keyPrimary="octaveCapLod2" keyAlt="vegetation.lod.octaveCap.lod2" format={(v) => v.toFixed(0)} />
      <SliderRow label="LOD3 Octave Cap" value={get("octaveCapLod3", "vegetation.lod.octaveCap.lod3", 2)} min={1} max={4} step={1} keyPrimary="octaveCapLod3" keyAlt="vegetation.lod.octaveCap.lod3" format={(v) => v.toFixed(0)} />
    </div>
  );
  return null;
}
