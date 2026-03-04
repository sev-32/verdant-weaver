import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function RockMaterialPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  const micaTypes = ["muscovite", "biotite", "lepidolite", "phlogopite"];
  const veinTypes = ["calcite", "quartz", "pyrite", "gold", "copper", "iron"];

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
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Quaternary</span>
          <input type="color" value={rockParams.quaternaryColor as string} onChange={(e) => setRockParam("quaternaryColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Quaternary Strength" value={rockParams.quaternaryColorStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:quaternaryColorStrength" />
        <SliderRow label="Color Variation" value={rockParams.baseColorVariation as number} min={0} max={0.4} step={0.01} keyPrimary="rock:baseColorVariation" />
        <SliderRow label="Color Noise Scale" value={rockParams.colorNoiseScale as number} min={1} max={20} step={0.5} keyPrimary="rock:colorNoiseScale" />
        <SliderRow label="Color Noise Strength" value={rockParams.colorNoiseStrength as number} min={0} max={0.5} step={0.01} keyPrimary="rock:colorNoiseStrength" />
      </div>

      {/* PBR */}
      <div className="editor-section">
        <div className="editor-section-title">PBR</div>
        <SliderRow label="Roughness" value={rockParams.roughness as number} min={0.1} max={1} step={0.01} keyPrimary="rock:roughness" />
        <SliderRow label="Roughness Variation" value={rockParams.roughnessVariation as number} min={0} max={0.5} step={0.01} keyPrimary="rock:roughnessVariation" />
        <SliderRow label="Metalness" value={rockParams.metalness as number} min={0} max={0.3} step={0.005} keyPrimary="rock:metalness" />
        <SliderRow label="Metalness Variation" value={rockParams.metalnessVariation as number} min={0} max={0.3} step={0.01} keyPrimary="rock:metalnessVariation" />
        <SliderRow label="Specular" value={rockParams.specularStrength as number} min={0} max={2} step={0.05} keyPrimary="rock:specularStrength" />
        <SliderRow label="Anisotropy" value={rockParams.anisotropy as number} min={0} max={1} step={0.01} keyPrimary="rock:anisotropy" />
        <SliderRow label="Anisotropy Angle" value={rockParams.anisotropyAngle as number} min={0} max={360} step={1} keyPrimary="rock:anisotropyAngle" format={(v) => v.toString() + "°"} />
        <SliderRow label="Clearcoat" value={rockParams.clearcoatStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:clearcoatStrength" />
        <SliderRow label="Clearcoat Rough" value={rockParams.clearcoatRoughness as number} min={0} max={1} step={0.01} keyPrimary="rock:clearcoatRoughness" />
        <SliderRow label="Sheen" value={rockParams.sheenStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:sheenStrength" />
        <SliderRow label="Iridescence" value={rockParams.iridescenceStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:iridescenceStrength" />
        <SliderRow label="Iridescence IOR" value={rockParams.iridescenceIOR as number} min={1} max={2.5} step={0.05} keyPrimary="rock:iridescenceIOR" />
        <SliderRow label="Normal Map" value={rockParams.normalMapStrength as number} min={0} max={3} step={0.05} keyPrimary="rock:normalMapStrength" />
        <SliderRow label="AO Strength" value={rockParams.aoStrength as number} min={0} max={2} step={0.05} keyPrimary="rock:aoStrength" />
        <SliderRow label="Cavity" value={rockParams.cavityStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:cavityStrength" />
      </div>

      {/* Transmission */}
      <div className="editor-section">
        <div className="editor-section-title">Transmission / Glass</div>
        <SliderRow label="Transmission" value={rockParams.transmissionStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:transmissionStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Color</span>
          <input type="color" value={rockParams.transmissionColor as string} onChange={(e) => setRockParam("transmissionColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="IOR" value={rockParams.ior as number} min={1} max={2.5} step={0.05} keyPrimary="rock:ior" />
        <SliderRow label="Thickness" value={rockParams.thicknessFactor as number} min={0} max={2} step={0.05} keyPrimary="rock:thicknessFactor" />
      </div>

      {/* Subsurface */}
      <div className="editor-section">
        <div className="editor-section-title">Subsurface / Emissive</div>
        <SliderRow label="SSS" value={rockParams.subsurfaceScattering as number} min={0} max={1} step={0.01} keyPrimary="rock:subsurfaceScattering" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">SSS Color</span>
          <input type="color" value={rockParams.subsurfaceColor as string} onChange={(e) => setRockParam("subsurfaceColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="SSS Radius" value={rockParams.subsurfaceRadius as number} min={0.1} max={2} step={0.05} keyPrimary="rock:subsurfaceRadius" />
        <SliderRow label="Emissive" value={rockParams.emissiveStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:emissiveStrength" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Emissive Color</span>
          <input type="color" value={rockParams.emissiveColor as string} onChange={(e) => setRockParam("emissiveColor", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
        <SliderRow label="Emissive Pulse" value={rockParams.emissivePulse as number} min={0} max={1} step={0.01} keyPrimary="rock:emissivePulse" />
        <SliderRow label="Pulse Speed" value={rockParams.emissivePulseSpeed as number} min={0.1} max={5} step={0.1} keyPrimary="rock:emissivePulseSpeed" />
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
        <SliderRow label="Smoky" value={rockParams.quartzSmoky as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzSmoky" />
        <SliderRow label="Rose" value={rockParams.quartzRose as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzRose" />
        <SliderRow label="Amethyst" value={rockParams.quartzAmethyst as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzAmethyst" />
        <SliderRow label="Citrine" value={rockParams.quartzCitrine as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzCitrine" />
        <SliderRow label="Phantom" value={rockParams.quartzPhantom as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzPhantom" />
        <SliderRow label="Rutilated" value={rockParams.quartzRutilated as number} min={0} max={1} step={0.01} keyPrimary="rock:quartzRutilated" />
      </div>

      {/* Mica */}
      <div className="editor-section">
        <div className="editor-section-title">Mica / Glitter</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {micaTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("micaType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.micaType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
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
        <SliderRow label="Alignment" value={rockParams.micaAlignment as number} min={0} max={1} step={0.01} keyPrimary="rock:micaAlignment" />
        <SliderRow label="Sparkle" value={rockParams.micaSparkle as number} min={0} max={1} step={0.01} keyPrimary="rock:micaSparkle" />
      </div>

      {/* Veins */}
      <div className="editor-section">
        <div className="editor-section-title">Mineral Veins</div>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          {veinTypes.map((t) => (
            <button key={t} onClick={() => setRockParam("veinType", t)}
              className={`px-2 py-0.5 rounded text-[9px] transition-colors ${rockParams.veinType === t ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <SliderRow label="Strength" value={rockParams.veinStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:veinStrength" />
        <SliderRow label="Scale" value={rockParams.veinScale as number} min={0.5} max={8} step={0.1} keyPrimary="rock:veinScale" />
        <SliderRow label="Thickness" value={rockParams.veinThickness as number} min={0.01} max={0.3} step={0.005} keyPrimary="rock:veinThickness" />
        <SliderRow label="Waviness" value={rockParams.veinWaviness as number} min={0} max={1} step={0.01} keyPrimary="rock:veinWaviness" />
        <SliderRow label="Branching" value={rockParams.veinBranching as number} min={0} max={1} step={0.01} keyPrimary="rock:veinBranching" />
        <SliderRow label="Depth" value={rockParams.veinDepth as number} min={-0.5} max={0.5} step={0.01} keyPrimary="rock:veinDepth" />
        <SliderRow label="Glow" value={rockParams.veinGlow as number} min={0} max={1} step={0.01} keyPrimary="rock:veinGlow" />
        <SliderRow label="Network Density" value={rockParams.veinNetworkDensity as number} min={0} max={1} step={0.01} keyPrimary="rock:veinNetworkDensity" />
        <SliderRow label="Stockwork" value={rockParams.veinStockwork as number} min={0} max={1} step={0.01} keyPrimary="rock:veinStockwork" />
        <SliderRow label="Boudinage" value={rockParams.veinBoudinage as number} min={0} max={1} step={0.01} keyPrimary="rock:veinBoudinage" />
        <SliderRow label="Ptygmatic Folds" value={rockParams.veinPtygmatic as number} min={0} max={1} step={0.01} keyPrimary="rock:veinPtygmatic" />
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
        <SliderRow label="Cluster Count" value={rockParams.crystallineClusterCount as number} min={1} max={8} step={1} keyPrimary="rock:crystallineClusterCount" format={(v) => v.toString()} />
        <SliderRow label="Cluster Spread" value={rockParams.crystallineClusterSpread as number} min={0} max={1} step={0.01} keyPrimary="rock:crystallineClusterSpread" />
        <SliderRow label="Transparency" value={rockParams.crystallineTransparency as number} min={0} max={1} step={0.01} keyPrimary="rock:crystallineTransparency" />
        <SliderRow label="Internal Fractures" value={rockParams.crystallineInternalFractures as number} min={0} max={1} step={0.01} keyPrimary="rock:crystallineInternalFractures" />
      </div>
    </div>
  );
}
