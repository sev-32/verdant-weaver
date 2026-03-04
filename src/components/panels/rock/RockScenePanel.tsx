import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Plus, Eye, EyeOff, Lock, Unlock, Copy } from "lucide-react";

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

export function RockScenePanel() {
  const { rockParams, seed, savedRocks, sceneRocks, saveCurrentRock, deleteSavedRock, addRockToScene, removeRockFromScene, updateSceneRock, setRockParam } = useProVegLayout();

  return (
    <div className="space-y-3">
      {/* Save */}
      <div className="editor-section">
        <div className="editor-section-title">Save Rock</div>
        <Button variant="outline" size="sm" className="w-full h-8 text-[11px] gap-1.5"
          onClick={() => saveCurrentRock(`Rock ${savedRocks.length + 1}`)}>
          <Save className="h-3 w-3" /> Save Current Configuration
        </Button>
      </div>

      {/* Library */}
      <div className="editor-section">
        <div className="editor-section-title">Library ({savedRocks.length})</div>
        {savedRocks.length === 0 ? (
          <p className="text-[10px] text-muted-foreground">No saved rocks yet</p>
        ) : (
          <div className="space-y-1">
            {savedRocks.map((rock) => (
              <div key={rock.id} className="flex items-center justify-between bg-muted/30 rounded px-2 py-1.5">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium truncate block">{rock.name}</span>
                  <span className="text-[9px] text-muted-foreground">Seed: {rock.seed}</span>
                </div>
                <div className="flex items-center gap-1 ml-1">
                  <button className="p-1 hover:bg-muted rounded" title="Add to scene" onClick={() => addRockToScene(rock.id)}>
                    <Plus className="h-3 w-3 text-primary" />
                  </button>
                  <button className="p-1 hover:bg-destructive/20 rounded" title="Delete" onClick={() => deleteSavedRock(rock.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scene Rocks */}
      <div className="editor-section">
        <div className="editor-section-title">Scene ({sceneRocks.length})</div>
        {sceneRocks.length === 0 ? (
          <p className="text-[10px] text-muted-foreground">Add rocks from library to build a scene</p>
        ) : (
          <div className="space-y-2">
            {sceneRocks.map((sr) => {
              const saved = savedRocks.find(r => r.id === sr.savedRockId);
              return (
                <div key={sr.id} className={`bg-muted/20 rounded p-2 space-y-1.5 ${!sr.visible ? "opacity-50" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium">{sr.label || saved?.name || "Unknown"}</span>
                    <div className="flex items-center gap-0.5">
                      <button className="p-1 hover:bg-muted rounded" onClick={() => updateSceneRock(sr.id, { visible: !sr.visible })}>
                        {sr.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </button>
                      <button className="p-1 hover:bg-muted rounded" onClick={() => updateSceneRock(sr.id, { locked: !sr.locked })}>
                        {sr.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      </button>
                      <button className="p-1 hover:bg-destructive/20 rounded" onClick={() => removeRockFromScene(sr.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[9px]">
                    {["X", "Y", "Z"].map((axis, i) => (
                      <div key={axis}>
                        <span className="text-muted-foreground block">{axis}</span>
                        <input type="number" step="0.1" value={sr.position[i]}
                          onChange={(e) => {
                            const pos = [...sr.position] as [number, number, number];
                            pos[i] = parseFloat(e.target.value) || 0;
                            updateSceneRock(sr.id, { position: pos });
                          }}
                          className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[9px]">
                    {["Rot X°", "Rot Y°", "Rot Z°"].map((axis, i) => (
                      <div key={axis}>
                        <span className="text-muted-foreground block">{axis}</span>
                        <input type="number" step="5"
                          value={Math.round(sr.rotation[i] * 180 / Math.PI)}
                          onChange={(e) => {
                            const rot = [...sr.rotation] as [number, number, number];
                            rot[i] = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                            updateSceneRock(sr.id, { rotation: rot });
                          }}
                          className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[9px]">
                    <div>
                      <span className="text-muted-foreground block">Scale</span>
                      <input type="number" step="0.1" min="0.1" value={sr.scale}
                        onChange={(e) => updateSceneRock(sr.id, { scale: parseFloat(e.target.value) || 1 })}
                        className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]" />
                    </div>
                    {["SX", "SY", "SZ"].map((axis, i) => (
                      <div key={axis}>
                        <span className="text-muted-foreground block">{axis}</span>
                        <input type="number" step="0.1" min="0.1" value={sr.scaleXYZ[i]}
                          onChange={(e) => {
                            const s = [...sr.scaleXYZ] as [number, number, number];
                            s[i] = parseFloat(e.target.value) || 1;
                            updateSceneRock(sr.id, { scaleXYZ: s });
                          }}
                          className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[9px]">
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={sr.mirrorX} onChange={(e) => updateSceneRock(sr.id, { mirrorX: e.target.checked })} className="w-3 h-3" />
                      <span className="text-muted-foreground">Mirror X</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={sr.mirrorZ} onChange={(e) => updateSceneRock(sr.id, { mirrorZ: e.target.checked })} className="w-3 h-3" />
                      <span className="text-muted-foreground">Mirror Z</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scatter */}
      <div className="editor-section">
        <div className="editor-section-title">Scatter / Distribute</div>
        <Toggle label="Enable Scatter" value={rockParams.sceneScatterEnabled as boolean} onChange={(v) => setRockParam("sceneScatterEnabled", v)} />
        <SliderRow label="Count" value={rockParams.sceneScatterCount as number} min={2} max={50} step={1} keyPrimary="rock:sceneScatterCount" format={(v) => v.toString()} />
        <SliderRow label="Radius" value={rockParams.sceneScatterRadius as number} min={1} max={20} step={0.5} keyPrimary="rock:sceneScatterRadius" />
        <SliderRow label="Min Scale" value={rockParams.sceneScatterMinScale as number} min={0.1} max={1} step={0.05} keyPrimary="rock:sceneScatterMinScale" />
        <SliderRow label="Max Scale" value={rockParams.sceneScatterMaxScale as number} min={0.5} max={3} step={0.1} keyPrimary="rock:sceneScatterMaxScale" />
        <SliderRow label="Size Variation" value={rockParams.sceneScatterSizeVariation as number} min={0} max={1} step={0.01} keyPrimary="rock:sceneScatterSizeVariation" />
        <SliderRow label="Shape Variation" value={rockParams.sceneScatterShapeVariation as number} min={0} max={1} step={0.01} keyPrimary="rock:sceneScatterShapeVariation" />
        <SliderRow label="Scatter Seed" value={rockParams.sceneScatterSeed as number} min={1} max={999} step={1} keyPrimary="rock:sceneScatterSeed" format={(v) => v.toString()} />
        <Toggle label="Avoid Overlap" value={rockParams.sceneScatterAvoidOverlap as boolean} onChange={(v) => setRockParam("sceneScatterAvoidOverlap", v)} />
        <Toggle label="Random Rotation" value={rockParams.sceneScatterRandomRotation as boolean} onChange={(v) => setRockParam("sceneScatterRandomRotation", v)} />
      </div>

      {/* Array */}
      <div className="editor-section">
        <div className="editor-section-title">Array / Grid</div>
        <Toggle label="Enable Array" value={rockParams.sceneArrayEnabled as boolean} onChange={(v) => setRockParam("sceneArrayEnabled", v)} />
        <SliderRow label="Count X" value={rockParams.sceneArrayCountX as number} min={1} max={10} step={1} keyPrimary="rock:sceneArrayCountX" format={(v) => v.toString()} />
        <SliderRow label="Count Z" value={rockParams.sceneArrayCountZ as number} min={1} max={10} step={1} keyPrimary="rock:sceneArrayCountZ" format={(v) => v.toString()} />
        <SliderRow label="Spacing X" value={rockParams.sceneArraySpacingX as number} min={0.5} max={10} step={0.1} keyPrimary="rock:sceneArraySpacingX" />
        <SliderRow label="Spacing Z" value={rockParams.sceneArraySpacingZ as number} min={0.5} max={10} step={0.1} keyPrimary="rock:sceneArraySpacingZ" />
        <SliderRow label="Jitter" value={rockParams.sceneArrayJitter as number} min={0} max={1} step={0.01} keyPrimary="rock:sceneArrayJitter" />
      </div>

      {/* Cluster */}
      <div className="editor-section">
        <div className="editor-section-title">Cluster</div>
        <Toggle label="Enable Cluster" value={rockParams.sceneClusterEnabled as boolean} onChange={(v) => setRockParam("sceneClusterEnabled", v)} />
        <SliderRow label="Count" value={rockParams.sceneClusterCount as number} min={2} max={12} step={1} keyPrimary="rock:sceneClusterCount" format={(v) => v.toString()} />
        <SliderRow label="Tightness" value={rockParams.sceneClusterTightness as number} min={0} max={1} step={0.01} keyPrimary="rock:sceneClusterTightness" />
        <SliderRow label="Size Dropoff" value={rockParams.sceneClusterSizeDropoff as number} min={0} max={1} step={0.01} keyPrimary="rock:sceneClusterSizeDropoff" />
        <Toggle label="Gravity Settle" value={rockParams.sceneGravitySettle as boolean} onChange={(v) => setRockParam("sceneGravitySettle", v)} />
      </div>
    </div>
  );
}
