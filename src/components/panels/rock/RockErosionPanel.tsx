import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockErosionPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const fractureTypes = ["voronoi", "linear", "conchoidal", "columnar", "radial", "dendritic", "polygonal"];

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
        <div className="editor-section-title">Wind Erosion</div>
        <SliderRow label="Wind Strength" value={rockParams.erosionWindStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionWindStrength" />
        <SliderRow label="Wind Direction" value={rockParams.erosionWindDirection as number} min={-1} max={1} step={0.01} keyPrimary="rock:erosionWindDirection" />
        <SliderRow label="Abrasion" value={rockParams.erosionWindAbrasion as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionWindAbrasion" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Solution & Karst</div>
        <SliderRow label="Solution Pockets" value={rockParams.erosionSolutionPockets as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionSolutionPockets" />
        <SliderRow label="Solution Scale" value={rockParams.erosionSolutionScale as number} min={1} max={8} step={0.5} keyPrimary="rock:erosionSolutionScale" />
        <SliderRow label="Karst" value={rockParams.erosionKarst as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionKarst" />
        <SliderRow label="Karst Scale" value={rockParams.erosionKarstScale as number} min={0.5} max={5} step={0.1} keyPrimary="rock:erosionKarstScale" />
        <SliderRow label="Karst Depth" value={rockParams.erosionKarstDepth as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionKarstDepth" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Tidal & Glacial</div>
        <SliderRow label="Tidal Notch" value={rockParams.erosionTidalNotch as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionTidalNotch" />
        <SliderRow label="Tidal Height" value={rockParams.erosionTidalHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionTidalHeight" />
        <SliderRow label="Tidal Width" value={rockParams.erosionTidalWidth as number} min={0} max={0.5} step={0.01} keyPrimary="rock:erosionTidalWidth" />
        <SliderRow label="Glacial Erosion" value={rockParams.erosionGlacial as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionGlacial" />
        <SliderRow label="Glacial Scratch" value={rockParams.erosionGlacialScratch as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionGlacialScratch" />
        <SliderRow label="Glacial Polish" value={rockParams.erosionGlacialPolish as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionGlacialPolish" />
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
        <SliderRow label="Secondary Fractures" value={rockParams.fractureSecondary as number} min={0} max={1} step={0.01} keyPrimary="rock:fractureSecondary" />
        <SliderRow label="Fracture Fill" value={rockParams.fractureFill as number} min={0} max={1} step={0.01} keyPrimary="rock:fractureFill" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Fill Color</span>
          <input type="color" value={rockParams.fractureFillColor as string} onChange={(e) => setRockParam("fractureFillColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Stain</span>
          <input type="color" value={rockParams.fractureStainColor as string} onChange={(e) => setRockParam("fractureStainColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Fracture Weathering" value={rockParams.fractureWeathering as number} min={0} max={1} step={0.01} keyPrimary="rock:fractureWeathering" />
        <SliderRow label="Fracture Staining" value={rockParams.fractureStaining as number} min={0} max={1} step={0.01} keyPrimary="rock:fractureStaining" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Columnar Joints</div>
        <SliderRow label="Strength" value={rockParams.columnarJointStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:columnarJointStrength" />
        <SliderRow label="Sides" value={rockParams.columnarJointSides as number} min={4} max={8} step={1} keyPrimary="rock:columnarJointSides" format={(v) => v.toString()} />
        <SliderRow label="Scale" value={rockParams.columnarJointScale as number} min={0.3} max={2} step={0.05} keyPrimary="rock:columnarJointScale" />
        <SliderRow label="Regularity" value={rockParams.columnarJointRegularity as number} min={0} max={1} step={0.01} keyPrimary="rock:columnarJointRegularity" />
        <SliderRow label="Height" value={rockParams.columnarJointHeight as number} min={0.2} max={3} step={0.05} keyPrimary="rock:columnarJointHeight" />
        <SliderRow label="Taper" value={rockParams.columnarJointTaper as number} min={0} max={1} step={0.01} keyPrimary="rock:columnarJointTaper" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Exfoliation Joints</div>
        <SliderRow label="Strength" value={rockParams.exfoliationJointStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:exfoliationJointStrength" />
        <SliderRow label="Layers" value={rockParams.exfoliationJointLayers as number} min={1} max={10} step={1} keyPrimary="rock:exfoliationJointLayers" format={(v) => v.toString()} />
        <SliderRow label="Spacing" value={rockParams.exfoliationJointSpacing as number} min={0.05} max={0.5} step={0.01} keyPrimary="rock:exfoliationJointSpacing" />
        <SliderRow label="Curve" value={rockParams.exfoliationJointCurve as number} min={0} max={1} step={0.01} keyPrimary="rock:exfoliationJointCurve" />
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
        <SliderRow label="Fault" value={rockParams.layeringFault as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringFault" />
        <SliderRow label="Fault Offset" value={rockParams.layeringFaultOffset as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringFaultOffset" />
        <SliderRow label="Fold" value={rockParams.layeringFold as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringFold" />
        <SliderRow label="Cross Bedding" value={rockParams.layeringCrossBedding as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringCrossBedding" />
        <SliderRow label="Graded Bedding" value={rockParams.layeringGradedBedding as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringGradedBedding" />
        <SliderRow label="Differential Erosion" value={rockParams.layeringDifferentialErosion as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringDifferentialErosion" />
      </div>
    </div>
  );
}
