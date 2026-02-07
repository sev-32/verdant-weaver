import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { Button } from "@/components/ui/button";

const PRESETS = [
  { name: "Oak", params: { height: 12, "vegetation.species.heightBase_m": 12, baseRadius: 0.5, "vegetation.trunk.baseRadius_m": 0.5, taperExponent: 0.65, "vegetation.trunk.taperExponent": 0.65, branchCount: 8, "vegetation.branching.mainBranchCount": 8, branchAngle: 40, "vegetation.branching.angleMean_deg": 40, trunkColor: "#5d4037", "vegetation.trunk.barkColor": "#5d4037", leafColor: "#3d6b35", "vegetation.leaves.colorBase": "#3d6b35", speciesProfile: "OAK_MAPLE", "vegetation.species.profile": "OAK_MAPLE", leafShape: "LOBED", "vegetation.leaves.shape": "LOBED" }},
  { name: "Pine", params: { height: 18, "vegetation.species.heightBase_m": 18, baseRadius: 0.38, "vegetation.trunk.baseRadius_m": 0.38, taperExponent: 0.92, "vegetation.trunk.taperExponent": 0.92, branchCount: 13, "vegetation.branching.mainBranchCount": 13, branchAngle: 22, "vegetation.branching.angleMean_deg": 22, trunkColor: "#7a4a24", "vegetation.trunk.barkColor": "#7a4a24", leafColor: "#1f5d2a", "vegetation.leaves.colorBase": "#1f5d2a", speciesProfile: "PINE_CONIFER", "vegetation.species.profile": "PINE_CONIFER", leafShape: "NEEDLE", "vegetation.leaves.shape": "NEEDLE" }},
  { name: "Birch", params: { height: 10, "vegetation.species.heightBase_m": 10, baseRadius: 0.25, "vegetation.trunk.baseRadius_m": 0.25, taperExponent: 0.85, "vegetation.trunk.taperExponent": 0.85, branchCount: 6, "vegetation.branching.mainBranchCount": 6, branchAngle: 30, "vegetation.branching.angleMean_deg": 30, trunkColor: "#f5f5f5", "vegetation.trunk.barkColor": "#f5f5f5", leafColor: "#7cb342", "vegetation.leaves.colorBase": "#7cb342", speciesProfile: "BIRCH_UPRIGHT", "vegetation.species.profile": "BIRCH_UPRIGHT", leafShape: "BROADLEAF", "vegetation.leaves.shape": "BROADLEAF" }},
  { name: "Willow", params: { height: 8, "vegetation.species.heightBase_m": 8, baseRadius: 0.4, "vegetation.trunk.baseRadius_m": 0.4, taperExponent: 0.6, "vegetation.trunk.taperExponent": 0.6, branchCount: 10, "vegetation.branching.mainBranchCount": 10, branchAngle: 50, "vegetation.branching.angleMean_deg": 50, trunkColor: "#6d5c4d", "vegetation.trunk.barkColor": "#6d5c4d", leafColor: "#8bc34a", "vegetation.leaves.colorBase": "#8bc34a", speciesProfile: "WILLOW_WEEPING", "vegetation.species.profile": "WILLOW_WEEPING", leafShape: "COMPOUND", "vegetation.leaves.shape": "COMPOUND" }},
  { name: "Spruce", params: { height: 21, "vegetation.species.heightBase_m": 21, baseRadius: 0.34, "vegetation.trunk.baseRadius_m": 0.34, taperExponent: 1.02, "vegetation.trunk.taperExponent": 1.02, branchCount: 15, "vegetation.branching.mainBranchCount": 15, branchAngle: 18, "vegetation.branching.angleMean_deg": 18, trunkColor: "#6a4d30", "vegetation.trunk.barkColor": "#6a4d30", leafColor: "#2d5b2d", "vegetation.leaves.colorBase": "#2d5b2d", speciesProfile: "SPRUCE_CONICAL", "vegetation.species.profile": "SPRUCE_CONICAL", leafShape: "NEEDLE", "vegetation.leaves.shape": "NEEDLE" }},
  { name: "Acacia", params: { height: 11, "vegetation.species.heightBase_m": 11, baseRadius: 0.48, "vegetation.trunk.baseRadius_m": 0.48, taperExponent: 0.62, "vegetation.trunk.taperExponent": 0.62, branchCount: 7, "vegetation.branching.mainBranchCount": 7, branchAngle: 54, "vegetation.branching.angleMean_deg": 54, trunkColor: "#75583d", "vegetation.trunk.barkColor": "#75583d", leafColor: "#6e8f3a", "vegetation.leaves.colorBase": "#6e8f3a", speciesProfile: "ACACIA_SAVANNA", "vegetation.species.profile": "ACACIA_SAVANNA", leafShape: "COMPOUND", "vegetation.leaves.shape": "COMPOUND" }},
];

export function LeftPresetsPanel() {
  const { treeParams, setTreeParams, resetToDefaults } = useProVegLayout();
  return (
    <div className="space-y-2">
      <div className="editor-section-title">Species Presets</div>
      <div className="grid grid-cols-2 gap-1.5">
        {PRESETS.map((p) => (
          <Button
            key={p.name}
            variant="outline"
            size="sm"
            className="h-8 text-[11px] justify-start"
            onClick={() => setTreeParams({ ...treeParams, ...p.params })}
          >
            {p.name}
          </Button>
        ))}
      </div>
      <div className="pt-2">
        <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground w-full" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
