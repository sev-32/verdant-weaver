import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockErosionPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const fractureTypes = ["voronoi", "linear", "conchoidal", "columnar"];

  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">Erosion</div>
        <SliderRow label="Strength" value={rockParams.erosionStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionStrength" />
        <SliderRow label="Sharpness" value={rockParams.erosionSharpness as number} min={0.2} max={4} step={0.1} keyPrimary="rock:erosionSharpness" />
        <SliderRow label="Direction (Gravity)" value={rockParams.erosionDirection as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionDirection" />
        <SliderRow label="Water Channels" value={rockParams.erosionChannels as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionChannels" />
        <SliderRow label="Channel Width" value={rockParams.erosionChannelWidth as number} min={0.1} max={1} step={0.01} keyPrimary="rock:erosionChannelWidth" />
        <SliderRow label="Channel Depth" value={rockParams.erosionChannelDepth as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionChannelDepth" />
        <SliderRow label="Smoothing" value={rockParams.erosionSmoothing as number} min={0} max={0.6} step={0.01} keyPrimary="rock:erosionSmoothing" />
        <SliderRow label="Riverlets" value={rockParams.erosionRiverlets as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionRiverlets" />
        <SliderRow label="Riverlet Scale" value={rockParams.erosionRiverletsScale as number} min={2} max={15} step={0.5} keyPrimary="rock:erosionRiverletsScale" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Fracture</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {fractureTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("fractureType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.fractureType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <SliderRow label="Strength" value={rockParams.fractureStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:fractureStrength" />
        <SliderRow label="Density" value={rockParams.fractureDensity as number} min={1} max={10} step={1} keyPrimary="rock:fractureDensity" format={(v) => v.toString()} />
        <SliderRow label="Sharpness" value={rockParams.fractureSharpness as number} min={0.5} max={5} step={0.1} keyPrimary="rock:fractureSharpness" />
        <SliderRow label="Depth" value={rockParams.fractureDepth as number} min={0} max={0.4} step={0.01} keyPrimary="rock:fractureDepth" />
        <SliderRow label="Jaggedness" value={rockParams.fractureJaggedeness as number} min={0} max={1} step={0.01} keyPrimary="rock:fractureJaggedeness" />
        <SliderRow label="Offset" value={rockParams.fractureOffset as number} min={-0.5} max={0.5} step={0.01} keyPrimary="rock:fractureOffset" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Columnar Joints</div>
        <SliderRow label="Strength" value={rockParams.columnarJointStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:columnarJointStrength" />
        <SliderRow label="Sides" value={rockParams.columnarJointSides as number} min={4} max={8} step={1} keyPrimary="rock:columnarJointSides" format={(v) => v.toString()} />
        <SliderRow label="Scale" value={rockParams.columnarJointScale as number} min={0.3} max={2} step={0.05} keyPrimary="rock:columnarJointScale" />
        <SliderRow label="Regularity" value={rockParams.columnarJointRegularity as number} min={0} max={1} step={0.01} keyPrimary="rock:columnarJointRegularity" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Layering</div>
        <SliderRow label="Strength" value={rockParams.layeringStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringStrength" />
        <SliderRow label="Frequency" value={rockParams.layeringFrequency as number} min={2} max={24} step={1} keyPrimary="rock:layeringFrequency" format={(v) => v.toString()} />
        <SliderRow label="Warp" value={rockParams.layeringWarp as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringWarp" />
        <SliderRow label="Thickness" value={rockParams.layeringThickness as number} min={0.1} max={1} step={0.01} keyPrimary="rock:layeringThickness" />
        <SliderRow label="Contrast" value={rockParams.layeringContrast as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringContrast" />
        <SliderRow label="Asymmetry" value={rockParams.layeringAsymmetry as number} min={-1} max={1} step={0.01} keyPrimary="rock:layeringAsymmetry" />
        <SliderRow label="Layer Erosion" value={rockParams.layeringErosion as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringErosion" />
        <SliderRow label="Color Shift" value={rockParams.layeringColorShift as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringColorShift" />
      </div>
    </div>
  );
}
