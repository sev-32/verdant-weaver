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

export function RockTerrainPanel() {
  const { rockParams, setRockParam } = useProVegLayout();

  return (
    <div className="space-y-3">
      <div className="editor-section">
        <div className="editor-section-title">Terrain Mode</div>
        <Toggle label="Enable Terrain" value={rockParams.terrainMode as boolean} onChange={(v) => setRockParam("terrainMode", v)} />
        <p className="text-[9px] text-muted-foreground leading-tight">
          Generates a terrain heightfield instead of a rock shape. Use for mountain walls, cliff faces, and landscape features.
        </p>
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Dimensions</div>
        <SliderRow label="Width" value={rockParams.terrainWidth as number} min={2} max={50} step={0.5} keyPrimary="rock:terrainWidth" />
        <SliderRow label="Depth" value={rockParams.terrainDepth as number} min={2} max={50} step={0.5} keyPrimary="rock:terrainDepth" />
        <SliderRow label="Height" value={rockParams.terrainHeight as number} min={0.5} max={20} step={0.5} keyPrimary="rock:terrainHeight" />
        <SliderRow label="Resolution" value={rockParams.terrainResolution as number} min={32} max={512} step={32} keyPrimary="rock:terrainResolution" format={(v) => v.toString()} />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Ridges & Peaks</div>
        <SliderRow label="Ridge Strength" value={rockParams.terrainRidgeStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainRidgeStrength" />
        <SliderRow label="Ridge Frequency" value={rockParams.terrainRidgeFrequency as number} min={0.5} max={8} step={0.1} keyPrimary="rock:terrainRidgeFrequency" />
        <SliderRow label="Ridge Sharpness" value={rockParams.terrainRidgeSharpness as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainRidgeSharpness" />
        <SliderRow label="Ridge Lacunarity" value={rockParams.terrainRidgeLacunarity as number} min={1.5} max={3} step={0.05} keyPrimary="rock:terrainRidgeLacunarity" />
        <SliderRow label="Valley Depth" value={rockParams.terrainValleyDepth as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainValleyDepth" />
        <SliderRow label="Valley Width" value={rockParams.terrainValleyWidth as number} min={0.1} max={1} step={0.01} keyPrimary="rock:terrainValleyWidth" />
        <SliderRow label="Peak Count" value={rockParams.terrainPeakCount as number} min={1} max={8} step={1} keyPrimary="rock:terrainPeakCount" format={(v) => v.toString()} />
        <SliderRow label="Peak Sharpness" value={rockParams.terrainPeakSharpness as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainPeakSharpness" />
        <SliderRow label="Peak Height" value={rockParams.terrainPeakHeight as number} min={0.2} max={3} step={0.05} keyPrimary="rock:terrainPeakHeight" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Terrain Erosion</div>
        <SliderRow label="Overall Erosion" value={rockParams.terrainErosionStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainErosionStrength" />
        <SliderRow label="Thermal" value={rockParams.terrainErosionThermal as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainErosionThermal" />
        <SliderRow label="Hydraulic" value={rockParams.terrainErosionHydraulic as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainErosionHydraulic" />
        <SliderRow label="Sediment Deposit" value={rockParams.terrainSedimentDeposit as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainSedimentDeposit" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Terraces</div>
        <SliderRow label="Terrace Strength" value={rockParams.terrainTerraceStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainTerraceStrength" />
        <SliderRow label="Terrace Count" value={rockParams.terrainTerraceCount as number} min={2} max={20} step={1} keyPrimary="rock:terrainTerraceCount" format={(v) => v.toString()} />
        <SliderRow label="Terrace Sharpness" value={rockParams.terrainTerraceSharpness as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainTerraceSharpness" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Cliff Face</div>
        <SliderRow label="Cliff Strength" value={rockParams.terrainCliffStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainCliffStrength" />
        <SliderRow label="Cliff Angle" value={rockParams.terrainCliffAngle as number} min={30} max={90} step={1} keyPrimary="rock:terrainCliffAngle" format={(v) => v.toString() + "°"} />
        <SliderRow label="Cliff Noise" value={rockParams.terrainCliffNoise as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainCliffNoise" />
        <SliderRow label="Face Detail" value={rockParams.terrainCliffFaceDetail as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainCliffFaceDetail" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Strata Layers</div>
        <SliderRow label="Strata Strength" value={rockParams.terrainStrataStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainStrataStrength" />
        <SliderRow label="Layer Count" value={rockParams.terrainStrataLayers as number} min={2} max={20} step={1} keyPrimary="rock:terrainStrataLayers" format={(v) => v.toString()} />
        <SliderRow label="Strata Warp" value={rockParams.terrainStrataWarp as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainStrataWarp" />
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">Color 1</span>
          <input type="color" value={rockParams.terrainStrataColor1 as string} onChange={(e) => setRockParam("terrainStrataColor1", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">2</span>
          <input type="color" value={rockParams.terrainStrataColor2 as string} onChange={(e) => setRockParam("terrainStrataColor2", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
          <span className="text-[11px] text-muted-foreground">3</span>
          <input type="color" value={rockParams.terrainStrataColor3 as string} onChange={(e) => setRockParam("terrainStrataColor3", e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent" />
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Features</div>
        <Toggle label="Overhangs" value={rockParams.terrainOverhangEnabled as boolean} onChange={(v) => setRockParam("terrainOverhangEnabled", v)} />
        <Toggle label="Caves" value={rockParams.terrainCaveEnabled as boolean} onChange={(v) => setRockParam("terrainCaveEnabled", v)} />
        <SliderRow label="Cave Depth" value={rockParams.terrainCaveDepth as number} min={0.5} max={5} step={0.1} keyPrimary="rock:terrainCaveDepth" />
        <SliderRow label="Cave Radius" value={rockParams.terrainCaveRadius as number} min={0.2} max={2} step={0.05} keyPrimary="rock:terrainCaveRadius" />
        <SliderRow label="Cave Noise" value={rockParams.terrainCaveNoise as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainCaveNoise" />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Scree & Talus</div>
        <SliderRow label="Scree Strength" value={rockParams.terrainScreeStrength as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainScreeStrength" />
        <SliderRow label="Scree Size" value={rockParams.terrainScreeSize as number} min={0.05} max={1} step={0.01} keyPrimary="rock:terrainScreeSize" />
        <SliderRow label="Scree Angle" value={rockParams.terrainScreeAngle as number} min={15} max={60} step={1} keyPrimary="rock:terrainScreeAngle" format={(v) => v.toString() + "°"} />
        <SliderRow label="Talus" value={rockParams.terrainTalus as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainTalus" />
        <SliderRow label="Talus Angle" value={rockParams.terrainTalusAngle as number} min={15} max={50} step={1} keyPrimary="rock:terrainTalusAngle" format={(v) => v.toString() + "°"} />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">Vegetation Lines</div>
        <SliderRow label="Snow Line" value={rockParams.terrainSnowLine as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainSnowLine" />
        <SliderRow label="Snow Line Height" value={rockParams.terrainSnowLineHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainSnowLineHeight" />
        <SliderRow label="Tree Line" value={rockParams.terrainTreeLine as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainTreeLine" />
        <SliderRow label="Tree Line Height" value={rockParams.terrainTreeLineHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainTreeLineHeight" />
        <SliderRow label="Grass Line" value={rockParams.terrainGrassLine as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainGrassLine" />
        <SliderRow label="Grass Line Height" value={rockParams.terrainGrassLineHeight as number} min={0} max={1} step={0.01} keyPrimary="rock:terrainGrassLineHeight" />
      </div>
    </div>
  );
}
