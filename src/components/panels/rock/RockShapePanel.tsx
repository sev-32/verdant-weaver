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
        <div className="editor-section-title">Deformation</div>
        <SliderRow label="Asymmetry X" value={rockParams.asymmetryX as number} min={-1} max={1} step={0.01} keyPrimary="rock:asymmetryX" />
        <SliderRow label="Asymmetry Y" value={rockParams.asymmetryY as number} min={-1} max={1} step={0.01} keyPrimary="rock:asymmetryY" />
        <SliderRow label="Asymmetry Z" value={rockParams.asymmetryZ as number} min={-1} max={1} step={0.01} keyPrimary="rock:asymmetryZ" />
        <SliderRow label="Squash" value={rockParams.squash as number} min={-1} max={1} step={0.01} keyPrimary="rock:squash" />
        <SliderRow label="Taper" value={rockParams.taper as number} min={-1} max={1} step={0.01} keyPrimary="rock:taper" />
        <SliderRow label="Twist" value={rockParams.twist as number} min={-1} max={1} step={0.01} keyPrimary="rock:twist" />
        <SliderRow label="Bend" value={rockParams.bend as number} min={-1} max={1} step={0.01} keyPrimary="rock:bend" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Edges</div>
        <SliderRow label="Edge Softness" value={rockParams.edgeSoftness as number} min={0} max={1} step={0.01} keyPrimary="rock:edgeSoftness" />
        <SliderRow label="Edge Bevel" value={rockParams.edgeBevel as number} min={0} max={1} step={0.01} keyPrimary="rock:edgeBevel" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Detail</div>
        <SliderRow label="Subdivisions" value={rockParams.subdivisions as number} min={2} max={6} step={1} keyPrimary="rock:subdivisions" format={(v) => v.toString()} />
        <SliderRow label="Ground Embed" value={rockParams.groundEmbed as number} min={0} max={0.5} step={0.01} keyPrimary="rock:groundEmbed" />
      </div>
    </div>
  );
}
