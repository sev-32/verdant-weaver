import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function LeavesPanel({ subTab }: { subTab: string }) {
  const { treeParams, setTreeParam } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;

  if (subTab === "representation") return (
    <div className="space-y-3">
      <SliderRow label="Leaf Size (m)" value={get("leafSize", "vegetation.leaves.size_m", 0.08)} min={0.02} max={0.3} step={0.005} keyPrimary="leafSize" keyAlt="vegetation.leaves.size_m" />
      <SliderRow label="Size Variation" value={get("leafSizeVariation", "vegetation.leaves.sizeVariation", 0.3)} min={0} max={1} step={0.05} keyPrimary="leafSizeVariation" keyAlt="vegetation.leaves.sizeVariation" />
      <SliderRow label="Aspect Ratio" value={get("leafAspectRatio", "vegetation.leaves.aspectRatio", 1.5)} min={0.5} max={4} step={0.1} keyPrimary="leafAspectRatio" keyAlt="vegetation.leaves.aspectRatio" />
      <SliderRow label="Cluster Size" value={get("leafClusterSize", "vegetation.leaves.clusterSize", 12)} min={3} max={30} step={1} keyPrimary="leafClusterSize" keyAlt="vegetation.leaves.clusterSize" format={(v) => v.toFixed(0)} />
      <SliderRow label="Cluster Spread" value={get("leafClusterSpread", "vegetation.leaves.clusterSpread", 1.0)} min={0.3} max={3} step={0.1} keyPrimary="leafClusterSpread" keyAlt="vegetation.leaves.clusterSpread" />
      <SliderRow label="Density" value={get("leafDensity", "vegetation.leaves.cardsPerMeter", 8)} min={1} max={20} step={1} keyPrimary="leafDensity" keyAlt="vegetation.leaves.cardsPerMeter" format={(v) => v.toFixed(0)} />
    </div>
  );
  if (subTab === "orientation") return (
    <div className="space-y-3">
      <SliderRow label="Orientation Bias" value={get("leafOrientationBias", "vegetation.leaves.orientationBias", 0.5)} min={0} max={1} step={0.05} keyPrimary="leafOrientationBias" keyAlt="vegetation.leaves.orientationBias" />
      <SliderRow label="Sun Seeking" value={get("leafSunSeeking", "vegetation.leaves.sunSeeking", 0.3)} min={0} max={1} step={0.05} keyPrimary="leafSunSeeking" keyAlt="vegetation.leaves.sunSeeking" />
      <SliderRow label="Hang Angle (°)" value={get("leafHangAngle", "vegetation.leaves.hangAngle", 15)} min={0} max={90} step={5} keyPrimary="leafHangAngle" keyAlt="vegetation.leaves.hangAngle" format={(v) => v.toFixed(0) + "°"} />
      <SliderRow label="Curl" value={get("leafCurl", "vegetation.leaves.curl", 0.1)} min={0} max={1} step={0.05} keyPrimary="leafCurl" keyAlt="vegetation.leaves.curl" />
      <SliderRow label="Translucency" value={get("leafTranslucency", "vegetation.leaves.translucency", 0.3)} min={0} max={1} step={0.05} keyPrimary="leafTranslucency" keyAlt="vegetation.leaves.translucency" />
    </div>
  );
  if (subTab === "petiole") return (
    <div className="space-y-3">
      <SliderRow label="Petiole Length" value={get("petioleLengthFactor", "vegetation.leaves.petioleLengthFactor", 0.35)} min={0} max={1} step={0.05} keyPrimary="petioleLengthFactor" keyAlt="vegetation.leaves.petioleLengthFactor" />
      <SliderRow label="Petiole Droop" value={get("petioleDroop", "vegetation.leaves.petioleDroop", 0.35)} min={0} max={1} step={0.05} keyPrimary="petioleDroop" keyAlt="vegetation.leaves.petioleDroop" />
      <SliderRow label="Petiole Width" value={get("petioleWidthFactor", "vegetation.leaves.petioleWidthFactor", 0.07)} min={0.02} max={0.2} step={0.01} keyPrimary="petioleWidthFactor" keyAlt="vegetation.leaves.petioleWidthFactor" />
    </div>
  );
  if (subTab === "color") return (
    <div className="space-y-3">
      <div className="space-y-1">
        <span className="text-[11px] text-muted-foreground">Leaf Color</span>
        <input type="color" value={(treeParams.leafColor ?? "#4a7c3f") as string} onChange={(e) => { setTreeParam("leafColor", e.target.value); setTreeParam("vegetation.leaves.colorBase", e.target.value); }} className="w-full h-7 rounded border border-border bg-input cursor-pointer" />
      </div>
      <SliderRow label="Color Variation" value={get("leafColorVariation", "vegetation.leaves.colorVariation", 0.15)} min={0} max={0.5} step={0.01} keyPrimary="leafColorVariation" keyAlt="vegetation.leaves.colorVariation" />
      <SliderRow label="Underside Lighten" value={get("leafUndersideLighten", "vegetation.leaves.undersideLighten", 0.15)} min={0} max={0.5} step={0.02} keyPrimary="leafUndersideLighten" keyAlt="vegetation.leaves.undersideLighten" />
      <div className="space-y-1">
        <span className="text-[11px] text-muted-foreground">Autumn Color</span>
        <input type="color" value={(treeParams.leafAutumnColor ?? "#c4722a") as string} onChange={(e) => { setTreeParam("leafAutumnColor", e.target.value); setTreeParam("vegetation.leaves.colorAutumn", e.target.value); }} className="w-full h-7 rounded border border-border bg-input cursor-pointer" />
      </div>
      <SliderRow label="Seasonal Blend" value={get("leafSeasonalBlend", "vegetation.leaves.seasonalBlend", 0)} min={0} max={1} step={0.05} keyPrimary="leafSeasonalBlend" keyAlt="vegetation.leaves.seasonalBlend" />
      <SliderRow label="Dead Leaf Ratio" value={get("deadLeafRatio", "vegetation.leaves.deadLeafRatio", 0)} min={0} max={0.5} step={0.02} keyPrimary="deadLeafRatio" keyAlt="vegetation.leaves.deadLeafRatio" />
    </div>
  );
  return null;
}
