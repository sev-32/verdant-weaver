import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function UnifiedBottomBar() {
  const { studioMode } = useProVegLayout();
  return (
    <div className="h-6 bg-editor-bottombar border-t border-border flex items-center px-3 shrink-0 z-20">
      <span className="text-[10px] text-editor-text-dim">
        ProVeg Studio v2 Pro — {studioMode === "rock" ? "Procedural Rock Engine" : "Procedural Vegetation Engine"}
      </span>
      <div className="flex-1" />
      <span className="text-[10px] text-editor-text-dim">WebGL2</span>
    </div>
  );
}
