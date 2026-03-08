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
      <SliderRow label="Twig Bend" value={get("twigBend", "vegetation.wind.twigBend", 0.25)} min={0} max={1} step={0.05} keyPrimary="twigBend" keyAlt="vegetation.wind.twigBend" />
      <SliderRow label="Leaf Flutter" value={get("leafFlutter", "vegetation.wind.leafFlutter", 0.35)} min={0} max={1} step={0.05} keyPrimary="leafFlutter" keyAlt="vegetation.wind.leafFlutter" />
      <SliderRow label="Gust Frequency" value={get("windGustFrequency", "vegetation.wind.gustFrequency", 1.0)} min={0.1} max={3} step={0.1} keyPrimary="windGustFrequency" keyAlt="vegetation.wind.gustFrequency" />
      <SliderRow label="Gust Variance" value={get("windGustVariance", "vegetation.wind.gustVariance", 0.7)} min={0} max={1} step={0.05} keyPrimary="windGustVariance" keyAlt="vegetation.wind.gustVariance" />
      <SliderRow label="Turbulence" value={get("windTurbulence", "vegetation.wind.turbulence", 0.5)} min={0} max={1} step={0.05} keyPrimary="windTurbulence" keyAlt="vegetation.wind.turbulence" />
      <SliderRow label="Rest Lean" value={get("restLean", "vegetation.wind.restLean", 0.22)} min={0} max={1} step={0.05} keyPrimary="restLean" keyAlt="vegetation.wind.restLean" />
      <SliderRow label="Direction (°)" value={get("windDirection", "vegetation.wind.direction_deg", 0)} min={0} max={360} step={15} keyPrimary="windDirection" keyAlt="vegetation.wind.direction_deg" format={(v) => v.toFixed(0) + "°"} />
    </div>
  );
  if (subTab === "advanced") return (
    <div className="space-y-3">
      <SliderRow label="Canopy Shear" value={get("canopyShear", "vegetation.wind.canopyShear", 0.12)} min={0} max={0.5} step={0.01} keyPrimary="canopyShear" keyAlt="vegetation.wind.canopyShear" />
      <SliderRow label="Hierarchy Bias" value={get("windHierarchyBias", "vegetation.wind.hierarchyBias", 0.75)} min={0} max={1} step={0.05} keyPrimary="windHierarchyBias" keyAlt="vegetation.wind.hierarchyBias" />
      <SliderRow label="Motion Inertia" value={get("windMotionInertia", "vegetation.wind.motionInertia", 0.95)} min={0.5} max={1} step={0.01} keyPrimary="windMotionInertia" keyAlt="vegetation.wind.motionInertia" />
      <SliderRow label="Spring Response" value={get("windSpringResponse", "vegetation.wind.springResponse", 1.0)} min={0.1} max={3} step={0.1} keyPrimary="windSpringResponse" keyAlt="vegetation.wind.springResponse" />
      <SliderRow label="Parent Coupling" value={get("windParentCoupling", "vegetation.wind.parentCoupling", 0.78)} min={0} max={1} step={0.05} keyPrimary="windParentCoupling" keyAlt="vegetation.wind.parentCoupling" />
      <SliderRow label="Branch Torsion" value={get("windBranchTorsion", "vegetation.wind.branchTorsion", 0.32)} min={0} max={1} step={0.05} keyPrimary="windBranchTorsion" keyAlt="vegetation.wind.branchTorsion" />
      <SliderRow label="Vortex Strength" value={get("windVortexStrength", "vegetation.wind.vortexStrength", 0.55)} min={0} max={1} step={0.05} keyPrimary="windVortexStrength" keyAlt="vegetation.wind.vortexStrength" />
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
