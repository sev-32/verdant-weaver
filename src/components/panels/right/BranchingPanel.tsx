import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function BranchingPanel({ subTab }: { subTab: string }) {
  const { treeParams } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;

  if (subTab === "structure") return (
    <div className="space-y-3">
      <SliderRow label="Branch Count" value={get("branchCount", "vegetation.branching.mainBranchCount", 6)} min={1} max={20} step={1} keyPrimary="branchCount" keyAlt="vegetation.branching.mainBranchCount" format={(v) => v.toFixed(0)} />
      <SliderRow label="Branch Angle (°)" value={get("branchAngle", "vegetation.branching.angleMean_deg", 35)} min={5} max={80} step={1} keyPrimary="branchAngle" keyAlt="vegetation.branching.angleMean_deg" format={(v) => v.toFixed(0) + "°"} />
      <SliderRow label="Angle Variance (°)" value={get("branchAngleVar", "vegetation.branching.angleVariance_deg", 12)} min={0} max={30} step={1} keyPrimary="branchAngleVar" keyAlt="vegetation.branching.angleVariance_deg" format={(v) => v.toFixed(0) + "°"} />
      <SliderRow label="Max Order" value={get("maxOrder", "vegetation.branching.maxOrder", 5)} min={1} max={8} step={1} keyPrimary="maxOrder" keyAlt="vegetation.branching.maxOrder" format={(v) => v.toFixed(0)} />
      <SliderRow label="Length Ratio" value={get("branchLength", "vegetation.branching.lengthRatio", 0.55)} min={0.1} max={1} step={0.05} keyPrimary="branchLength" keyAlt="vegetation.branching.lengthRatio" />
      <SliderRow label="Length Decay" value={get("lengthDecay", "vegetation.branching.lengthDecay", 0.72)} min={0.3} max={1} step={0.02} keyPrimary="lengthDecay" keyAlt="vegetation.branching.lengthDecay" />
      <SliderRow label="Radius Decay" value={get("radiusDecay", "vegetation.branching.radiusDecay", 0.65)} min={0.3} max={1} step={0.02} keyPrimary="radiusDecay" keyAlt="vegetation.branching.radiusDecay" />
      <SliderRow label="Probability" value={get("branchProbability", "vegetation.branching.probability", 0.65)} min={0} max={1} step={0.05} keyPrimary="branchProbability" keyAlt="vegetation.branching.probability" />
      <SliderRow label="Apical Dominance" value={get("apicalDominance", "vegetation.branching.apicalDominance", 0.7)} min={0} max={1} step={0.05} keyPrimary="apicalDominance" keyAlt="vegetation.branching.apicalDominance" />
    </div>
  );
  if (subTab === "junction") return (
    <div className="space-y-3">
      <SliderRow label="Collar Strength" value={get("collarStrength", "vegetation.branching.collarStrength", 0.38)} min={0} max={1} step={0.05} keyPrimary="collarStrength" keyAlt="vegetation.branching.collarStrength" />
      <SliderRow label="Junction Metaball" value={get("junctionMetaballStrength", "vegetation.branching.junctionMetaballStrength", 0.55)} min={0} max={1} step={0.05} keyPrimary="junctionMetaballStrength" keyAlt="vegetation.branching.junctionMetaballStrength" />
      <SliderRow label="Union Blend" value={get("unionBlendStrength", "vegetation.branching.unionBlendStrength", 0.58)} min={0} max={1} step={0.05} keyPrimary="unionBlendStrength" keyAlt="vegetation.branching.unionBlendStrength" />
    </div>
  );
  if (subTab === "gesture") return (
    <div className="space-y-3">
      <SliderRow label="Knot Strength" value={get("branchKnotStrength", "vegetation.branching.gestureKnotStrength", 0.25)} min={0} max={1} step={0.05} keyPrimary="branchKnotStrength" keyAlt="vegetation.branching.gestureKnotStrength" />
      <SliderRow label="Ovality" value={get("branchOvality", "vegetation.branching.ovality", 0.05)} min={0} max={0.3} step={0.01} keyPrimary="branchOvality" keyAlt="vegetation.branching.ovality" />
    </div>
  );
  if (subTab === "damage") return (
    <div className="space-y-3">
      <SliderRow label="Break Probability" value={get("breakProbability", "vegetation.branching.breakProbability", 0)} min={0} max={1} step={0.05} keyPrimary="breakProbability" keyAlt="vegetation.branching.breakProbability" />
      <SliderRow label="Break Severity" value={get("breakSeverity", "vegetation.branching.breakSeverity", 0.5)} min={0} max={1} step={0.05} keyPrimary="breakSeverity" keyAlt="vegetation.branching.breakSeverity" />
    </div>
  );
  return null;
}
