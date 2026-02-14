import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockMaterialPanel() {
  const { rockParams, setRockParam } = useProVegLayout();
  return (
    <div className="space-y-3">
      {/* Base Color */}
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

      {/* PBR */}
      <div className="editor-section">
        <div className="editor-section-title">PBR</div>
        <SliderRow label="Roughness" value={rockParams.roughness as number} min={0.1} max={1} step={0.01} keyPrimary="rock:roughness" />
        <SliderRow label="Metalness" value={rockParams.metalness as number} min={0} max={0.3} step={0.005} keyPrimary="rock:metalness" />
      </div>

      {/* Quartz Deposits */}
      <div className="editor-section">
        <div className="editor-section-title">Quartz Deposits</div>
        <SliderRow label="Strength" value={rockParams.quartzStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzStrength" />
        <SliderRow label="Scale" value={rockParams.quartzScale as number} min={0.1} max={2} step={0.05} keyPrimary="rock:quartzScale" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input
            type="color"
            value={rockParams.quartzColor as string}
            onChange={(e) => setRockParam("quartzColor", e.target.value)}
            className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent"
          />
        </div>
        <SliderRow label="Roughness" value={rockParams.quartzRoughness as number} min={0} max={0.6} step={0.01} keyPrimary="rock:quartzRoughness" />
      </div>

      {/* Mica Glitter */}
      <div className="editor-section">
        <div className="editor-section-title">Mica / Glitter</div>
        <SliderRow label="Strength" value={rockParams.micaStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:micaStrength" />
        <SliderRow label="Density" value={rockParams.micaDensity as number} min={4} max={30} step={1} keyPrimary="rock:micaDensity" format={(v) => v.toString()} />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input
            type="color"
            value={rockParams.micaColor as string}
            onChange={(e) => setRockParam("micaColor", e.target.value)}
            className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent"
          />
        </div>
        <SliderRow label="Metalness" value={rockParams.micaMetalness as number} min={0} max={1} step={0.01} keyPrimary="rock:micaMetalness" />
      </div>

      {/* Mineral Veins */}
      <div className="editor-section">
        <div className="editor-section-title">Mineral Veins</div>
        <SliderRow label="Strength" value={rockParams.veinStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:veinStrength" />
        <SliderRow label="Scale" value={rockParams.veinScale as number} min={0.5} max={8} step={0.1} keyPrimary="rock:veinScale" />
        <SliderRow label="Thickness" value={rockParams.veinThickness as number} min={0.01} max={0.3} step={0.005} keyPrimary="rock:veinThickness" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input
            type="color"
            value={rockParams.veinColor as string}
            onChange={(e) => setRockParam("veinColor", e.target.value)}
            className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent"
          />
        </div>
        <SliderRow label="Metalness" value={rockParams.veinMetalness as number} min={0} max={0.5} step={0.01} keyPrimary="rock:veinMetalness" />
      </div>

      {/* Crystalline */}
      <div className="editor-section">
        <div className="editor-section-title">Crystalline</div>
        <SliderRow label="Strength" value={rockParams.crystallineStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:crystallineStrength" />
        <SliderRow label="Scale" value={rockParams.crystallineScale as number} min={0.1} max={1} step={0.01} keyPrimary="rock:crystallineScale" />
      </div>

      {/* Moss */}
      <div className="editor-section">
        <div className="editor-section-title">Moss</div>
        <SliderRow label="Coverage" value={rockParams.mossCoverage as number} min={0} max={1} step={0.01} keyPrimary="rock:mossCoverage" />
        <SliderRow label="Threshold" value={rockParams.mossThreshold as number} min={0} max={1} step={0.01} keyPrimary="rock:mossThreshold" />
        <SliderRow label="Height" value={rockParams.mossHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:mossHeight" />
        <SliderRow label="Variation" value={rockParams.mossVariation as number} min={0} max={0.5} step={0.01} keyPrimary="rock:mossVariation" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input
            type="color"
            value={rockParams.mossColor as string}
            onChange={(e) => setRockParam("mossColor", e.target.value)}
            className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent"
          />
        </div>
      </div>

      {/* Lichen */}
      <div className="editor-section">
        <div className="editor-section-title">Lichen</div>
        <SliderRow label="Strength" value={rockParams.lichenStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:lichenStrength" />
        <SliderRow label="Scale" value={rockParams.lichenScale as number} min={1} max={12} step={0.5} keyPrimary="rock:lichenScale" />
        <SliderRow label="Threshold" value={rockParams.lichenThreshold as number} min={0.2} max={0.9} step={0.01} keyPrimary="rock:lichenThreshold" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input
            type="color"
            value={rockParams.lichenColor as string}
            onChange={(e) => setRockParam("lichenColor", e.target.value)}
            className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
