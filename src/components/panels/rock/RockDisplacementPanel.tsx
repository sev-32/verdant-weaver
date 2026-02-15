import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockDisplacementPanel() {
  const { rockParams } = useProVegLayout();
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
    </div>
  );
}
