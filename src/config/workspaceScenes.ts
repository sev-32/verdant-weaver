export interface SubTabConfig {
  id: string;
  label: string;
  icon: string;
}

export interface LeftPanelConfig {
  id: string;
  label: string;
  icon: string;
}

export interface RightPanelConfig {
  id: string;
  label: string;
  icon: string;
  subTabs: SubTabConfig[];
}

export const LEFT_PANELS: LeftPanelConfig[] = [
  { id: "presets", label: "Presets", icon: "Bookmark" },
  { id: "environment", label: "Environment", icon: "Cloud" },
  { id: "seed", label: "Seed & Age", icon: "Hash" },
  { id: "diagnostics", label: "Diagnostics", icon: "Activity" },
];

export const RIGHT_PANELS: RightPanelConfig[] = [
  {
    id: "trunk", label: "Trunk", icon: "TreePine",
    subTabs: [
      { id: "shape", label: "Shape", icon: "Circle" },
      { id: "gesture", label: "Gesture", icon: "Move" },
      { id: "cross", label: "Cross-section", icon: "CircleDot" },
      { id: "buttress", label: "Buttress", icon: "Mountain" },
    ],
  },
  {
    id: "branching", label: "Branching", icon: "GitBranch",
    subTabs: [
      { id: "structure", label: "Structure", icon: "Network" },
      { id: "physics", label: "Physics", icon: "Magnet" },
      { id: "junction", label: "Junction", icon: "Merge" },
      { id: "gesture", label: "Gesture", icon: "Move" },
      { id: "damage", label: "Damage", icon: "AlertTriangle" },
    ],
  },
  {
    id: "crown", label: "Crown", icon: "Cloud",
    subTabs: [
      { id: "shape", label: "Shape", icon: "Circle" },
      { id: "density", label: "Density", icon: "Layers" },
      { id: "health", label: "Health", icon: "Heart" },
    ],
  },
  {
    id: "leaves", label: "Leaves", icon: "Leaf",
    subTabs: [
      { id: "representation", label: "Cards", icon: "Layers" },
      { id: "orientation", label: "Orientation", icon: "RotateCw" },
      { id: "petiole", label: "Petiole", icon: "Minus" },
      { id: "color", label: "Color", icon: "Palette" },
    ],
  },
  {
    id: "bark-roots", label: "Bark & Roots", icon: "Mountain",
    subTabs: [
      { id: "bark", label: "Bark", icon: "Box" },
      { id: "moss", label: "Moss & Lichen", icon: "Sprout" },
      { id: "roots", label: "Roots", icon: "Sprout" },
    ],
  },
  {
    id: "wind-lod", label: "Wind & LOD", icon: "Wind",
    subTabs: [
      { id: "wind", label: "Wind", icon: "Wind" },
      { id: "advanced", label: "Advanced", icon: "Settings" },
      { id: "lod", label: "LOD", icon: "Eye" },
    ],
  },
  {
    id: "space-colonization", label: "Space Colonization", icon: "Grid3X3",
    subTabs: [
      { id: "attractors", label: "Attractors", icon: "Target" },
      { id: "crown", label: "Crown", icon: "Cloud" },
    ],
  },
];

// Rock editor panels
export const ROCK_RIGHT_PANELS: RightPanelConfig[] = [
  { id: "rock-shape", label: "Shape", icon: "Hexagon", subTabs: [] },
  { id: "rock-terrain", label: "Terrain", icon: "Mountain", subTabs: [] },
  { id: "rock-displacement", label: "Displacement", icon: "Waves", subTabs: [] },
  { id: "rock-erosion", label: "Erosion & Fracture", icon: "Droplets", subTabs: [] },
  { id: "rock-foliation", label: "Foliation", icon: "Layers", subTabs: [] },
  { id: "rock-material", label: "Material", icon: "Paintbrush", subTabs: [] },
  { id: "rock-weathering", label: "Weathering", icon: "Thermometer", subTabs: [] },
  { id: "rock-growth", label: "Growth", icon: "Sprout", subTabs: [] },
  { id: "rock-biology", label: "Biology", icon: "Bug", subTabs: [] },
  { id: "rock-csg", label: "CSG Merge", icon: "Combine", subTabs: [] },
  { id: "rock-scene", label: "Scene", icon: "Layout", subTabs: [] },
  { id: "rock-developer", label: "Developer", icon: "Settings", subTabs: [] },
];
