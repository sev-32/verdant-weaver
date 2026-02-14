import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockDisplacementPanel() {
  const { rockParams } = useProVegLayout();
  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">Displacement</div>
        <SliderRow label="Strength" value={rockParams.displacementStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:displacementStrength" />
        <SliderRow label="Frequency" value={rockParams.displacementFrequency as number} min={0.5} max={6} step={0.1} keyPrimary="rock:displacementFrequency" />
        <SliderRow label="Octaves" value={rockParams.displacementOctaves as number} min={1} max={8} step={1} keyPrimary="rock:displacementOctaves" format={(v) => v.toString()} />
        <SliderRow label="Lacunarity" value={rockParams.displacementLacunarity as number} min={1.2} max={3} step={0.05} keyPrimary="rock:displacementLacunarity" />
        <SliderRow label="Persistence" value={rockParams.displacementPersistence as number} min={0.2} max={0.8} step={0.01} keyPrimary="rock:displacementPersistence" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Surface</div>
        <SliderRow label="Bump Scale" value={rockParams.surfaceBumpScale as number} min={0} max={0.2} step={0.005} keyPrimary="rock:surfaceBumpScale" />
        <SliderRow label="Pitting" value={rockParams.surfacePitting as number} min={0} max={1} step={0.01} keyPrimary="rock:surfacePitting" />
      </div>
    </div>
  );
}
