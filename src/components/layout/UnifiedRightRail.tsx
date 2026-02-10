import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { RIGHT_PANELS, ROCK_RIGHT_PANELS } from "@/config/workspaceScenes";
import { getIcon } from "@/config/workspaceIcons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function UnifiedRightRail() {
  const { rightPanel, rightDrawerOpen, openRightPanel, studioMode } = useProVegLayout();
  const panels = studioMode === "rock" ? ROCK_RIGHT_PANELS : RIGHT_PANELS;
  return (
    <div className="w-10 bg-editor-rail border-l border-border flex flex-col items-center py-2 gap-1 shrink-0 z-10">
      {panels.map((p) => {
        const Icon = getIcon(p.icon);
        const active = rightDrawerOpen && rightPanel === p.id;
        return (
          <Tooltip key={p.id}>
            <TooltipTrigger asChild>
              <button className={`editor-rail-btn ${active ? "active" : ""}`} onClick={() => openRightPanel(p.id)}>
                <Icon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">{p.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
