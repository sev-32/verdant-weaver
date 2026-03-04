import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockShapePanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const rockTypes = ["boulder", "cliff", "pillar", "arch", "spire", "slab", "outcrop", "mountain-wall", "cave", "stack", "tor", "pinnacle", "mesa", "butte", "hoodoo"];

  return (
    <div className="space-y-3">
      {/* Rock Type */}
      <div className="editor-section">
        <div className="editor-section-title">Rock Type</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {rockTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("rockType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.rockType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Scale */}
      <div className="editor-section">
        <div className="editor-section-title">Scale</div>
        <SliderRow label="Overall Scale" value={rockParams.scale as number} min={0.3} max={5} step={0.05} keyPrimary="rock:scale" />
        <SliderRow label="Scale X" value={rockParams.scaleX as number} min={0.2} max={3} step={0.05} keyPrimary="rock:scaleX" />
        <SliderRow label="Scale Y" value={rockParams.scaleY as number} min={0.2} max={3} step={0.05} keyPrimary="rock:scaleY" />
        <SliderRow label="Scale Z" value={rockParams.scaleZ as number} min={0.2} max={3} step={0.05} keyPrimary="rock:scaleZ" />
      </div>

      {/* Deformation */}
      <div className="editor-section">
        <div className="editor-section-title">Deformation</div>
        <SliderRow label="Asymmetry X" value={rockParams.asymmetryX as number} min={-1} max={1} step={0.01} keyPrimary="rock:asymmetryX" />
        <SliderRow label="Asymmetry Y" value={rockParams.asymmetryY as number} min={-1} max={1} step={0.01} keyPrimary="rock:asymmetryY" />
        <SliderRow label="Asymmetry Z" value={rockParams.asymmetryZ as number} min={-1} max={1} step={0.01} keyPrimary="rock:asymmetryZ" />
        <SliderRow label="Squash" value={rockParams.squash as number} min={-1} max={1} step={0.01} keyPrimary="rock:squash" />
        <SliderRow label="Taper" value={rockParams.taper as number} min={-1} max={1} step={0.01} keyPrimary="rock:taper" />
        <SliderRow label="Twist" value={rockParams.twist as number} min={-1} max={1} step={0.01} keyPrimary="rock:twist" />
        <SliderRow label="Bend" value={rockParams.bend as number} min={-1} max={1} step={0.01} keyPrimary="rock:bend" />
        <SliderRow label="Concavity" value={rockParams.concavity as number} min={-1} max={1} step={0.01} keyPrimary="rock:concavity" />
      </div>

      {/* Edges */}
      <div className="editor-section">
        <div className="editor-section-title">Edges</div>
        <SliderRow label="Edge Softness" value={rockParams.edgeSoftness as number} min={0} max={1} step={0.01} keyPrimary="rock:edgeSoftness" />
        <SliderRow label="Edge Bevel" value={rockParams.edgeBevel as number} min={0} max={1} step={0.01} keyPrimary="rock:edgeBevel" />
      </div>

      {/* Flatten & Overhang */}
      <div className="editor-section">
        <div className="editor-section-title">Shaping</div>
        <SliderRow label="Flatten Top" value={rockParams.flattenTop as number} min={0} max={1} step={0.01} keyPrimary="rock:flattenTop" />
        <SliderRow label="Flatten Bottom" value={rockParams.flattenBottom as number} min={0} max={1} step={0.01} keyPrimary="rock:flattenBottom" />
        <SliderRow label="Overhang" value={rockParams.overhangStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:overhangStrength" />
        <SliderRow label="Overhang Height" value={rockParams.overhangHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:overhangHeight" />
        <SliderRow label="Overhang Curve" value={rockParams.overhangCurve as number} min={0} max={1} step={0.01} keyPrimary="rock:overhangCurve" />
        <SliderRow label="Mushroom Cap" value={rockParams.mushroomCap as number} min={0} max={1} step={0.01} keyPrimary="rock:mushroomCap" />
        <SliderRow label="Mushroom Neck" value={rockParams.mushroomNeck as number} min={0} max={1} step={0.01} keyPrimary="rock:mushroomNeck" />
        <SliderRow label="Pinnacle Sharpness" value={rockParams.pinnacleSharpness as number} min={0} max={1} step={0.01} keyPrimary="rock:pinnacleSharpness" />
      </div>

      {/* Arch & Hollow */}
      <div className="editor-section">
        <div className="editor-section-title">Arch & Hollow</div>
        <SliderRow label="Arch Width" value={rockParams.archWidth as number} min={0} max={1} step={0.01} keyPrimary="rock:archWidth" />
        <SliderRow label="Arch Height" value={rockParams.archHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:archHeight" />
        <SliderRow label="Arch Thickness" value={rockParams.archThickness as number} min={0.1} max={1} step={0.01} keyPrimary="rock:archThickness" />
        <SliderRow label="Hollow Strength" value={rockParams.hollowStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:hollowStrength" />
        <SliderRow label="Hollow Depth" value={rockParams.hollowDepth as number} min={0} max={1} step={0.01} keyPrimary="rock:hollowDepth" />
        <SliderRow label="Hollow Radius" value={rockParams.hollowRadius as number} min={0.1} max={1} step={0.01} keyPrimary="rock:hollowRadius" />
      </div>

      {/* Shelves */}
      <div className="editor-section">
        <div className="editor-section-title">Shelves & Ledges</div>
        <SliderRow label="Shelf Count" value={rockParams.shelfCount as number} min={0} max={8} step={1} keyPrimary="rock:shelfCount" format={(v) => v.toString()} />
        <SliderRow label="Shelf Height" value={rockParams.shelfHeight as number} min={0.05} max={0.5} step={0.01} keyPrimary="rock:shelfHeight" />
        <SliderRow label="Shelf Depth" value={rockParams.shelfDepth as number} min={0} max={0.3} step={0.01} keyPrimary="rock:shelfDepth" />
      </div>

      {/* Detail */}
      <div className="editor-section">
        <div className="editor-section-title">Detail</div>
        <SliderRow label="Subdivisions" value={rockParams.subdivisions as number} min={2} max={6} step={1} keyPrimary="rock:subdivisions" format={(v) => v.toString()} />
        <SliderRow label="Ground Embed" value={rockParams.groundEmbed as number} min={0} max={0.5} step={0.01} keyPrimary="rock:groundEmbed" />
      </div>
    </div>
  );
}
