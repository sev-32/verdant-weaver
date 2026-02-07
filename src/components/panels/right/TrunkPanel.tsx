import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function TrunkPanel({ subTab }: { subTab: string }) {
  const { treeParams } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;

  if (subTab === "shape") return (
    <div className="space-y-3">
      <SliderRow label="Height (m)" value={get("height", "vegetation.species.heightBase_m", 8)} min={2} max={30} step={0.5} keyPrimary="height" keyAlt="vegetation.species.heightBase_m" format={(v) => v.toFixed(1) + "m"} />
      <SliderRow label="Base Radius (m)" value={get("baseRadius", "vegetation.trunk.baseRadius_m", 0.4)} min={0.1} max={1.5} step={0.02} keyPrimary="baseRadius" keyAlt="vegetation.trunk.baseRadius_m" />
      <SliderRow label="Taper Exponent" value={get("taperExponent", "vegetation.trunk.taperExponent", 0.7)} min={0.2} max={2} step={0.05} keyPrimary="taperExponent" keyAlt="vegetation.trunk.taperExponent" />
      <SliderRow label="Base Flare" value={get("baseFlare", "vegetation.trunk.baseFlare", 1.3)} min={1} max={3} step={0.05} keyPrimary="baseFlare" keyAlt="vegetation.trunk.baseFlare" />
      <SliderRow label="Twist (°)" value={get("twist", "vegetation.trunk.twist_deg", 0)} min={-180} max={180} step={5} keyPrimary="twist" keyAlt="vegetation.trunk.twist_deg" format={(v) => v.toFixed(0) + "°"} />
    </div>
  );
  if (subTab === "gesture") return (
    <div className="space-y-3">
      <SliderRow label="Knot Count" value={get("trunkKnotCount", "vegetation.trunk.gestureKnotCount", 2)} min={0} max={6} step={1} keyPrimary="trunkKnotCount" keyAlt="vegetation.trunk.gestureKnotCount" format={(v) => v.toFixed(0)} />
      <SliderRow label="Knot Strength" value={get("trunkKnotStrength", "vegetation.trunk.gestureKnotStrength", 0.25)} min={0} max={1} step={0.05} keyPrimary="trunkKnotStrength" keyAlt="vegetation.trunk.gestureKnotStrength" />
      <SliderRow label="Knot Width" value={get("trunkKnotWidth", "vegetation.trunk.gestureKnotWidth", 0.12)} min={0.02} max={0.4} step={0.01} keyPrimary="trunkKnotWidth" keyAlt="vegetation.trunk.gestureKnotWidth" />
    </div>
  );
  if (subTab === "cross") return (
    <div className="space-y-3">
      <SliderRow label="Ovality" value={get("trunkOvality", "vegetation.trunk.ovality", 0.06)} min={0} max={0.5} step={0.01} keyPrimary="trunkOvality" keyAlt="vegetation.trunk.ovality" />
      <SliderRow label="Bark Roughness" value={get("barkRoughness", "vegetation.trunk.barkRoughness", 0.75)} min={0} max={1} step={0.05} keyPrimary="barkRoughness" keyAlt="vegetation.trunk.barkRoughness" />
    </div>
  );
  if (subTab === "buttress") return (
    <div className="space-y-3">
      <SliderRow label="Buttress Strength" value={get("buttressStrength", "vegetation.trunk.buttressStrength", 0)} min={0} max={2} step={0.05} keyPrimary="buttressStrength" keyAlt="vegetation.trunk.buttressStrength" />
      <SliderRow label="Buttress Count" value={get("buttressCount", "vegetation.trunk.buttressCount", 4)} min={2} max={8} step={1} keyPrimary="buttressCount" keyAlt="vegetation.trunk.buttressCount" format={(v) => v.toFixed(0)} />
    </div>
  );
  return null;
}
