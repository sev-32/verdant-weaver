import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockShapePanel() {
  const { rockParams } = useProVegLayout();
  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">Scale</div>
        <SliderRow label="Overall Scale" value={rockParams.scale as number} min={0.3} max={5} step={0.05} keyPrimary="rock:scale" />
        <SliderRow label="Scale X" value={rockParams.scaleX as number} min={0.2} max={3} step={0.05} keyPrimary="rock:scaleX" />
        <SliderRow label="Scale Y" value={rockParams.scaleY as number} min={0.2} max={3} step={0.05} keyPrimary="rock:scaleY" />
        <SliderRow label="Scale Z" value={rockParams.scaleZ as number} min={0.2} max={3} step={0.05} keyPrimary="rock:scaleZ" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Detail</div>
        <SliderRow label="Subdivisions" value={rockParams.subdivisions as number} min={2} max={6} step={1} keyPrimary="rock:subdivisions" format={(v) => v.toString()} />
        <SliderRow label="Ground Embed" value={rockParams.groundEmbed as number} min={0} max={0.5} step={0.01} keyPrimary="rock:groundEmbed" />
      </div>
    </div>
  );
}
