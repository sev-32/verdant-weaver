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

export function RockCSGPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const csgModes = ["union", "intersection", "difference", "blend"];

  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">CSG Merge</div>
        <Toggle label="Enable CSG" value={rockParams.csgEnabled as boolean} onChange={(v) => setRockParam("csgEnabled", v)} />
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {csgModes.map((m) => (
            <button key={m} onClick={() => setRockParam("csgMode", m)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.csgMode === m ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-muted-foreground leading-tight">
          Union merges rocks together. Intersection keeps only overlap. Difference subtracts. Blend creates smooth transitions.
        </p>
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Crack Parameters</div>
        <SliderRow label="Crack Width" value={rockParams.csgCrackWidth as number} min={0.01} max={0.3} step={0.005} keyPrimary="rock:csgCrackWidth" />
        <SliderRow label="Crack Depth" value={rockParams.csgCrackDepth as number} min={0} max={0.5} step={0.01} keyPrimary="rock:csgCrackDepth" />
        <SliderRow label="Crack Noise" value={rockParams.csgCrackNoise as number} min={0} max={1} step={0.01} keyPrimary="rock:csgCrackNoise" />
        <SliderRow label="Fracture at Seam" value={rockParams.csgFractureAtSeam as number} min={0} max={1} step={0.01} keyPrimary="rock:csgFractureAtSeam" />
        <SliderRow label="Fracture Depth" value={rockParams.csgFractureAtSeamDepth as number} min={0} max={0.3} step={0.01} keyPrimary="rock:csgFractureAtSeamDepth" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Contact Zone</div>
        <SliderRow label="Blend Radius" value={rockParams.csgBlendRadius as number} min={0.05} max={1} step={0.01} keyPrimary="rock:csgBlendRadius" />
        <SliderRow label="Displacement" value={rockParams.csgDisplacementStrength as number} min={0} max={0.5} step={0.01} keyPrimary="rock:csgDisplacementStrength" />
        <SliderRow label="Seam Darkening" value={rockParams.csgSeamDarkening as number} min={0} max={0.5} step={0.01} keyPrimary="rock:csgSeamDarkening" />
        <SliderRow label="Seam Roughness" value={rockParams.csgSeamRoughness as number} min={0.5} max={1} step={0.01} keyPrimary="rock:csgSeamRoughness" />
        <SliderRow label="Seam Weathering" value={rockParams.csgSeamWeathering as number} min={0} max={1} step={0.01} keyPrimary="rock:csgSeamWeathering" />
        <SliderRow label="Smooth Union" value={rockParams.csgSmoothUnion as number} min={0} max={1} step={0.01} keyPrimary="rock:csgSmoothUnion" />
        <SliderRow label="Penetration" value={rockParams.csgPenetration as number} min={0} max={1} step={0.01} keyPrimary="rock:csgPenetration" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Seam Deposits</div>
        <SliderRow label="Mineral Deposit" value={rockParams.csgSeamMineralDeposit as number} min={0} max={1} step={0.01} keyPrimary="rock:csgSeamMineralDeposit" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Mineral Color</span>
          <input type="color" value={rockParams.csgSeamMineralColor as string} onChange={(e) => setRockParam("csgSeamMineralColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Moss at Seam" value={rockParams.csgMossAtSeam as number} min={0} max={1} step={0.01} keyPrimary="rock:csgMossAtSeam" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Seam Moss Color</span>
          <input type="color" value={rockParams.csgMossAtSeamColor as string} onChange={(e) => setRockParam("csgMossAtSeamColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Placement Assist</div>
        <Toggle label="Snap to Surface" value={rockParams.csgSnapToSurface as boolean} onChange={(v) => setRockParam("csgSnapToSurface", v)} />
        <Toggle label="Merge Normals" value={rockParams.csgMergeNormals as boolean} onChange={(v) => setRockParam("csgMergeNormals", v)} />
        <Toggle label="Stacking Mode" value={rockParams.csgStacking as boolean} onChange={(v) => setRockParam("csgStacking", v)} />
        <Toggle label="Stack Gravity" value={rockParams.csgStackGravity as boolean} onChange={(v) => setRockParam("csgStackGravity", v)} />
        <SliderRow label="Auto Overlap" value={rockParams.csgAutoOverlap as number} min={0} max={0.5} step={0.01} keyPrimary="rock:csgAutoOverlap" />
      </div>
    </div>
  );
}
