import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function CrownPanel({ subTab }: { subTab: string }) {
  const { treeParams, setTreeParam } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;

  if (subTab === "shape") return (
    <div className="space-y-3">
      <div className="space-y-1">
        <span className="text-[11px] text-muted-foreground">Crown Shape</span>
        <select
          value={(treeParams.crownShape ?? "SPHERE") as string}
          onChange={(e) => { setTreeParam("crownShape", e.target.value); setTreeParam("vegetation.crown.shape", e.target.value); }}
          className="w-full h-7 rounded border border-border bg-input text-[11px] px-2 cursor-pointer text-foreground"
        >
          <option value="SPHERE">Sphere</option>
          <option value="CONE">Conical</option>
          <option value="COLUMNAR">Columnar</option>
          <option value="UMBRELLA">Umbrella</option>
        </select>
      </div>
      <SliderRow label="Crown Radius" value={get("crownRadiusRatio", "vegetation.crown.crownRadiusRatio", 0.42)} min={0.1} max={1} step={0.05} keyPrimary="crownRadiusRatio" keyAlt="vegetation.crown.crownRadiusRatio" />
      <SliderRow label="Crown Height" value={get("crownHeightRatio", "vegetation.crown.heightRatio", 0.65)} min={0.2} max={1.5} step={0.05} keyPrimary="crownHeightRatio" keyAlt="vegetation.crown.heightRatio" />
      <SliderRow label="Asymmetry" value={get("crownAsymmetry", "vegetation.crown.asymmetry", 0.1)} min={0} max={0.5} step={0.02} keyPrimary="crownAsymmetry" keyAlt="vegetation.crown.asymmetry" />
      <SliderRow label="Flat Top" value={get("crownFlatTop", "vegetation.crown.flatTop", 0)} min={0} max={0.5} step={0.05} keyPrimary="crownFlatTop" keyAlt="vegetation.crown.flatTop" />
    </div>
  );
  if (subTab === "density") return (
    <div className="space-y-3">
      <SliderRow label="Density Falloff" value={get("crownDensityFalloff", "vegetation.crown.densityFalloff", 0.5)} min={0.1} max={3} step={0.1} keyPrimary="crownDensityFalloff" keyAlt="vegetation.crown.densityFalloff" />
      <SliderRow label="Openness" value={get("crownOpenness", "vegetation.crown.openness", 0.15)} min={0} max={0.8} step={0.05} keyPrimary="crownOpenness" keyAlt="vegetation.crown.openness" />
      <SliderRow label="Inner Void" value={get("crownInnerVoid", "vegetation.crown.innerVoidRadius", 0.3)} min={0} max={0.8} step={0.05} keyPrimary="crownInnerVoid" keyAlt="vegetation.crown.innerVoidRadius" />
      <SliderRow label="Canopy Sparseness" value={get("canopySparseness", "vegetation.health.sparseness", 0)} min={0} max={0.8} step={0.05} keyPrimary="canopySparseness" keyAlt="vegetation.health.sparseness" />
    </div>
  );
  if (subTab === "health") return (
    <div className="space-y-3">
      <SliderRow label="Health Vigor" value={get("healthVigor", "vegetation.health.vigor", 1.0)} min={0.2} max={1.5} step={0.05} keyPrimary="healthVigor" keyAlt="vegetation.health.vigor" />
      <SliderRow label="Stress" value={get("healthStress", "vegetation.health.stress", 0)} min={0} max={1} step={0.05} keyPrimary="healthStress" keyAlt="vegetation.health.stress" />
      <SliderRow label="Age" value={get("age01", "vegetation.instance.age01", 1.0)} min={0.1} max={1} step={0.05} keyPrimary="age01" keyAlt="vegetation.instance.age01" />
      <SliderRow label="Seasonal Phase" value={get("seasonalPhase", "vegetation.seasonal.phase", 0.5)} min={0} max={1} step={0.05} keyPrimary="seasonalPhase" keyAlt="vegetation.seasonal.phase" />
    </div>
  );
  return null;
}
