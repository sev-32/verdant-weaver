import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function SpaceColonizationPanel({ subTab }: { subTab: string }) {
  const { treeParams } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;

  if (subTab === "attractors") return (
    <div className="space-y-3">
      <SliderRow label="Attractor Count" value={get("attractorCount", "vegetation.branching.attractorCount", 220)} min={10} max={500} step={10} keyPrimary="attractorCount" keyAlt="vegetation.branching.attractorCount" format={(v) => v.toFixed(0)} />
      <SliderRow label="Max Iterations" value={get("maxIterations", "vegetation.branching.maxIterations", 18)} min={1} max={50} step={1} keyPrimary="maxIterations" keyAlt="vegetation.branching.maxIterations" format={(v) => v.toFixed(0)} />
    </div>
  );
  if (subTab === "crown") return (
    <div className="space-y-3">
      <SliderRow label="Crown Radius Ratio" value={get("crownRadiusRatio", "vegetation.crown.crownRadiusRatio", 0.42)} min={0.1} max={1} step={0.05} keyPrimary="crownRadiusRatio" keyAlt="vegetation.crown.crownRadiusRatio" />
    </div>
  );
  return null;
}
