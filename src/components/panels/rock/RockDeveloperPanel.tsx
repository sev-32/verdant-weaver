import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockDeveloperPanel() {
  const { rockParams, setRockParam } = useProVegLayout();
  return (
    <div className="space-y-3">
      {/* Quality */}
      <div className="editor-section">
        <div className="editor-section-title">Quality</div>
        <SliderRow
          label="Subdivisions"
          value={rockParams.subdivisions as number}
          min={2} max={6} step={1}
          keyPrimary="rock:subdivisions"
          format={(v) => v.toString()}
        />
        <SliderRow
          label="Shadow Resolution"
          value={rockParams.shadowQuality as number}
          min={512} max={4096} step={512}
          keyPrimary="rock:shadowQuality"
          format={(v) => v.toString()}
        />
        <SliderRow
          label="Pixel Ratio"
          value={rockParams.pixelRatio as number}
          min={0} max={3} step={0.5}
          keyPrimary="rock:pixelRatio"
          format={(v) => v === 0 ? "Auto" : v.toFixed(1)}
        />
      </div>

      {/* Rendering */}
      <div className="editor-section">
        <div className="editor-section-title">Rendering</div>
        <div className="flex items-center justify-between py-1">
          <span className="text-[11px] text-muted-foreground">Wireframe</span>
          <button
            onClick={() => setRockParam("wireframe", !(rockParams.wireframe as boolean))}
            className={`w-8 h-4 rounded-full transition-colors ${
              rockParams.wireframe ? "bg-primary" : "bg-muted"
            }`}
          >
            <div className={`w-3 h-3 rounded-full bg-foreground transition-transform mx-0.5 ${
              rockParams.wireframe ? "translate-x-4" : "translate-x-0"
            }`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-[11px] text-muted-foreground">Flat Shading</span>
          <button
            onClick={() => setRockParam("flatShading", !(rockParams.flatShading as boolean))}
            className={`w-8 h-4 rounded-full transition-colors ${
              rockParams.flatShading ? "bg-primary" : "bg-muted"
            }`}
          >
            <div className={`w-3 h-3 rounded-full bg-foreground transition-transform mx-0.5 ${
              rockParams.flatShading ? "translate-x-4" : "translate-x-0"
            }`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-[11px] text-muted-foreground">Show Normals</span>
          <button
            onClick={() => setRockParam("showNormals", !(rockParams.showNormals as boolean))}
            className={`w-8 h-4 rounded-full transition-colors ${
              rockParams.showNormals ? "bg-primary" : "bg-muted"
            }`}
          >
            <div className={`w-3 h-3 rounded-full bg-foreground transition-transform mx-0.5 ${
              rockParams.showNormals ? "translate-x-4" : "translate-x-0"
            }`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-[11px] text-muted-foreground">Show UVs</span>
          <button
            onClick={() => setRockParam("showUVs", !(rockParams.showUVs as boolean))}
            className={`w-8 h-4 rounded-full transition-colors ${
              rockParams.showUVs ? "bg-primary" : "bg-muted"
            }`}
          >
            <div className={`w-3 h-3 rounded-full bg-foreground transition-transform mx-0.5 ${
              rockParams.showUVs ? "translate-x-4" : "translate-x-0"
            }`} />
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className="editor-section">
        <div className="editor-section-title">Viewport</div>
        <SliderRow
          label="Exposure"
          value={rockParams.toneMappingExposure as number}
          min={0.3} max={3} step={0.05}
          keyPrimary="rock:toneMappingExposure"
        />
        <SliderRow
          label="Fog Density"
          value={rockParams.fogDensity as number}
          min={0} max={0.1} step={0.002}
          keyPrimary="rock:fogDensity"
        />
      </div>
    </div>
  );
}
