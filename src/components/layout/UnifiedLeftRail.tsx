import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { LEFT_PANELS } from "@/config/workspaceScenes";
import { getIcon } from "@/config/workspaceIcons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function UnifiedLeftRail() {
  const { leftPanel, leftDrawerOpen, openLeftPanel } = useProVegLayout();
  return (
    <div className="w-10 bg-editor-rail border-r border-border flex flex-col items-center py-2 gap-1 shrink-0 z-10">
      {LEFT_PANELS.map((p) => {
        const Icon = getIcon(p.icon);
        const active = leftDrawerOpen && leftPanel === p.id;
        return (
          <Tooltip key={p.id}>
            <TooltipTrigger asChild>
              <button className={`editor-rail-btn ${active ? "active" : ""}`} onClick={() => openLeftPanel(p.id)}>
                <Icon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">{p.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
