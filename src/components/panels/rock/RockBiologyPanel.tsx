import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockBiologyPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const fungusTypes = ["bracket", "crust", "cup", "jelly", "coral"];
  const vineTypes = ["ivy", "creeper", "tendril", "root", "aerial-root", "liana"];
  const coralTypes = ["encrusting", "branching", "brain", "fan"];

  return (
    <div className="space-y-3">
      {/* Fungus */}
      <div className="editor-section">
        <div className="editor-section-title">Fungus / Mushrooms</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {fungusTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("fungusType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.fungusType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <SliderRow label="Strength" value={rockParams.fungusStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:fungusStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.fungusColor as string} onChange={(e) => setRockParam("fungusColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Size" value={rockParams.fungusSize as number} min={0.05} max={1} step={0.01} keyPrimary="rock:fungusSize" />
        <SliderRow label="Density" value={rockParams.fungusDensity as number} min={0} max={1} step={0.01} keyPrimary="rock:fungusDensity" />
        <SliderRow label="Prefer Dead Wood" value={rockParams.fungusPreferDead as number} min={0} max={1} step={0.01} keyPrimary="rock:fungusPreferDead" />
        <SliderRow label="Prefer Shade" value={rockParams.fungusPreferShade as number} min={0} max={1} step={0.01} keyPrimary="rock:fungusPreferShade" />
        <SliderRow label="Mycelium" value={rockParams.fungusMycelium as number} min={0} max={1} step={0.01} keyPrimary="rock:fungusMycelium" />
        <SliderRow label="Bioluminescence" value={rockParams.fungusGlow as number} min={0} max={1} step={0.01} keyPrimary="rock:fungusGlow" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Glow Color</span>
          <input type="color" value={rockParams.fungusGlowColor as string} onChange={(e) => setRockParam("fungusGlowColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      {/* Vines & Ivy */}
      <div className="editor-section">
        <div className="editor-section-title">Vines / Ivy / Roots</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {vineTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("vineType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.vineType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <SliderRow label="Strength" value={rockParams.vineStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:vineStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Vine</span>
          <input type="color" value={rockParams.vineColor as string} onChange={(e) => setRockParam("vineColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Leaf</span>
          <input type="color" value={rockParams.vineLeafColor as string} onChange={(e) => setRockParam("vineLeafColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Density" value={rockParams.vineDensity as number} min={0} max={1} step={0.01} keyPrimary="rock:vineDensity" />
        <SliderRow label="Thickness" value={rockParams.vineThickness as number} min={0.02} max={0.5} step={0.01} keyPrimary="rock:vineThickness" />
        <SliderRow label="Branching" value={rockParams.vineBranching as number} min={0} max={1} step={0.01} keyPrimary="rock:vineBranching" />
        <SliderRow label="Leaf Density" value={rockParams.vineLeafDensity as number} min={0} max={1} step={0.01} keyPrimary="rock:vineLeafDensity" />
        <SliderRow label="Leaf Size" value={rockParams.vineLeafSize as number} min={0.1} max={1} step={0.01} keyPrimary="rock:vineLeafSize" />
        <SliderRow label="Growth Dir (↓→↑)" value={rockParams.vineGrowthDirection as number} min={0} max={1} step={0.01} keyPrimary="rock:vineGrowthDirection" />
        <SliderRow label="Age" value={rockParams.vineAge as number} min={0} max={1} step={0.01} keyPrimary="rock:vineAge" />
        <SliderRow label="Dead Sections" value={rockParams.vineDead as number} min={0} max={1} step={0.01} keyPrimary="rock:vineDead" />
        <SliderRow label="Root Exposure" value={rockParams.vineRootExposure as number} min={0} max={1} step={0.01} keyPrimary="rock:vineRootExposure" />
        <SliderRow label="Flowers" value={rockParams.vineFlowers as number} min={0} max={1} step={0.01} keyPrimary="rock:vineFlowers" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Flower</span>
          <input type="color" value={rockParams.vineFlowerColor as string} onChange={(e) => setRockParam("vineFlowerColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Berry</span>
          <input type="color" value={rockParams.vineBerryColor as string} onChange={(e) => setRockParam("vineBerryColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Berries" value={rockParams.vineBerries as number} min={0} max={1} step={0.01} keyPrimary="rock:vineBerries" />
      </div>

      {/* Marine */}
      <div className="editor-section">
        <div className="editor-section-title">Marine Life</div>
        <SliderRow label="Barnacles" value={rockParams.barnacleStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:barnacleStrength" />
        <SliderRow label="Barnacle Scale" value={rockParams.barnacleScale as number} min={0.1} max={1} step={0.01} keyPrimary="rock:barnacleScale" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.barnacleColor as string} onChange={(e) => setRockParam("barnacleColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Seaweed" value={rockParams.seaweedStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:seaweedStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Seaweed Color</span>
          <input type="color" value={rockParams.seaweedColor as string} onChange={(e) => setRockParam("seaweedColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Coral" value={rockParams.coralStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:coralStrength" />
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {coralTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("coralType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.coralType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Coral Color</span>
          <input type="color" value={rockParams.coralColor as string} onChange={(e) => setRockParam("coralColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Waterline Height" value={rockParams.waterlineHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:waterlineHeight" />
        <SliderRow label="Tidal Range" value={rockParams.waterlineTide as number} min={0} max={0.5} step={0.01} keyPrimary="rock:waterlineTide" />
      </div>
    </div>
  );
}
