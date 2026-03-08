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
      <SliderRow label="First Branch Height" value={get("firstBranchHeight", "vegetation.branching.firstBranchHeight", 0.25)} min={0.05} max={0.7} step={0.05} keyPrimary="firstBranchHeight" keyAlt="vegetation.branching.firstBranchHeight" />
    </div>
  );
  if (subTab === "physics") return (
    <div className="space-y-3">
      <SliderRow label="Gravity Response" value={get("gravityResponse", "vegetation.branching.gravityResponse", 0.12)} min={0} max={1} step={0.02} keyPrimary="gravityResponse" keyAlt="vegetation.branching.gravityResponse" />
      <SliderRow label="Phototropism" value={get("phototropism", "vegetation.branching.phototropism", 0.15)} min={0} max={1} step={0.02} keyPrimary="phototropism" keyAlt="vegetation.branching.phototropism" />
      <SliderRow label="Branch Droop" value={get("branchDroop", "vegetation.branching.branchDroop", 0.08)} min={0} max={0.5} step={0.01} keyPrimary="branchDroop" keyAlt="vegetation.branching.branchDroop" />
      <SliderRow label="Droop Increase/Order" value={get("droopIncrease", "vegetation.branching.droopIncrease", 0.04)} min={0} max={0.2} step={0.005} keyPrimary="droopIncrease" keyAlt="vegetation.branching.droopIncrease" />
      <SliderRow label="Curvature" value={get("branchCurvature", "vegetation.branching.curvature", 0.15)} min={0} max={0.5} step={0.01} keyPrimary="branchCurvature" keyAlt="vegetation.branching.curvature" />
    </div>
  );
  if (subTab === "junction") return (
    <div className="space-y-3">
      <SliderRow label="Collar Strength" value={get("collarStrength", "vegetation.branching.collarStrength", 0.38)} min={0} max={1} step={0.05} keyPrimary="collarStrength" keyAlt="vegetation.branching.collarStrength" />
      <SliderRow label="Junction Metaball" value={get("junctionMetaballStrength", "vegetation.branching.junctionMetaballStrength", 0.55)} min={0} max={1} step={0.05} keyPrimary="junctionMetaballStrength" keyAlt="vegetation.branching.junctionMetaballStrength" />
      <SliderRow label="Union Blend" value={get("unionBlendStrength", "vegetation.branching.unionBlendStrength", 0.58)} min={0} max={1} step={0.05} keyPrimary="unionBlendStrength" keyAlt="vegetation.branching.unionBlendStrength" />
      <SliderRow label="Fork Probability" value={get("forkProbability", "vegetation.branching.forkProbability", 0.1)} min={0} max={0.5} step={0.02} keyPrimary="forkProbability" keyAlt="vegetation.branching.forkProbability" />
    </div>
  );
  if (subTab === "gesture") return (
    <div className="space-y-3">
      <SliderRow label="Knot Strength" value={get("branchKnotStrength", "vegetation.branching.gestureKnotStrength", 0.25)} min={0} max={1} step={0.05} keyPrimary="branchKnotStrength" keyAlt="vegetation.branching.gestureKnotStrength" />
      <SliderRow label="Ovality" value={get("branchOvality", "vegetation.branching.ovality", 0.05)} min={0} max={0.3} step={0.01} keyPrimary="branchOvality" keyAlt="vegetation.branching.ovality" />
      <SliderRow label="Epicormic Shoots" value={get("epicormicDensity", "vegetation.branching.epicormicDensity", 0)} min={0} max={1} step={0.05} keyPrimary="epicormicDensity" keyAlt="vegetation.branching.epicormicDensity" />
    </div>
  );
  if (subTab === "damage") return (
    <div className="space-y-3">
      <SliderRow label="Break Probability" value={get("breakProbability", "vegetation.branching.breakProbability", 0)} min={0} max={1} step={0.05} keyPrimary="breakProbability" keyAlt="vegetation.branching.breakProbability" />
      <SliderRow label="Break Severity" value={get("breakSeverity", "vegetation.branching.breakSeverity", 0.5)} min={0} max={1} step={0.05} keyPrimary="breakSeverity" keyAlt="vegetation.branching.breakSeverity" />
      <SliderRow label="Dead Branch Ratio" value={get("deadBranchRatio", "vegetation.health.deadBranches", 0)} min={0} max={0.5} step={0.02} keyPrimary="deadBranchRatio" keyAlt="vegetation.health.deadBranches" />
    </div>
  );
  return null;
}
