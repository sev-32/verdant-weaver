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

export function RockDeveloperPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const toneMappingTypes = ["aces", "reinhard", "cineon", "linear"];
  const antialiasTypes = ["msaa", "fxaa", "smaa", "none"];

  return (
    <div className="space-y-3">
      {/* Quality */}
      <div className="editor-section">
        <div className="editor-section-title">Quality</div>
        <SliderRow label="Subdivisions" value={rockParams.subdivisions as number} min={2} max={6} step={1} keyPrimary="rock:subdivisions" format={(v) => v.toString()} />
        <SliderRow label="Shadow Resolution" value={rockParams.shadowQuality as number} min={512} max={4096} step={512} keyPrimary="rock:shadowQuality" format={(v) => v.toString()} />
        <SliderRow label="Pixel Ratio" value={rockParams.pixelRatio as number} min={0} max={3} step={0.5} keyPrimary="rock:pixelRatio" format={(v) => v === 0 ? "Auto" : v.toFixed(1)} />
        <SliderRow label="Max Texture Size" value={rockParams.maxTextureSize as number} min={512} max={4096} step={512} keyPrimary="rock:maxTextureSize" format={(v) => v.toString()} />
        <SliderRow label="Anisotropic Filter" value={rockParams.anisotropicFiltering as number} min={1} max={16} step={1} keyPrimary="rock:anisotropicFiltering" format={(v) => v.toString() + "x"} />
        <SliderRow label="Shadow Bias" value={rockParams.shadowBias as number} min={-0.01} max={0} step={0.0005} keyPrimary="rock:shadowBias" format={(v) => v.toFixed(4)} />
      </div>

      {/* Tone Mapping */}
      <div className="editor-section">
        <div className="editor-section-title">Tone Mapping</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {toneMappingTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("toneMappingType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.toneMappingType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <SliderRow label="Exposure" value={rockParams.toneMappingExposure as number} min={0.3} max={3} step={0.05} keyPrimary="rock:toneMappingExposure" />
        <SliderRow label="Env Map Intensity" value={rockParams.envMapIntensity as number} min={0} max={3} step={0.1} keyPrimary="rock:envMapIntensity" />
      </div>

      {/* Anti-Aliasing */}
      <div className="editor-section">
        <div className="editor-section-title">Anti-Aliasing</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {antialiasTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("antialiasType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.antialiasType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Post-Processing */}
      <div className="editor-section">
        <div className="editor-section-title">Post-Processing</div>
        <Toggle label="SSAO" value={rockParams.enableSSAO as boolean} onChange={(v) => setRockParam("enableSSAO", v)} />
        <SliderRow label="SSAO Radius" value={rockParams.ssaoRadius as number} min={0.1} max={2} step={0.05} keyPrimary="rock:ssaoRadius" />
        <SliderRow label="SSAO Intensity" value={rockParams.ssaoIntensity as number} min={0} max={3} step={0.1} keyPrimary="rock:ssaoIntensity" />
        <Toggle label="Bloom" value={rockParams.enableBloom as boolean} onChange={(v) => setRockParam("enableBloom", v)} />
        <SliderRow label="Bloom Threshold" value={rockParams.bloomThreshold as number} min={0} max={2} step={0.05} keyPrimary="rock:bloomThreshold" />
        <SliderRow label="Bloom Strength" value={rockParams.bloomStrength as number} min={0} max={2} step={0.05} keyPrimary="rock:bloomStrength" />
        <SliderRow label="Bloom Radius" value={rockParams.bloomRadius as number} min={0} max={1} step={0.05} keyPrimary="rock:bloomRadius" />
      </div>

      {/* Fog */}
      <div className="editor-section">
        <div className="editor-section-title">Fog</div>
        <SliderRow label="Density" value={rockParams.fogDensity as number} min={0} max={0.1} step={0.002} keyPrimary="rock:fogDensity" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.fogColor as string} onChange={(e) => setRockParam("fogColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      {/* Rendering Debug */}
      <div className="editor-section">
        <div className="editor-section-title">Debug Overlays</div>
        <Toggle label="Wireframe" value={rockParams.wireframe as boolean} onChange={(v) => setRockParam("wireframe", v)} />
        <Toggle label="Flat Shading" value={rockParams.flatShading as boolean} onChange={(v) => setRockParam("flatShading", v)} />
        <Toggle label="Show Normals" value={rockParams.showNormals as boolean} onChange={(v) => setRockParam("showNormals", v)} />
        <Toggle label="Show UVs" value={rockParams.showUVs as boolean} onChange={(v) => setRockParam("showUVs", v)} />
        <Toggle label="Show Bounding Box" value={rockParams.showBoundingBox as boolean} onChange={(v) => setRockParam("showBoundingBox", v)} />
        <Toggle label="Vertex Colors" value={rockParams.showVertexColors as boolean} onChange={(v) => setRockParam("showVertexColors", v)} />
        <Toggle label="Show Axes" value={rockParams.showAxesHelper as boolean} onChange={(v) => setRockParam("showAxesHelper", v)} />
        <Toggle label="Show Stats" value={rockParams.showStats as boolean} onChange={(v) => setRockParam("showStats", v)} />
      </div>

      {/* Grid */}
      <div className="editor-section">
        <div className="editor-section-title">Grid</div>
        <SliderRow label="Opacity" value={rockParams.gridOpacity as number} min={0} max={1} step={0.05} keyPrimary="rock:gridOpacity" />
        <SliderRow label="Size" value={rockParams.gridSize as number} min={10} max={100} step={5} keyPrimary="rock:gridSize" format={(v) => v.toString()} />
        <SliderRow label="Ground Reflection" value={rockParams.groundReflection as number} min={0} max={1} step={0.05} keyPrimary="rock:groundReflection" />
      </div>
    </div>
  );
}
