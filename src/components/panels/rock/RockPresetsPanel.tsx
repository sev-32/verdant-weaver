import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { Button } from "@/components/ui/button";
import { ROCK_PRESETS } from "@/types/rockParams";

export function RockPresetsPanel() {
  const { rockParams, setRockParams, resetRockToDefaults } = useProVegLayout();
  return (
    <div className="space-y-2">
      <div className="editor-section-title">Rock Type Presets</div>
      <div className="grid grid-cols-2 gap-1.5">
        {ROCK_PRESETS.map((p) => (
          <Button
            key={p.id}
            variant="outline"
            size="sm"
            className="h-auto py-2 px-2 text-left flex flex-col items-start gap-0.5"
            onClick={() => setRockParams({ ...rockParams, ...p.params })}
          >
            <span className="text-[11px] font-medium">{p.name}</span>
            <span className="text-[9px] text-muted-foreground leading-tight">{p.description}</span>
          </Button>
        ))}
      </div>
      <div className="pt-2">
        <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground w-full" onClick={resetRockToDefaults}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
