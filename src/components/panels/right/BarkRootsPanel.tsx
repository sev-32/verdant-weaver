import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function BarkRootsPanel({ subTab }: { subTab: string }) {
  const { treeParams, setTreeParam } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;

  if (subTab === "bark") return (
    <div className="space-y-3">
      <SliderRow label="Bark Roughness" value={get("barkRoughness", "vegetation.trunk.barkRoughness", 0.75)} min={0} max={1} step={0.05} keyPrimary="barkRoughness" keyAlt="vegetation.trunk.barkRoughness" />
      <SliderRow label="Furrow Depth" value={get("barkFurrowDepth", "vegetation.trunk.barkFurrowDepth", 0.35)} min={0} max={1} step={0.05} keyPrimary="barkFurrowDepth" keyAlt="vegetation.trunk.barkFurrowDepth" />
      <SliderRow label="Furrow Frequency" value={get("barkFurrowFrequency", "vegetation.trunk.barkFurrowFrequency", 6)} min={1} max={15} step={0.5} keyPrimary="barkFurrowFrequency" keyAlt="vegetation.trunk.barkFurrowFrequency" />
      <SliderRow label="Color Variation" value={get("barkColorVariation", "vegetation.bark.colorVariation", 0.08)} min={0} max={0.3} step={0.01} keyPrimary="barkColorVariation" keyAlt="vegetation.bark.colorVariation" />
      <SliderRow label="Branch Bark Scale" value={get("branchBarkScale", "vegetation.bark.branchScale", 0.65)} min={0} max={2} step={0.05} keyPrimary="branchBarkScale" keyAlt="vegetation.bark.branchScale" />
      <div className="space-y-1">
        <span className="text-[11px] text-muted-foreground">Trunk Color</span>
        <input type="color" value={(treeParams.trunkColor ?? "#5d4037") as string} onChange={(e) => { setTreeParam("trunkColor", e.target.value); setTreeParam("vegetation.trunk.barkColor", e.target.value); }} className="w-full h-7 rounded border border-border bg-input cursor-pointer" />
      </div>
    </div>
  );
  if (subTab === "moss") return (
    <div className="space-y-3">
      <SliderRow label="Moss Coverage" value={get("barkMossBlend", "vegetation.trunk.barkMossBlend", 0)} min={0} max={1} step={0.05} keyPrimary="barkMossBlend" keyAlt="vegetation.trunk.barkMossBlend" />
      <div className="space-y-1">
        <span className="text-[11px] text-muted-foreground">Moss Color</span>
        <input type="color" value={(treeParams.barkMossColor ?? "#3a5a2a") as string} onChange={(e) => { setTreeParam("barkMossColor", e.target.value); setTreeParam("vegetation.trunk.barkMossColor", e.target.value); }} className="w-full h-7 rounded border border-border bg-input cursor-pointer" />
      </div>
      <SliderRow label="Lichen Coverage" value={get("barkLichenBlend", "vegetation.trunk.barkLichenBlend", 0)} min={0} max={1} step={0.05} keyPrimary="barkLichenBlend" keyAlt="vegetation.trunk.barkLichenBlend" />
      <SliderRow label="Wet Darkening" value={get("barkWetDarkening", "vegetation.bark.wetDarkening", 0)} min={0} max={1} step={0.05} keyPrimary="barkWetDarkening" keyAlt="vegetation.bark.wetDarkening" />
    </div>
  );
  if (subTab === "roots") return (
    <div className="space-y-3">
      <SliderRow label="Root Count" value={get("rootCount", "vegetation.roots.rootCount", 5)} min={0} max={15} step={1} keyPrimary="rootCount" keyAlt="vegetation.roots.rootCount" format={(v) => v.toFixed(0)} />
      <SliderRow label="Root Visibility" value={get("rootVisibility", "vegetation.roots.visibility", 0.4)} min={0} max={1} step={0.05} keyPrimary="rootVisibility" keyAlt="vegetation.roots.visibility" />
      <SliderRow label="Spread Radius" value={get("rootSpreadRadius", "vegetation.roots.spreadRadius", 2.0)} min={0.5} max={5} step={0.1} keyPrimary="rootSpreadRadius" keyAlt="vegetation.roots.spreadRadius" />
      <SliderRow label="Depth" value={get("rootDepth", "vegetation.roots.depth", 0.3)} min={0.05} max={1} step={0.05} keyPrimary="rootDepth" keyAlt="vegetation.roots.depth" />
      <SliderRow label="Taper" value={get("rootTaper", "vegetation.roots.taper", 0.7)} min={0.3} max={1} step={0.05} keyPrimary="rootTaper" keyAlt="vegetation.roots.taper" />
      <SliderRow label="Surface Undulation" value={get("rootSurfaceUndulation", "vegetation.roots.surfaceUndulation", 0.3)} min={0} max={1} step={0.05} keyPrimary="rootSurfaceUndulation" keyAlt="vegetation.roots.surfaceUndulation" />
      <SliderRow label="Secondary Roots" value={get("rootSecondaryCount", "vegetation.roots.secondaryRoots", 0)} min={0} max={4} step={1} keyPrimary="rootSecondaryCount" keyAlt="vegetation.roots.secondaryRoots" format={(v) => v.toFixed(0)} />
      <SliderRow label="Secondary Length" value={get("rootSecondaryLength", "vegetation.roots.secondaryLength", 0.4)} min={0.1} max={1} step={0.05} keyPrimary="rootSecondaryLength" keyAlt="vegetation.roots.secondaryLength" />
    </div>
  );
  return null;
}
