import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";

export function LeftEnvironmentPanel() {
  const { treeParams, viewportSettings, setViewportSettings } = useProVegLayout();
  const get = (p: string, a: string, d: number) => (treeParams[p] ?? treeParams[a] ?? d) as number;
  return (
    <div className="space-y-4">
      <div className="editor-section">
        <div className="editor-section-title">Lighting</div>
        <SliderRow label="Exposure" value={viewportSettings.exposure} min={0.2} max={3} step={0.05} keyPrimary="__exposure" format={(v) => v.toFixed(2)} />
        <SliderRow label="Ambient" value={viewportSettings.ambientLightIntensity} min={0} max={1} step={0.05} keyPrimary="__ambient" format={(v) => v.toFixed(2)} />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Environment</div>
        <SliderRow label="Time of Day" value={get("timeOfDay", "vegetation.env.timeOfDay", 0.45)} min={0} max={1} step={0.01} keyPrimary="timeOfDay" keyAlt="vegetation.env.timeOfDay" />
        <SliderRow label="Moisture" value={get("moisture", "vegetation.env.moisture", 0.55)} min={0} max={1} step={0.01} keyPrimary="moisture" keyAlt="vegetation.env.moisture" />
        <SliderRow label="Shadow Strength" value={get("contactShadowStrength", "vegetation.env.contactShadowStrength", 0.62)} min={0} max={1} step={0.01} keyPrimary="contactShadowStrength" keyAlt="vegetation.env.contactShadowStrength" />
      </div>
    </div>
  );
}
