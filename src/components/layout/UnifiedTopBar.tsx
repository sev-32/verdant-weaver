import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, Shuffle, BarChart3, PanelRightClose } from "lucide-react";

export function UnifiedTopBar() {
  const { seed, setSeed, isPlaying, setIsPlaying, showStats, setShowStats, rightDrawerOpen, setRightDrawerOpen } = useProVegLayout();
  return (
    <header className="h-11 flex items-center justify-between px-3 bg-editor-topbar border-b border-border shrink-0 z-20">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold tracking-wide text-primary">ProVeg Studio</span>
        <span className="text-[10px] text-muted-foreground">v2 Pro</span>
        <div className="h-4 w-px bg-border mx-1" />
        <span className="font-mono text-[11px] text-editor-text-value">Seed {seed}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSeed(Math.floor(Math.random() * 100000))}>
          <Shuffle className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? "Pause wind" : "Play wind"}>
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className={`h-7 w-7 ${showStats ? "text-primary" : ""}`} onClick={() => setShowStats(!showStats)}>
          <BarChart3 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setRightDrawerOpen(!rightDrawerOpen)}>
          <PanelRightClose className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  );
}
