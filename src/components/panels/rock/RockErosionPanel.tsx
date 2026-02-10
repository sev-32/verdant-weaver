import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockErosionPanel() {
  const { rockParams } = useProVegLayout();
  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">Erosion</div>
        <SliderRow label="Strength" value={rockParams.erosionStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionStrength" />
        <SliderRow label="Sharpness" value={rockParams.erosionSharpness as number} min={0.2} max={4} step={0.1} keyPrimary="rock:erosionSharpness" />
        <SliderRow label="Direction (Gravity)" value={rockParams.erosionDirection as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionDirection" />
        <SliderRow label="Water Channels" value={rockParams.erosionChannels as number} min={0} max={1} step={0.01} keyPrimary="rock:erosionChannels" />
        <SliderRow label="Smoothing" value={rockParams.erosionSmoothing as number} min={0} max={0.6} step={0.01} keyPrimary="rock:erosionSmoothing" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Fracture</div>
        <SliderRow label="Strength" value={rockParams.fractureStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:fractureStrength" />
        <SliderRow label="Density" value={rockParams.fractureDensity as number} min={1} max={10} step={1} keyPrimary="rock:fractureDensity" format={(v) => v.toString()} />
        <SliderRow label="Sharpness" value={rockParams.fractureSharpness as number} min={0.5} max={5} step={0.1} keyPrimary="rock:fractureSharpness" />
        <SliderRow label="Depth" value={rockParams.fractureDepth as number} min={0} max={0.4} step={0.01} keyPrimary="rock:fractureDepth" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Layering</div>
        <SliderRow label="Strength" value={rockParams.layeringStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringStrength" />
        <SliderRow label="Frequency" value={rockParams.layeringFrequency as number} min={2} max={24} step={1} keyPrimary="rock:layeringFrequency" format={(v) => v.toString()} />
        <SliderRow label="Warp" value={rockParams.layeringWarp as number} min={0} max={1} step={0.01} keyPrimary="rock:layeringWarp" />
      </div>
    </div>
  );
}
