import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockGrowthPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const mossTypes = ["clump", "sheet", "drape", "stringy", "cushion", "feather"];
  const lichenTypes = ["crustose", "foliose", "fruticose", "map"];

  return (
    <div className="space-y-3">
      {/* Moss */}
      <div className="editor-section">
        <div className="editor-section-title">Moss</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {mossTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("mossType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.mossType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <SliderRow label="Coverage" value={rockParams.mossCoverage as number} min={0} max={1} step={0.01} keyPrimary="rock:mossCoverage" />
        <SliderRow label="Threshold" value={rockParams.mossThreshold as number} min={0} max={1} step={0.01} keyPrimary="rock:mossThreshold" />
        <SliderRow label="Height" value={rockParams.mossHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:mossHeight" />
        <SliderRow label="Variation" value={rockParams.mossVariation as number} min={0} max={0.5} step={0.01} keyPrimary="rock:mossVariation" />
        <SliderRow label="Density" value={rockParams.mossDensity as number} min={0} max={1} step={0.01} keyPrimary="rock:mossDensity" />
        <SliderRow label="Edge Softness" value={rockParams.mossEdgeSoftness as number} min={0} max={1} step={0.01} keyPrimary="rock:mossEdgeSoftness" />
        <SliderRow label="Prefer Crevices" value={rockParams.mossPreferCrevices as number} min={0} max={1} step={0.01} keyPrimary="rock:mossPreferCrevices" />
        <SliderRow label="Prefer North" value={rockParams.mossPreferNorth as number} min={-1} max={1} step={0.01} keyPrimary="rock:mossPreferNorth" />
        <SliderRow label="Prefer Shade" value={rockParams.mossPreferShade as number} min={0} max={1} step={0.01} keyPrimary="rock:mossPreferShade" />
        <SliderRow label="Moisture" value={rockParams.mossMoisture as number} min={0} max={1} step={0.01} keyPrimary="rock:mossMoisture" />
        <SliderRow label="Age" value={rockParams.mossAge as number} min={0} max={1} step={0.01} keyPrimary="rock:mossAge" />
        <SliderRow label="Spore Spread" value={rockParams.mossSporeSpread as number} min={0} max={1} step={0.01} keyPrimary="rock:mossSporeSpread" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Primary</span>
          <input type="color" value={rockParams.mossColor as string} onChange={(e) => setRockParam("mossColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Secondary</span>
          <input type="color" value={rockParams.mossSecondaryColor as string} onChange={(e) => setRockParam("mossSecondaryColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      {/* Lichen */}
      <div className="editor-section">
        <div className="editor-section-title">Lichen</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {lichenTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("lichenType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.lichenType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <SliderRow label="Strength" value={rockParams.lichenStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenStrength" />
        <SliderRow label="Scale" value={rockParams.lichenScale as number} min={1} max={12} step={0.5} keyPrimary="rock:lichenScale" />
        <SliderRow label="Threshold" value={rockParams.lichenThreshold as number} min={0.2} max={0.9} step={0.01} keyPrimary="rock:lichenThreshold" />
        <SliderRow label="Circularity" value={rockParams.lichenCircularity as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenCircularity" />
        <SliderRow label="Edge Width" value={rockParams.lichenEdgeWidth as number} min={0} max={0.4} step={0.01} keyPrimary="rock:lichenEdgeWidth" />
        <SliderRow label="Density" value={rockParams.lichenDensity as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenDensity" />
        <SliderRow label="Age" value={rockParams.lichenAge as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenAge" />
        <SliderRow label="Elevation Pref" value={rockParams.lichenElevation as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenElevation" />
        <SliderRow label="Exposed Pref" value={rockParams.lichenPreferExposed as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenPreferExposed" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.lichenColor as string} onChange={(e) => setRockParam("lichenColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Edge</span>
          <input type="color" value={rockParams.lichenEdgeColor as string} onChange={(e) => setRockParam("lichenEdgeColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      {/* Algae */}
      <div className="editor-section">
        <div className="editor-section-title">Algae</div>
        <SliderRow label="Strength" value={rockParams.algaeStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.algaeColor as string} onChange={(e) => setRockParam("algaeColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Scale" value={rockParams.algaeScale as number} min={1} max={10} step={0.5} keyPrimary="rock:algaeScale" />
        <SliderRow label="Wetness" value={rockParams.algaeWetness as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeWetness" />
        <SliderRow label="Threshold" value={rockParams.algaeThreshold as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeThreshold" />
        <SliderRow label="Sliminess" value={rockParams.algaeSliminess as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeSliminess" />
      </div>

      {/* Snow / Ice / Frost */}
      <div className="editor-section">
        <div className="editor-section-title">Snow</div>
        <SliderRow label="Coverage" value={rockParams.snowStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:snowStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.snowColor as string} onChange={(e) => setRockParam("snowColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Threshold" value={rockParams.snowThreshold as number} min={0} max={1} step={0.01} keyPrimary="rock:snowThreshold" />
        <SliderRow label="Sharpness" value={rockParams.snowSharpness as number} min={0} max={1} step={0.01} keyPrimary="rock:snowSharpness" />
        <SliderRow label="Drift" value={rockParams.snowDrift as number} min={0} max={1} step={0.01} keyPrimary="rock:snowDrift" />
        <SliderRow label="Drift Direction" value={rockParams.snowDriftDirection as number} min={-1} max={1} step={0.01} keyPrimary="rock:snowDriftDirection" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Ice</div>
        <SliderRow label="Strength" value={rockParams.iceStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:iceStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.iceColor as string} onChange={(e) => setRockParam("iceColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Thickness" value={rockParams.iceThickness as number} min={0} max={1} step={0.01} keyPrimary="rock:iceThickness" />
        <SliderRow label="Translucency" value={rockParams.iceTranslucency as number} min={0} max={1} step={0.01} keyPrimary="rock:iceTranslucency" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Frost</div>
        <SliderRow label="Strength" value={rockParams.frostStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:frostStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.frostColor as string} onChange={(e) => setRockParam("frostColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Scale" value={rockParams.frostScale as number} min={2} max={20} step={1} keyPrimary="rock:frostScale" format={(v) => v.toString()} />
      </div>

      {/* Dust / Sediment / Ash */}
      <div className="editor-section">
        <div className="editor-section-title">Dust / Sediment</div>
        <SliderRow label="Dust" value={rockParams.dustStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:dustStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.dustColor as string} onChange={(e) => setRockParam("dustColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Gravity" value={rockParams.dustGravity as number} min={0} max={1} step={0.01} keyPrimary="rock:dustGravity" />
        <SliderRow label="Thickness" value={rockParams.dustThickness as number} min={0} max={1} step={0.01} keyPrimary="rock:dustThickness" />
        <SliderRow label="Sediment" value={rockParams.sedimentStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:sedimentStrength" />
        <SliderRow label="Ash" value={rockParams.ashStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:ashStrength" />
      </div>
    </div>
  );
}
