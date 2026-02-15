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
          <input type="color" value={rockParams.baseColor as string} onChange={(e) => setRockParam("baseColor", e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent" />
          <span className="font-mono text-[10px] text-editor-text-value">{rockParams.baseColor as string}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] text-muted-foreground">Secondary</span>
          <input type="color" value={rockParams.secondaryColor as string} onChange={(e) => setRockParam("secondaryColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Tertiary</span>
          <input type="color" value={rockParams.tertiaryColor as string} onChange={(e) => setRockParam("tertiaryColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Tertiary Strength" value={rockParams.tertiaryColorStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:tertiaryColorStrength" />
        <SliderRow label="Color Variation" value={rockParams.baseColorVariation as number} min={0} max={0.4} step={0.01} keyPrimary="rock:baseColorVariation" />
      </div>

      {/* PBR */}
      <div className="editor-section">
        <div className="editor-section-title">PBR</div>
        <SliderRow label="Roughness" value={rockParams.roughness as number} min={0.1} max={1} step={0.01} keyPrimary="rock:roughness" />
        <SliderRow label="Metalness" value={rockParams.metalness as number} min={0} max={0.3} step={0.005} keyPrimary="rock:metalness" />
        <SliderRow label="Specular" value={rockParams.specularStrength as number} min={0} max={2} step={0.05} keyPrimary="rock:specularStrength" />
        <SliderRow label="Anisotropy" value={rockParams.anisotropy as number} min={0} max={1} step={0.01} keyPrimary="rock:anisotropy" />
        <SliderRow label="Clearcoat" value={rockParams.clearcoatStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:clearcoatStrength" />
        <SliderRow label="Clearcoat Rough" value={rockParams.clearcoatRoughness as number} min={0} max={1} step={0.01} keyPrimary="rock:clearcoatRoughness" />
        <SliderRow label="Sheen" value={rockParams.sheenStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:sheenStrength" />
        <SliderRow label="Iridescence" value={rockParams.iridescenceStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:iridescenceStrength" />
      </div>

      {/* Subsurface */}
      <div className="editor-section">
        <div className="editor-section-title">Subsurface / Emissive</div>
        <SliderRow label="SSS" value={rockParams.subsurfaceScattering as number} min={0} max={1} step={0.01} keyPrimary="rock:subsurfaceScattering" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">SSS Color</span>
          <input type="color" value={rockParams.subsurfaceColor as string} onChange={(e) => setRockParam("subsurfaceColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Emissive" value={rockParams.emissiveStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:emissiveStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Emissive Color</span>
          <input type="color" value={rockParams.emissiveColor as string} onChange={(e) => setRockParam("emissiveColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      {/* Quartz */}
      <div className="editor-section">
        <div className="editor-section-title">Quartz Deposits</div>
        <SliderRow label="Strength" value={rockParams.quartzStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzStrength" />
        <SliderRow label="Scale" value={rockParams.quartzScale as number} min={0.1} max={2} step={0.05} keyPrimary="rock:quartzScale" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.quartzColor as string} onChange={(e) => setRockParam("quartzColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Roughness" value={rockParams.quartzRoughness as number} min={0} max={0.6} step={0.01} keyPrimary="rock:quartzRoughness" />
        <SliderRow label="Translucency" value={rockParams.quartzTranslucency as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzTranslucency" />
        <SliderRow label="Cluster Size" value={rockParams.quartzClusterSize as number} min={0.1} max={1} step={0.05} keyPrimary="rock:quartzClusterSize" />
        <SliderRow label="Cluster Density" value={rockParams.quartzClusterDensity as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzClusterDensity" />
        <SliderRow label="Inclusions" value={rockParams.quartzInclusions as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzInclusions" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Inclusion Color</span>
          <input type="color" value={rockParams.quartzInclusionColor as string} onChange={(e) => setRockParam("quartzInclusionColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      {/* Mica */}
      <div className="editor-section">
        <div className="editor-section-title">Mica / Glitter</div>
        <SliderRow label="Strength" value={rockParams.micaStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:micaStrength" />
        <SliderRow label="Density" value={rockParams.micaDensity as number} min={4} max={30} step={1} keyPrimary="rock:micaDensity" format={(v) => v.toString()} />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.micaColor as string} onChange={(e) => setRockParam("micaColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Metalness" value={rockParams.micaMetalness as number} min={0} max={1} step={0.01} keyPrimary="rock:micaMetalness" />
        <SliderRow label="Flake Size" value={rockParams.micaSize as number} min={0.1} max={1} step={0.05} keyPrimary="rock:micaSize" />
        <SliderRow label="Angle Spread" value={rockParams.micaAngleSpread as number} min={0} max={1} step={0.01} keyPrimary="rock:micaAngleSpread" />
        <SliderRow label="Flake Roughness" value={rockParams.micaFlakeRoughness as number} min={0} max={0.5} step={0.01} keyPrimary="rock:micaFlakeRoughness" />
      </div>

      {/* Veins */}
      <div className="editor-section">
        <div className="editor-section-title">Mineral Veins</div>
        <SliderRow label="Strength" value={rockParams.veinStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:veinStrength" />
        <SliderRow label="Scale" value={rockParams.veinScale as number} min={0.5} max={8} step={0.1} keyPrimary="rock:veinScale" />
        <SliderRow label="Thickness" value={rockParams.veinThickness as number} min={0.01} max={0.3} step={0.005} keyPrimary="rock:veinThickness" />
        <SliderRow label="Waviness" value={rockParams.veinWaviness as number} min={0} max={1} step={0.01} keyPrimary="rock:veinWaviness" />
        <SliderRow label="Branching" value={rockParams.veinBranching as number} min={0} max={1} step={0.01} keyPrimary="rock:veinBranching" />
        <SliderRow label="Depth" value={rockParams.veinDepth as number} min={-0.5} max={0.5} step={0.01} keyPrimary="rock:veinDepth" />
        <SliderRow label="Glow" value={rockParams.veinGlow as number} min={0} max={1} step={0.01} keyPrimary="rock:veinGlow" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Primary</span>
          <input type="color" value={rockParams.veinColor as string} onChange={(e) => setRockParam("veinColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">Secondary</span>
          <input type="color" value={rockParams.veinSecondaryColor as string} onChange={(e) => setRockParam("veinSecondaryColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Secondary Strength" value={rockParams.veinSecondaryStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:veinSecondaryStrength" />
        <SliderRow label="Metalness" value={rockParams.veinMetalness as number} min={0} max={0.5} step={0.01} keyPrimary="rock:veinMetalness" />
      </div>

      {/* Crystalline */}
      <div className="editor-section">
        <div className="editor-section-title">Crystalline</div>
        <SliderRow label="Strength" value={rockParams.crystallineStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:crystallineStrength" />
        <SliderRow label="Scale" value={rockParams.crystallineScale as number} min={0.1} max={1} step={0.01} keyPrimary="rock:crystallineScale" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.crystallineColor as string} onChange={(e) => setRockParam("crystallineColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Facets" value={rockParams.crystallineFacets as number} min={3} max={16} step={1} keyPrimary="rock:crystallineFacets" format={(v) => v.toString()} />
        <SliderRow label="Sharpness" value={rockParams.crystallineSharpness as number} min={0} max={1} step={0.01} keyPrimary="rock:crystallineSharpness" />
        <SliderRow label="Metalness" value={rockParams.crystallineMetalness as number} min={0} max={0.5} step={0.01} keyPrimary="rock:crystallineMetalness" />
        <SliderRow label="Roughness" value={rockParams.crystallineRoughness as number} min={0} max={0.5} step={0.01} keyPrimary="rock:crystallineRoughness" />
        <SliderRow label="Emissive" value={rockParams.crystallineEmissive as number} min={0} max={1} step={0.01} keyPrimary="rock:crystallineEmissive" />
        <SliderRow label="Dispersion" value={rockParams.crystallineDispersion as number} min={0} max={0.5} step={0.01} keyPrimary="rock:crystallineDispersion" />
      </div>
    </div>
  );
}
