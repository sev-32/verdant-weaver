import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <button onClick={() => onChange(!value)}
        className={`w-8 h-4 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}>
        <div className={`w-3 h-3 rounded-full bg-foreground transition-transform mx-0.5 ${value ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export function RockDisplacementPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const axisOptions = ["x", "y", "z"];

  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">Primary Displacement</div>
        <SliderRow label="Strength" value={rockParams.displacementStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:displacementStrength" />
        <SliderRow label="Frequency" value={rockParams.displacementFrequency as number} min={0.5} max={6} step={0.1} keyPrimary="rock:displacementFrequency" />
        <SliderRow label="Octaves" value={rockParams.displacementOctaves as number} min={1} max={8} step={1} keyPrimary="rock:displacementOctaves" format={(v) => v.toString()} />
        <SliderRow label="Lacunarity" value={rockParams.displacementLacunarity as number} min={1.2} max={3} step={0.05} keyPrimary="rock:displacementLacunarity" />
        <SliderRow label="Persistence" value={rockParams.displacementPersistence as number} min={0.2} max={0.8} step={0.01} keyPrimary="rock:displacementPersistence" />
        <SliderRow label="Domain Warp" value={rockParams.displacementWarpStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:displacementWarpStrength" />
        <SliderRow label="Warp Frequency" value={rockParams.displacementWarpFrequency as number} min={0.5} max={4} step={0.1} keyPrimary="rock:displacementWarpFrequency" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Noise Variants</div>
        <Toggle label="Ridged Noise" value={rockParams.displacementRidged as boolean} onChange={(v) => setRockParam("displacementRidged", v)} />
        <SliderRow label="Ridge Offset" value={rockParams.displacementRidgedOffset as number} min={0} max={2} step={0.05} keyPrimary="rock:displacementRidgedOffset" />
        <SliderRow label="Ridge Gain" value={rockParams.displacementRidgedGain as number} min={1} max={4} step={0.1} keyPrimary="rock:displacementRidgedGain" />
        <Toggle label="Billowed Noise" value={rockParams.displacementBillowed as boolean} onChange={(v) => setRockParam("displacementBillowed", v)} />
        <Toggle label="Swiss Noise" value={rockParams.displacementSwiss as boolean} onChange={(v) => setRockParam("displacementSwiss", v)} />
        <SliderRow label="Swiss Warp" value={rockParams.displacementSwissWarp as number} min={0} max={1} step={0.01} keyPrimary="rock:displacementSwissWarp" />
        <SliderRow label="Voronoi Blend" value={rockParams.displacementVoronoiBlend as number} min={0} max={1} step={0.01} keyPrimary="rock:displacementVoronoiBlend" />
        <SliderRow label="Voronoi Scale" value={rockParams.displacementVoronoiScale as number} min={0.5} max={6} step={0.1} keyPrimary="rock:displacementVoronoiScale" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Falloff</div>
        <SliderRow label="Radial Falloff" value={rockParams.displacementRadialFalloff as number} min={0} max={1} step={0.01} keyPrimary="rock:displacementRadialFalloff" />
        <SliderRow label="Axial Bias" value={rockParams.displacementAxialBias as number} min={-1} max={1} step={0.01} keyPrimary="rock:displacementAxialBias" />
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[11px] text-muted-foreground">Axis:</span>
          {axisOptions.map((a) => (
            <button key={a} onClick={() => setRockParam("displacementAxialAxis", a)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.displacementAxialAxis === a ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {a.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Secondary Displacement</div>
        <SliderRow label="Strength" value={rockParams.secondaryDisplacementStrength as number} min={0} max={0.5} step={0.01} keyPrimary="rock:secondaryDisplacementStrength" />
        <SliderRow label="Frequency" value={rockParams.secondaryDisplacementFrequency as number} min={1} max={12} step={0.5} keyPrimary="rock:secondaryDisplacementFrequency" />
        <SliderRow label="Octaves" value={rockParams.secondaryDisplacementOctaves as number} min={1} max={6} step={1} keyPrimary="rock:secondaryDisplacementOctaves" format={(v) => v.toString()} />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Micro Displacement</div>
        <SliderRow label="Strength" value={rockParams.microDisplacementStrength as number} min={0} max={0.2} step={0.005} keyPrimary="rock:microDisplacementStrength" />
        <SliderRow label="Frequency" value={rockParams.microDisplacementFrequency as number} min={4} max={30} step={1} keyPrimary="rock:microDisplacementFrequency" format={(v) => v.toString()} />
        <SliderRow label="Octaves" value={rockParams.microDisplacementOctaves as number} min={1} max={4} step={1} keyPrimary="rock:microDisplacementOctaves" format={(v) => v.toString()} />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Directional Displacement</div>
        <SliderRow label="Strength" value={rockParams.directionalDisplacementStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:directionalDisplacementStrength" />
        <SliderRow label="Dir X" value={rockParams.directionalDisplacementX as number} min={-1} max={1} step={0.01} keyPrimary="rock:directionalDisplacementX" />
        <SliderRow label="Dir Y" value={rockParams.directionalDisplacementY as number} min={-1} max={1} step={0.01} keyPrimary="rock:directionalDisplacementY" />
        <SliderRow label="Dir Z" value={rockParams.directionalDisplacementZ as number} min={-1} max={1} step={0.01} keyPrimary="rock:directionalDisplacementZ" />
        <SliderRow label="Falloff" value={rockParams.directionalDisplacementFalloff as number} min={0} max={1} step={0.01} keyPrimary="rock:directionalDisplacementFalloff" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Surface</div>
        <SliderRow label="Bump Scale" value={rockParams.surfaceBumpScale as number} min={0} max={0.2} step={0.005} keyPrimary="rock:surfaceBumpScale" />
        <SliderRow label="Pitting" value={rockParams.surfacePitting as number} min={0} max={1} step={0.01} keyPrimary="rock:surfacePitting" />
        <SliderRow label="Pitting Size" value={rockParams.surfacePittingSize as number} min={0.1} max={1} step={0.05} keyPrimary="rock:surfacePittingSize" />
        <SliderRow label="Pitting Depth" value={rockParams.surfacePittingDepth as number} min={0} max={1} step={0.01} keyPrimary="rock:surfacePittingDepth" />
        <SliderRow label="Scratches" value={rockParams.surfaceScratchStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:surfaceScratchStrength" />
        <SliderRow label="Scratch Freq" value={rockParams.surfaceScratchFrequency as number} min={2} max={20} step={1} keyPrimary="rock:surfaceScratchFrequency" format={(v) => v.toString()} />
        <SliderRow label="Granularity" value={rockParams.surfaceGranularity as number} min={0} max={1} step={0.01} keyPrimary="rock:surfaceGranularity" />
        <SliderRow label="Polish" value={rockParams.surfacePolyshStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:surfacePolyshStrength" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Advanced Surface</div>
        <SliderRow label="Chisel Marks" value={rockParams.surfaceChiselMarks as number} min={0} max={1} step={0.01} keyPrimary="rock:surfaceChiselMarks" />
        <SliderRow label="Chisel Scale" value={rockParams.surfaceChiselScale as number} min={1} max={10} step={0.5} keyPrimary="rock:surfaceChiselScale" />
        <SliderRow label="Tool Marks" value={rockParams.surfaceToolMarks as number} min={0} max={1} step={0.01} keyPrimary="rock:surfaceToolMarks" />
        <SliderRow label="Conchoidal" value={rockParams.surfaceConchoidal as number} min={0} max={1} step={0.01} keyPrimary="rock:surfaceConchoidal" />
        <SliderRow label="Gloss Patches" value={rockParams.surfaceGloss as number} min={0} max={1} step={0.01} keyPrimary="rock:surfaceGloss" />
        <SliderRow label="Exfoliation" value={rockParams.surfaceExfoliation as number} min={0} max={1} step={0.01} keyPrimary="rock:surfaceExfoliation" />
        <SliderRow label="Exfoliation Layers" value={rockParams.surfaceExfoliationLayers as number} min={1} max={8} step={1} keyPrimary="rock:surfaceExfoliationLayers" format={(v) => v.toString()} />
        <SliderRow label="Spalling" value={rockParams.surfaceSpalling as number} min={0} max={1} step={0.01} keyPrimary="rock:surfaceSpalling" />
        <SliderRow label="Spalling Size" value={rockParams.surfaceSpallingSize as number} min={0.1} max={1} step={0.01} keyPrimary="rock:surfaceSpallingSize" />
      </div>
    </div>
  );
}
