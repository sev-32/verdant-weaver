import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function BarkRootsPanel({ subTab }: { subTab: string }) {
  const { treeParams } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;

  if (subTab === "bark") return (
    <div className="space-y-3">
      <SliderRow label="Bark Roughness" value={get("barkRoughness", "vegetation.trunk.barkRoughness", 0.75)} min={0} max={1} step={0.05} keyPrimary="barkRoughness" keyAlt="vegetation.trunk.barkRoughness" />
      <SliderRow label="Branch Bark Scale" value={get("branchBarkScale", "vegetation.bark.branchScale", 0.65)} min={0} max={2} step={0.05} keyPrimary="branchBarkScale" keyAlt="vegetation.bark.branchScale" />
      <div className="space-y-1">
        <span className="text-[11px] text-muted-foreground">Trunk Color</span>
        <input type="color" value={(treeParams.trunkColor ?? "#5d4037") as string} onChange={(e) => {}} className="w-full h-7 rounded border border-border bg-input cursor-pointer" />
      </div>
    </div>
  );
  if (subTab === "roots") return (
    <div className="space-y-3">
      <SliderRow label="Root Count" value={get("rootCount", "vegetation.roots.rootCount", 5)} min={0} max={12} step={1} keyPrimary="rootCount" keyAlt="vegetation.roots.rootCount" format={(v) => v.toFixed(0)} />
      <SliderRow label="Root Visibility" value={get("rootVisibility", "vegetation.roots.visibility", 0.4)} min={0} max={1} step={0.05} keyPrimary="rootVisibility" keyAlt="vegetation.roots.visibility" />
    </div>
  );
  return null;
}
