import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockGrowthPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const mossTypes = ["clump", "sheet", "drape", "stringy", "cushion", "feather", "sphagnum", "haircap", "peat"];
  const lichenTypes = ["crustose", "foliose", "fruticose", "map", "powdery", "areolate", "bullate", "umbilicate"];
  const algaeTypes = ["green", "red", "brown", "blue-green", "diatom"];

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
        <SliderRow label="Fruiting Bodies" value={rockParams.mossFruitingBodies as number} min={0} max={1} step={0.01} keyPrimary="rock:mossFruitingBodies" />
        <SliderRow label="Dead Patches" value={rockParams.mossDeadPatches as number} min={0} max={1} step={0.01} keyPrimary="rock:mossDeadPatches" />
        <SliderRow label="Blending" value={rockParams.mossBlending as number} min={0} max={1} step={0.01} keyPrimary="rock:mossBlending" />
        <SliderRow label="Overgrowth" value={rockParams.mossOvergrowth as number} min={0} max={1} step={0.01} keyPrimary="rock:mossOvergrowth" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Primary</span>
          <input type="color" value={rockParams.mossColor as string} onChange={(e) => setRockParam("mossColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Secondary</span>
          <input type="color" value={rockParams.mossSecondaryColor as string} onChange={(e) => setRockParam("mossSecondaryColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Dead</span>
          <input type="color" value={rockParams.mossDeadColor as string} onChange={(e) => setRockParam("mossDeadColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
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
        <SliderRow label="Soredia" value={rockParams.lichenSoredia as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenSoredia" />
        <SliderRow label="Apothecia" value={rockParams.lichenApothecia as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenApothecia" />
        <SliderRow label="Multi-Species" value={rockParams.lichenMultiSpecies as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenMultiSpecies" />
        <SliderRow label="Competition" value={rockParams.lichenCompetition as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenCompetition" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.lichenColor as string} onChange={(e) => setRockParam("lichenColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Edge</span>
          <input type="color" value={rockParams.lichenEdgeColor as string} onChange={(e) => setRockParam("lichenEdgeColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Sp.2</span>
          <input type="color" value={rockParams.lichenSpecies2Color as string} onChange={(e) => setRockParam("lichenSpecies2Color", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      {/* Algae */}
      <div className="editor-section">
        <div className="editor-section-title">Algae</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {algaeTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("algaeType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.algaeType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <SliderRow label="Strength" value={rockParams.algaeStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.algaeColor as string} onChange={(e) => setRockParam("algaeColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Scale" value={rockParams.algaeScale as number} min={1} max={10} step={0.5} keyPrimary="rock:algaeScale" />
        <SliderRow label="Wetness" value={rockParams.algaeWetness as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeWetness" />
        <SliderRow label="Threshold" value={rockParams.algaeThreshold as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeThreshold" />
        <SliderRow label="Sliminess" value={rockParams.algaeSliminess as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeSliminess" />
        <SliderRow label="Biofilm" value={rockParams.algaeBiofilm as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeBiofilm" />
        <SliderRow label="Streaks" value={rockParams.algaeStreaks as number} min={0} max={1} step={0.01} keyPrimary="rock:algaeStreaks" />
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
        <SliderRow label="Melt" value={rockParams.snowMelt as number} min={0} max={1} step={0.01} keyPrimary="rock:snowMelt" />
        <SliderRow label="Melt Drip" value={rockParams.snowMeltDrip as number} min={0} max={1} step={0.01} keyPrimary="rock:snowMeltDrip" />
        <SliderRow label="Dirty Snow" value={rockParams.snowDirty as number} min={0} max={1} step={0.01} keyPrimary="rock:snowDirty" />
        <SliderRow label="Icicles" value={rockParams.snowIcicles as number} min={0} max={1} step={0.01} keyPrimary="rock:snowIcicles" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Ice & Frost</div>
        <SliderRow label="Ice" value={rockParams.iceStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:iceStrength" />
        <SliderRow label="Thickness" value={rockParams.iceThickness as number} min={0} max={1} step={0.01} keyPrimary="rock:iceThickness" />
        <SliderRow label="Translucency" value={rockParams.iceTranslucency as number} min={0} max={1} step={0.01} keyPrimary="rock:iceTranslucency" />
        <SliderRow label="Ice Cracking" value={rockParams.iceCracking as number} min={0} max={1} step={0.01} keyPrimary="rock:iceCracking" />
        <SliderRow label="Ice Bubbles" value={rockParams.iceBubbles as number} min={0} max={1} step={0.01} keyPrimary="rock:iceBubbles" />
        <SliderRow label="Frost" value={rockParams.frostStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:frostStrength" />
        <SliderRow label="Frost Scale" value={rockParams.frostScale as number} min={2} max={20} step={1} keyPrimary="rock:frostScale" format={(v) => v.toString()} />
        <SliderRow label="Frost Thickness" value={rockParams.frostThickness as number} min={0} max={1} step={0.01} keyPrimary="rock:frostThickness" />
      </div>

      {/* Environment */}
      <div className="editor-section">
        <div className="editor-section-title">Environment</div>
        <SliderRow label="Ground Moss" value={rockParams.groundMossCoverage as number} min={0} max={1} step={0.01} keyPrimary="rock:groundMossCoverage" />
        <SliderRow label="Buried Depth" value={rockParams.buriedDepth as number} min={0} max={1} step={0.01} keyPrimary="rock:buriedDepth" />
        <SliderRow label="Soil Line" value={rockParams.soilLine as number} min={0} max={1} step={0.01} keyPrimary="rock:soilLine" />
        <SliderRow label="Soil Splash" value={rockParams.soilSplash as number} min={0} max={1} step={0.01} keyPrimary="rock:soilSplash" />
        <SliderRow label="Root Exposure" value={rockParams.rootExposure as number} min={0} max={1} step={0.01} keyPrimary="rock:rootExposure" />
      </div>
    </div>
  );
}
