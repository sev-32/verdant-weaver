import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockCSGPanel() {
  const { rockParams, setRockParam } = useProVegLayout();
  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">CSG Merge</div>
        <div className="flex items-center justify-between py-1">
          <span className="text-[11px] text-muted-foreground">Enable CSG</span>
          <button
            onClick={() => setRockParam("csgEnabled", !(rockParams.csgEnabled as boolean))}
            className={`w-8 h-4 rounded-full transition-colors ${rockParams.csgEnabled ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`w-3 h-3 rounded-full bg-foreground transition-transform mx-0.5 ${rockParams.csgEnabled ? "translate-x-4" : "translate-x-0"}`} />
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground leading-tight">
          When enabled, overlapping scene rocks are merged with procedural cracks and displacement at contact seams.
        </p>
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Crack Parameters</div>
        <SliderRow label="Crack Width" value={rockParams.csgCrackWidth as number} min={0.01} max={0.3} step={0.005} keyPrimary="rock:csgCrackWidth" />
        <SliderRow label="Crack Depth" value={rockParams.csgCrackDepth as number} min={0} max={0.5} step={0.01} keyPrimary="rock:csgCrackDepth" />
        <SliderRow label="Crack Noise" value={rockParams.csgCrackNoise as number} min={0} max={1} step={0.01} keyPrimary="rock:csgCrackNoise" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Contact Zone</div>
        <SliderRow label="Blend Radius" value={rockParams.csgBlendRadius as number} min={0.05} max={1} step={0.01} keyPrimary="rock:csgBlendRadius" />
        <SliderRow label="Displacement" value={rockParams.csgDisplacementStrength as number} min={0} max={0.5} step={0.01} keyPrimary="rock:csgDisplacementStrength" />
        <SliderRow label="Seam Darkening" value={rockParams.csgSeamDarkening as number} min={0} max={0.5} step={0.01} keyPrimary="rock:csgSeamDarkening" />
        <SliderRow label="Seam Roughness" value={rockParams.csgSeamRoughness as number} min={0.5} max={1} step={0.01} keyPrimary="rock:csgSeamRoughness" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Seam Growth</div>
        <SliderRow label="Moss at Seam" value={rockParams.csgMossAtSeam as number} min={0} max={1} step={0.01} keyPrimary="rock:csgMossAtSeam" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Seam Moss Color</span>
          <input type="color" value={rockParams.csgMossAtSeamColor as string} onChange={(e) => setRockParam("csgMossAtSeamColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>
    </div>
  );
}
