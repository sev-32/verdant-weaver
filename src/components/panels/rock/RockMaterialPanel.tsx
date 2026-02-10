import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockMaterialPanel() {
  const { rockParams, setRockParam } = useProVegLayout();
  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">Base Color</div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={rockParams.baseColor as string}
            onChange={(e) => setRockParam("baseColor", e.target.value)}
            className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
          />
          <span className="font-mono text-[10px] text-editor-text-value">{rockParams.baseColor as string}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] text-muted-foreground">Secondary</span>
          <input
            type="color"
            value={rockParams.secondaryColor as string}
            onChange={(e) => setRockParam("secondaryColor", e.target.value)}
            className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent"
          />
        </div>
        <SliderRow label="Color Variation" value={rockParams.baseColorVariation as number} min={0} max={0.4} step={0.01} keyPrimary="rock:baseColorVariation" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">PBR</div>
        <SliderRow label="Roughness" value={rockParams.roughness as number} min={0.1} max={1} step={0.01} keyPrimary="rock:roughness" />
        <SliderRow label="Metalness" value={rockParams.metalness as number} min={0} max={0.3} step={0.005} keyPrimary="rock:metalness" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Crystalline</div>
        <SliderRow label="Strength" value={rockParams.crystallineStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:crystallineStrength" />
        <SliderRow label="Scale" value={rockParams.crystallineScale as number} min={0.1} max={1} step={0.01} keyPrimary="rock:crystallineScale" />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Moss</div>
        <SliderRow label="Coverage" value={rockParams.mossCoverage as number} min={0} max={1} step={0.01} keyPrimary="rock:mossCoverage" />
        <SliderRow label="Threshold" value={rockParams.mossThreshold as number} min={0} max={1} step={0.01} keyPrimary="rock:mossThreshold" />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] text-muted-foreground">Moss Color</span>
          <input
            type="color"
            value={rockParams.mossColor as string}
            onChange={(e) => setRockParam("mossColor", e.target.value)}
            className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
