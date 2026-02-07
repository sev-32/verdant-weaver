import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function LeavesPanel({ subTab }: { subTab: string }) {
  const { treeParams } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;

  if (subTab === "representation") return (
    <div className="space-y-3">
      <SliderRow label="Leaf Size (m)" value={get("leafSize", "vegetation.leaves.size_m", 0.08)} min={0.02} max={0.3} step={0.005} keyPrimary="leafSize" keyAlt="vegetation.leaves.size_m" />
      <SliderRow label="Cluster Size" value={get("leafClusterSize", "vegetation.leaves.clusterSize", 12)} min={3} max={30} step={1} keyPrimary="leafClusterSize" keyAlt="vegetation.leaves.clusterSize" format={(v) => v.toFixed(0)} />
      <SliderRow label="Density" value={get("leafDensity", "vegetation.leaves.cardsPerMeter", 8)} min={1} max={20} step={1} keyPrimary="leafDensity" keyAlt="vegetation.leaves.cardsPerMeter" format={(v) => v.toFixed(0)} />
    </div>
  );
  if (subTab === "petiole") return (
    <div className="space-y-3">
      <SliderRow label="Petiole Length" value={get("petioleLengthFactor", "vegetation.leaves.petioleLengthFactor", 0.35)} min={0} max={1} step={0.05} keyPrimary="petioleLengthFactor" keyAlt="vegetation.leaves.petioleLengthFactor" />
      <SliderRow label="Petiole Droop" value={get("petioleDroop", "vegetation.leaves.petioleDroop", 0.35)} min={0} max={1} step={0.05} keyPrimary="petioleDroop" keyAlt="vegetation.leaves.petioleDroop" />
    </div>
  );
  if (subTab === "color") return (
    <div className="space-y-3">
      <div className="space-y-1">
        <span className="text-[11px] text-muted-foreground">Leaf Color</span>
        <input type="color" value={(treeParams.leafColor ?? "#4a7c3f") as string} onChange={(e) => {}} className="w-full h-7 rounded border border-border bg-input cursor-pointer" />
      </div>
      <SliderRow label="Color Variation" value={get("leafColorVariation", "vegetation.leaves.colorVariation", 0.15)} min={0} max={0.5} step={0.01} keyPrimary="leafColorVariation" keyAlt="vegetation.leaves.colorVariation" />
    </div>
  );
  return null;
}
