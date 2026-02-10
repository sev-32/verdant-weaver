import { Slider } from "@/components/ui/slider";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  keyPrimary: string;
  keyAlt?: string;
  format?: (v: number) => string;
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  keyPrimary,
  keyAlt,
  format = (v) => v.toFixed(2),
}: SliderRowProps) {
  const { setTreeParam, setRockParam } = useProVegLayout();

  const set = (v: number) => {
    if (keyPrimary.startsWith("rock:")) {
      setRockParam(keyPrimary.slice(5), v);
    } else {
      setTreeParam(keyPrimary, v);
      if (keyAlt) setTreeParam(keyAlt, v);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="editor-value">{format(value)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => set(v)}
        className="w-full"
      />
    </div>
  );
}
