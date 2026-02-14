import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { Button } from "@/components/ui/button";
import type { SavedRock } from "@/types/rockParams";
import { Save, Trash2, Plus } from "lucide-react";

export function RockScenePanel() {
  const { rockParams, seed, savedRocks, sceneRocks, saveCurrentRock, deleteSavedRock, addRockToScene, removeRockFromScene, updateSceneRock } = useProVegLayout();

  return (
    <div className="space-y-3">
      {/* Save Current */}
      <div className="editor-section">
        <div className="editor-section-title">Save Rock</div>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-[11px] gap-1.5"
          onClick={() => {
            const name = `Rock ${savedRocks.length + 1}`;
            saveCurrentRock(name);
          }}
        >
          <Save className="h-3 w-3" />
          Save Current Configuration
        </Button>
      </div>

      {/* Saved Rocks Library */}
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
                  <button
                    className="p-1 hover:bg-muted rounded transition-colors"
                    title="Add to scene"
                    onClick={() => addRockToScene(rock.id)}
                  >
                    <Plus className="h-3 w-3 text-primary" />
                  </button>
                  <button
                    className="p-1 hover:bg-destructive/20 rounded transition-colors"
                    title="Delete"
                    onClick={() => deleteSavedRock(rock.id)}
                  >
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
            {sceneRocks.map((sr, idx) => {
              const saved = savedRocks.find(r => r.id === sr.savedRockId);
              return (
                <div key={sr.id} className="bg-muted/20 rounded p-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium">{saved?.name || "Unknown"}</span>
                    <button
                      className="p-1 hover:bg-destructive/20 rounded"
                      onClick={() => removeRockFromScene(sr.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[9px]">
                    <div>
                      <span className="text-muted-foreground block">X</span>
                      <input
                        type="number"
                        step="0.1"
                        value={sr.position[0]}
                        onChange={(e) => updateSceneRock(sr.id, { position: [parseFloat(e.target.value) || 0, sr.position[1], sr.position[2]] })}
                        className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Y</span>
                      <input
                        type="number"
                        step="0.1"
                        value={sr.position[1]}
                        onChange={(e) => updateSceneRock(sr.id, { position: [sr.position[0], parseFloat(e.target.value) || 0, sr.position[2]] })}
                        className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Z</span>
                      <input
                        type="number"
                        step="0.1"
                        value={sr.position[2]}
                        onChange={(e) => updateSceneRock(sr.id, { position: [sr.position[0], sr.position[1], parseFloat(e.target.value) || 0] })}
                        className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[9px]">
                    <div>
                      <span className="text-muted-foreground block">Rot X°</span>
                      <input
                        type="number"
                        step="5"
                        value={Math.round(sr.rotation[0] * 180 / Math.PI)}
                        onChange={(e) => updateSceneRock(sr.id, { rotation: [(parseFloat(e.target.value) || 0) * Math.PI / 180, sr.rotation[1], sr.rotation[2]] })}
                        className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Rot Y°</span>
                      <input
                        type="number"
                        step="5"
                        value={Math.round(sr.rotation[1] * 180 / Math.PI)}
                        onChange={(e) => updateSceneRock(sr.id, { rotation: [sr.rotation[0], (parseFloat(e.target.value) || 0) * Math.PI / 180, sr.rotation[2]] })}
                        className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Scale</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={sr.scale}
                        onChange={(e) => updateSceneRock(sr.id, { scale: parseFloat(e.target.value) || 1 })}
                        className="w-full bg-background border border-border rounded px-1 py-0.5 text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
