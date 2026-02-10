import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { RIGHT_PANELS, ROCK_RIGHT_PANELS } from "@/config/workspaceScenes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getIcon } from "@/config/workspaceIcons";
import { TrunkPanel } from "@/components/panels/right/TrunkPanel";
import { BranchingPanel } from "@/components/panels/right/BranchingPanel";
import { LeavesPanel } from "@/components/panels/right/LeavesPanel";
import { BarkRootsPanel } from "@/components/panels/right/BarkRootsPanel";
import { WindLODPanel } from "@/components/panels/right/WindLODPanel";
import { SpaceColonizationPanel } from "@/components/panels/right/SpaceColonizationPanel";
import { RockShapePanel } from "@/components/panels/rock/RockShapePanel";
import { RockDisplacementPanel } from "@/components/panels/rock/RockDisplacementPanel";
import { RockErosionPanel } from "@/components/panels/rock/RockErosionPanel";
import { RockMaterialPanel } from "@/components/panels/rock/RockMaterialPanel";
import { X } from "lucide-react";

export function UnifiedRightDrawer() {
  const { rightDrawerOpen, rightPanel, rightSubTab, rightDrawerWidthPx, setRightDrawerOpen, setRightSubTab, studioMode } = useProVegLayout();
  if (!rightDrawerOpen) return null;

  const panels = studioMode === "rock" ? ROCK_RIGHT_PANELS : RIGHT_PANELS;
  const config = panels.find((p) => p.id === rightPanel);
  const effectiveSubTab = rightSubTab || config?.subTabs[0]?.id || "";

  return (
    <div className="bg-editor-drawer border-l border-border flex flex-col shrink-0 animate-fade-in z-10" style={{ width: rightDrawerWidthPx }}>
      <div className="h-9 flex items-center justify-between px-3 border-b border-border shrink-0">
        <span className="editor-panel-title">{config?.label ?? "Panel"}</span>
        <button className="editor-rail-btn h-6 w-6" onClick={() => setRightDrawerOpen(false)}><X className="h-3 w-3" /></button>
      </div>
      {config?.subTabs && config.subTabs.length > 0 && (
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border overflow-x-auto shrink-0">
          {config.subTabs.map((st) => {
            const Icon = getIcon(st.icon);
            const active = effectiveSubTab === st.id;
            return (
              <button
                key={st.id}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-editor-hover"}`}
                onClick={() => setRightSubTab(st.id)}
              >
                <Icon className="h-3 w-3" />
                {st.label}
              </button>
            );
          })}
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* Tree panels */}
          {rightPanel === "trunk" && <TrunkPanel subTab={effectiveSubTab} />}
          {rightPanel === "branching" && <BranchingPanel subTab={effectiveSubTab} />}
          {rightPanel === "leaves" && <LeavesPanel subTab={effectiveSubTab} />}
          {rightPanel === "bark-roots" && <BarkRootsPanel subTab={effectiveSubTab} />}
          {rightPanel === "wind-lod" && <WindLODPanel subTab={effectiveSubTab} />}
          {rightPanel === "space-colonization" && <SpaceColonizationPanel subTab={effectiveSubTab} />}
          {/* Rock panels */}
          {rightPanel === "rock-shape" && <RockShapePanel />}
          {rightPanel === "rock-displacement" && <RockDisplacementPanel />}
          {rightPanel === "rock-erosion" && <RockErosionPanel />}
          {rightPanel === "rock-material" && <RockMaterialPanel />}
        </div>
      </ScrollArea>
    </div>
  );
}
