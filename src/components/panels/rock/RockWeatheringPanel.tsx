import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockWeatheringPanel() {
  const { rockParams, setRockParam } = useProVegLayout();
  return (
    <div className="space-y-3">
      {/* Thermal Erosion */}
      <div className="editor-section">
        <div className="editor-section-title">Thermal Erosion (Freeze-Thaw)</div>
        <SliderRow label="Strength" value={rockParams.thermalErosionStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:thermalErosionStrength" />
        <SliderRow label="Crack Depth" value={rockParams.thermalCrackDepth as number} min={0} max={0.5} step={0.01} keyPrimary="rock:thermalCrackDepth" />
        <SliderRow label="Crack Width" value={rockParams.thermalCrackWidth as number} min={0.01} max={0.3} step={0.005} keyPrimary="rock:thermalCrackWidth" />
        <SliderRow label="Crack Density" value={rockParams.thermalCrackDensity as number} min={1} max={12} step={1} keyPrimary="rock:thermalCrackDensity" format={(v) => v.toString()} />
        <SliderRow label="Direction Bias" value={rockParams.thermalCrackDirection as number} min={0} max={1} step={0.01} keyPrimary="rock:thermalCrackDirection" />
      </div>

      {/* Chemical Weathering */}
      <div className="editor-section">
        <div className="editor-section-title">Chemical Weathering</div>
        <SliderRow label="Strength" value={rockParams.chemicalWeatheringStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:chemicalWeatheringStrength" />
        <SliderRow label="Depth" value={rockParams.chemicalWeatheringDepth as number} min={0} max={1} step={0.01} keyPrimary="rock:chemicalWeatheringDepth" />
        <SliderRow label="Pattern" value={rockParams.chemicalWeatheringPattern as number} min={0} max={1} step={0.01} keyPrimary="rock:chemicalWeatheringPattern" />
        <SliderRow label="Pitting" value={rockParams.chemicalPittingStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:chemicalPittingStrength" />
        <SliderRow label="Pitting Scale" value={rockParams.chemicalPittingScale as number} min={1} max={15} step={0.5} keyPrimary="rock:chemicalPittingScale" />
      </div>

      {/* Iron Oxide / Rust */}
      <div className="editor-section">
        <div className="editor-section-title">Iron Oxide / Rust</div>
        <SliderRow label="Strength" value={rockParams.rustStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:rustStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.rustColor as string} onChange={(e) => setRockParam("rustColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <input type="color" value={rockParams.rustSecondaryColor as string} onChange={(e) => setRockParam("rustSecondaryColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Scale" value={rockParams.rustScale as number} min={1} max={10} step={0.5} keyPrimary="rock:rustScale" />
        <SliderRow label="Drip Streaks" value={rockParams.rustDrip as number} min={0} max={1} step={0.01} keyPrimary="rock:rustDrip" />
        <SliderRow label="Drip Length" value={rockParams.rustDripLength as number} min={0.1} max={2} step={0.05} keyPrimary="rock:rustDripLength" />
        <SliderRow label="Oxidation" value={rockParams.rustOxidation as number} min={0} max={1} step={0.01} keyPrimary="rock:rustOxidation" />
      </div>

      {/* Patina */}
      <div className="editor-section">
        <div className="editor-section-title">Patina / Verdigris</div>
        <SliderRow label="Strength" value={rockParams.rustPatina as number} min={0} max={1} step={0.01} keyPrimary="rock:rustPatina" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.rustPatinaColor as string} onChange={(e) => setRockParam("rustPatinaColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      {/* Water Staining */}
      <div className="editor-section">
        <div className="editor-section-title">Water Staining</div>
        <SliderRow label="Strength" value={rockParams.waterStainStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:waterStainStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.waterStainColor as string} onChange={(e) => setRockParam("waterStainColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Height" value={rockParams.waterStainHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:waterStainHeight" />
        <SliderRow label="Sharpness" value={rockParams.waterStainSharpness as number} min={0} max={1} step={0.01} keyPrimary="rock:waterStainSharpness" />
        <SliderRow label="Drip Lines" value={rockParams.waterStainDrip as number} min={0} max={1} step={0.01} keyPrimary="rock:waterStainDrip" />
      </div>

      {/* Wet Areas */}
      <div className="editor-section">
        <div className="editor-section-title">Wet Areas</div>
        <SliderRow label="Strength" value={rockParams.wetAreaStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:wetAreaStrength" />
        <SliderRow label="Height" value={rockParams.wetAreaHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:wetAreaHeight" />
        <SliderRow label="Darkening" value={rockParams.wetAreaDarkening as number} min={0} max={1} step={0.01} keyPrimary="rock:wetAreaDarkening" />
        <SliderRow label="Gloss" value={rockParams.wetAreaGloss as number} min={0} max={1} step={0.01} keyPrimary="rock:wetAreaGloss" />
      </div>

      {/* Aging */}
      <div className="editor-section">
        <div className="editor-section-title">Aging</div>
        <SliderRow label="Age Strength" value={rockParams.ageStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:ageStrength" />
        <SliderRow label="Desaturation" value={rockParams.ageDesaturation as number} min={0} max={1} step={0.01} keyPrimary="rock:ageDesaturation" />
        <SliderRow label="Darkening" value={rockParams.ageDarkening as number} min={0} max={1} step={0.01} keyPrimary="rock:ageDarkening" />
        <SliderRow label="Color Shift" value={rockParams.ageColorShift as number} min={-1} max={1} step={0.01} keyPrimary="rock:ageColorShift" />
        <SliderRow label="Surface Wear" value={rockParams.ageWear as number} min={0} max={1} step={0.01} keyPrimary="rock:ageWear" />
      </div>

      {/* Salt Crust */}
      <div className="editor-section">
        <div className="editor-section-title">Salt / Mineral Crust</div>
        <SliderRow label="Strength" value={rockParams.saltCrustStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:saltCrustStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.saltCrustColor as string} onChange={(e) => setRockParam("saltCrustColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Scale" value={rockParams.saltCrustScale as number} min={1} max={15} step={0.5} keyPrimary="rock:saltCrustScale" />
        <SliderRow label="Threshold" value={rockParams.saltCrustThreshold as number} min={0.2} max={0.9} step={0.01} keyPrimary="rock:saltCrustThreshold" />
        <SliderRow label="Crystal Formation" value={rockParams.saltCrystals as number} min={0} max={1} step={0.01} keyPrimary="rock:saltCrystals" />
      </div>
    </div>
  );
}
