import {
  Bookmark, Cloud, Hash, Activity, TreePine, GitBranch, Leaf,
  Mountain, Wind, Grid3X3, Circle, CircleDot, Move, Merge,
  AlertTriangle, Layers, Minus, Palette, Box, Sprout, Eye,
  Target, PanelLeftClose, PanelRightClose, Gem, Droplets,
  Paintbrush, Hexagon, Settings, Thermometer, Combine,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Bookmark, Cloud, Hash, Activity, TreePine, GitBranch, Leaf,
  Mountain, Wind, Grid3X3, Circle, CircleDot, Move, Merge,
  AlertTriangle, Layers, Minus, Palette, Box, Sprout, Eye,
  Target, PanelLeftClose, PanelRightClose, Gem, Droplets,
  Paintbrush, Hexagon, Settings, Thermometer, Combine,
  Root: Sprout,
  Network: GitBranch,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Cloud;
}

export { PanelLeftClose, PanelRightClose };
