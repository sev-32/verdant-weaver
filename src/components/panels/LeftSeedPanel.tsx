import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { SliderRow } from "@/components/ui/SliderRow";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

export function LeftSeedPanel() {
  const { seed, setSeed, treeParams } = useProVegLayout();
  const age = (treeParams.age01 ?? 1.0) as number;
  return (
    <div className="space-y-4">
      <div className="editor-section">
        <div className="editor-section-title">Seed</div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-editor-text-value flex-1">{seed}</span>
          <Button variant="outline" size="sm" className="h-7" onClick={() => setSeed(Math.floor(Math.random() * 100000))}>
            <Shuffle className="h-3 w-3 mr-1" /> Random
          </Button>
        </div>
      </div>
      <div className="editor-section">
        <div className="editor-section-title">Age</div>
        <SliderRow label="Growth (0–1)" value={age} min={0} max={1} step={0.01} keyPrimary="age01" keyAlt="vegetation.instance.age01" />
      </div>
    </div>
  );
}
