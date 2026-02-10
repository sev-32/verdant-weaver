import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { UnifiedTopBar, UnifiedLeftRail, UnifiedLeftDrawer, UnifiedRightDrawer, UnifiedRightRail, UnifiedBottomBar } from "@/components/layout";
import Tree3DPreview from "@/components/tree/Tree3DPreview";
import Rock3DPreview from "@/components/rock/Rock3DPreview";

export default function ProVegStudioPage() {
  const { treeParams, rockParams, seed, isPlaying, studioMode } = useProVegLayout();
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <UnifiedTopBar />
      <div className="flex flex-1 min-h-0">
        <UnifiedLeftRail />
        <UnifiedLeftDrawer />
        <main className="flex-1 relative bg-editor-viewport min-w-0">
          {studioMode === "tree" ? (
            <Tree3DPreview params={treeParams} seed={seed} isPlaying={isPlaying} />
          ) : (
            <Rock3DPreview params={rockParams} seed={seed} />
          )}
        </main>
        <UnifiedRightDrawer />
        <UnifiedRightRail />
      </div>
      <UnifiedBottomBar />
    </div>
  );
}
