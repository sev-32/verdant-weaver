import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { LEFT_PANELS } from "@/config/workspaceScenes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeftPresetsPanel } from "@/components/panels/LeftPresetsPanel";
import { LeftEnvironmentPanel } from "@/components/panels/LeftEnvironmentPanel";
import { LeftSeedPanel } from "@/components/panels/LeftSeedPanel";
import { RockPresetsPanel } from "@/components/panels/rock/RockPresetsPanel";
import { X } from "lucide-react";

export function UnifiedLeftDrawer() {
  const { leftDrawerOpen, leftPanel, leftDrawerWidthPx, setLeftDrawerOpen, studioMode } = useProVegLayout();
  if (!leftDrawerOpen) return null;
  const config = LEFT_PANELS.find((p) => p.id === leftPanel);
  return (
    <div className="bg-editor-drawer border-r border-border flex flex-col shrink-0 animate-fade-in z-10" style={{ width: leftDrawerWidthPx }}>
      <div className="h-9 flex items-center justify-between px-3 border-b border-border shrink-0">
        <span className="editor-panel-title">{config?.label ?? "Panel"}</span>
        <button className="editor-rail-btn h-6 w-6" onClick={() => setLeftDrawerOpen(false)}><X className="h-3 w-3" /></button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3">
          {leftPanel === "presets" && (studioMode === "rock" ? <RockPresetsPanel /> : <LeftPresetsPanel />)}
          {leftPanel === "environment" && <LeftEnvironmentPanel />}
          {leftPanel === "seed" && <LeftSeedPanel />}
          {leftPanel === "diagnostics" && <div className="text-xs text-muted-foreground">Diagnostics coming soon</div>}
        </div>
      </ScrollArea>
    </div>
  );
}
