import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockFoliationPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const foliationTypes = ["schistosity", "gneissic", "phyllitic", "slaty"];

  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">Foliation</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {foliationTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("foliationType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.foliationType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <SliderRow label="Strength" value={rockParams.foliationStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:foliationStrength" />
        <SliderRow label="Angle" value={rockParams.foliationAngle as number} min={-90} max={90} step={1} keyPrimary="rock:foliationAngle" format={(v) => v.toString() + "°"} />
        <SliderRow label="Waviness" value={rockParams.foliationWaviness as number} min={0} max={1} step={0.01} keyPrimary="rock:foliationWaviness" />
        <SliderRow label="Spacing" value={rockParams.foliationSpacing as number} min={0.1} max={1} step={0.01} keyPrimary="rock:foliationSpacing" />
        <SliderRow label="Contrast" value={rockParams.foliationContrast as number} min={0} max={1} step={0.01} keyPrimary="rock:foliationContrast" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.foliationColor as string} onChange={(e) => setRockParam("foliationColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Metamorphic Minerals</div>
        <SliderRow label="Mica in Foliation" value={rockParams.foliationMica as number} min={0} max={1} step={0.01} keyPrimary="rock:foliationMica" />
        <SliderRow label="Garnet Porphyroblasts" value={rockParams.foliationGarnet as number} min={0} max={1} step={0.01} keyPrimary="rock:foliationGarnet" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Garnet Color</span>
          <input type="color" value={rockParams.foliationGarnetColor as string} onChange={(e) => setRockParam("foliationGarnetColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Garnet Size" value={rockParams.foliationGarnetSize as number} min={0.1} max={1} step={0.01} keyPrimary="rock:foliationGarnetSize" />
      </div>
    </div>
  );
}
