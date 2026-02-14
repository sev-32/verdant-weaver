import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

export function UnifiedBottomBar() {
  const { studioMode, rockParams, savedRocks, sceneRocks } = useProVegLayout();
  const subs = (rockParams.subdivisions as number) || 5;
  const vertEst = studioMode === "rock" ? Math.pow(4, subs) * 10 + 2 : 0;

  return (
    <div className="h-7 bg-editor-bottombar border-t border-border flex items-center px-3 shrink-0 z-20 gap-4">
      <span className="text-[10px] text-editor-text-dim">
        ProVeg Studio v2 Pro — {studioMode === "rock" ? "Procedural Rock Engine" : "Procedural Vegetation Engine"}
      </span>
      <div className="flex-1" />
      {studioMode === "rock" && (
        <>
          <span className="text-[10px] text-muted-foreground">
            Verts: ~{vertEst.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Saved: {savedRocks.length}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Scene: {sceneRocks.length}
          </span>
        </>
      )}
      <span className="text-[10px] text-editor-text-dim">WebGL2</span>
    </div>
  );
}
