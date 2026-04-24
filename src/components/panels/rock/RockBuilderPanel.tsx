import { SliderRow } from "@/components/ui/SliderRow";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { Button } from "@/components/ui/button";
import { Box, Circle, Cylinder, Cone, Sparkles, Trash2, Copy, Eye, EyeOff, Layers } from "lucide-react";
import type { BuilderShapeKind } from "@/types/rockParams";

const KIND_BUTTONS: { kind: BuilderShapeKind; label: string; Icon: typeof Box }[] = [
  { kind: "box",      label: "Box",      Icon: Box },
  { kind: "sphere",   label: "Sphere",   Icon: Circle },
  { kind: "cylinder", label: "Cylinder", Icon: Cylinder },
  { kind: "cone",     label: "Cone",     Icon: Cone },
  { kind: "metaball", label: "Metaball", Icon: Sparkles },
];

function NumInput({ value, step = 0.05, onChange }: { value: number; step?: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      step={step}
      value={Number.isFinite(value) ? Number(value.toFixed(3)) : 0}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px] font-mono"
    />
  );
}

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

export function RockBuilderPanel() {
  const {
    rockParams, setRockParam,
    builderShapes, selectedBuilderShapeId,
    addBuilderShape, updateBuilderShape, removeBuilderShape,
    duplicateBuilderShape, clearBuilderShapes, setSelectedBuilderShape,
  } = useProVegLayout();

  const selected = builderShapes.find((b) => b.id === selectedBuilderShapeId) ?? null;
  const builderEnabled = !!rockParams.builderEnabled;

  return (
    <div className="space-y-3">
      {/* Master toggle + intro */}
      <div className="editor-section">
        <div className="editor-section-title">Manual Shape Builder</div>
        <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">
          Compose primitives + metaballs to define a base silhouette. The rock engine
          then displaces, erodes and textures that shape — fidelity sliders below
          control how strictly your composition is preserved.
        </p>
        <Toggle
          label="Use Builder Shape"
          value={builderEnabled}
          onChange={(v) => setRockParam("builderEnabled", v)}
        />
        <Toggle
          label="Show Wireframe Overlay"
          value={!!rockParams.builderShowOverlay}
          onChange={(v) => setRockParam("builderShowOverlay", v)}
        />
      </div>

      {/* Add primitives */}
      <div className="editor-section">
        <div className="editor-section-title">Add Shape</div>
        <div className="grid grid-cols-5 gap-1">
          {KIND_BUTTONS.map(({ kind, label, Icon }) => (
            <button
              key={kind}
              title={label}
              onClick={() => addBuilderShape(kind)}
              className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded text-[9px] bg-muted/30 hover:bg-muted/60 hover:text-primary transition-colors"
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shape list */}
      <div className="editor-section">
        <div className="flex items-center justify-between mb-1">
          <div className="editor-section-title m-0">Shapes ({builderShapes.length})</div>
          {builderShapes.length > 0 && (
            <button
              onClick={clearBuilderShapes}
              className="text-[9px] text-destructive hover:underline"
              title="Remove all"
            >Clear all</button>
          )}
        </div>
        {builderShapes.length === 0 ? (
          <p className="text-[10px] text-muted-foreground">No shapes yet. Add primitives above to start building.</p>
        ) : (
          <div className="space-y-1">
            {builderShapes.map((s) => {
              const active = s.id === selectedBuilderShapeId;
              return (
                <div
                  key={s.id}
                  className={`rounded px-2 py-1 cursor-pointer transition-colors ${
                    active ? "bg-primary/15 ring-1 ring-primary/40" : "bg-muted/20 hover:bg-muted/40"
                  }`}
                  onClick={() => setSelectedBuilderShape(s.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Layers className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <input
                        value={s.label}
                        onChange={(e) => updateBuilderShape(s.id, { label: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-transparent text-[11px] font-medium outline-none border-b border-transparent focus:border-border w-full min-w-0"
                      />
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        title={s.visible ? "Hide" : "Show"}
                        onClick={(e) => { e.stopPropagation(); updateBuilderShape(s.id, { visible: !s.visible }); }}
                        className="p-1 hover:bg-muted rounded"
                      >{s.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}</button>
                      <button
                        title="Duplicate"
                        onClick={(e) => { e.stopPropagation(); duplicateBuilderShape(s.id); }}
                        className="p-1 hover:bg-muted rounded"
                      ><Copy className="h-3 w-3" /></button>
                      <button
                        title="Delete"
                        onClick={(e) => { e.stopPropagation(); removeBuilderShape(s.id); }}
                        className="p-1 hover:bg-destructive/20 rounded"
                      ><Trash2 className="h-3 w-3 text-destructive" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[9px] text-muted-foreground">
                    <span>{s.kind}</span>
                    <span>·</span>
                    <span>{s.op}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected shape editor */}
      {selected && (
        <div className="editor-section">
          <div className="editor-section-title">Edit · {selected.label}</div>

          {/* Op (add / subtract) */}
          {selected.kind !== "metaball" && (
            <div className="flex gap-1 mb-2">
              {(["add", "subtract"] as const).map((op) => (
                <button
                  key={op}
                  onClick={() => updateBuilderShape(selected.id, { op })}
                  className={`flex-1 px-2 py-1 rounded text-[10px] transition-colors ${
                    selected.op === op ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"
                  }`}
                >{op === "add" ? "Union" : "Subtract"}</button>
              ))}
            </div>
          )}

          {/* Position */}
          <div className="mb-2">
            <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Position</span>
            <div className="grid grid-cols-3 gap-1 mt-0.5">
              {(["X", "Y", "Z"] as const).map((axis, i) => (
                <div key={axis}>
                  <span className="text-[9px] text-muted-foreground block">{axis}</span>
                  <NumInput value={selected.position[i]} onChange={(v) => {
                    const p = [...selected.position] as [number, number, number];
                    p[i] = v;
                    updateBuilderShape(selected.id, { position: p });
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation (degrees) */}
          <div className="mb-2">
            <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Rotation°</span>
            <div className="grid grid-cols-3 gap-1 mt-0.5">
              {(["X", "Y", "Z"] as const).map((axis, i) => (
                <div key={axis}>
                  <span className="text-[9px] text-muted-foreground block">{axis}</span>
                  <NumInput
                    step={5}
                    value={selected.rotation[i] * 180 / Math.PI}
                    onChange={(v) => {
                      const r = [...selected.rotation] as [number, number, number];
                      r[i] = v * Math.PI / 180;
                      updateBuilderShape(selected.id, { rotation: r });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scale (or metaball radius) */}
          {selected.kind !== "metaball" ? (
            <div className="mb-2">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wide">
                {selected.kind === "box" ? "Half-Size" : selected.kind === "sphere" ? "Radii" : "Radius / Half-Height / Radius"}
              </span>
              <div className="grid grid-cols-3 gap-1 mt-0.5">
                {(["X", "Y", "Z"] as const).map((axis, i) => (
                  <div key={axis}>
                    <span className="text-[9px] text-muted-foreground block">{axis}</span>
                    <NumInput value={selected.scale[i]} step={0.05} onChange={(v) => {
                      const sc = [...selected.scale] as [number, number, number];
                      sc[i] = Math.max(0.05, v);
                      updateBuilderShape(selected.id, { scale: sc });
                    }} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-2 grid grid-cols-2 gap-1">
              <div>
                <span className="text-[9px] text-muted-foreground block">Radius</span>
                <NumInput value={selected.blobRadius} step={0.05}
                  onChange={(v) => updateBuilderShape(selected.id, { blobRadius: Math.max(0.05, v) })} />
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground block">Strength</span>
                <NumInput value={selected.blobStrength} step={0.1}
                  onChange={(v) => updateBuilderShape(selected.id, { blobStrength: v })} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fidelity */}
      <div className="editor-section">
        <div className="editor-section-title">Shape Fidelity</div>
        <p className="text-[10px] text-muted-foreground leading-relaxed mb-1.5">
          Higher = closer to your manual composition. Lower = more procedural freedom.
        </p>
        <SliderRow label="Silhouette Lock" value={rockParams.builderSilhouetteFidelity as number}
          min={0} max={1} step={0.01} keyPrimary="rock:builderSilhouetteFidelity" />
        <SliderRow label="Surface Detail" value={rockParams.builderSurfaceFidelity as number}
          min={0} max={1} step={0.01} keyPrimary="rock:builderSurfaceFidelity" />
        <SliderRow label="Erosion Influence" value={rockParams.builderErosionFidelity as number}
          min={0} max={1} step={0.01} keyPrimary="rock:builderErosionFidelity" />
        <SliderRow label="Metaball Smoothness" value={rockParams.builderMetaballSmoothness as number}
          min={0} max={1} step={0.01} keyPrimary="rock:builderMetaballSmoothness" />
      </div>
    </div>
  );
}