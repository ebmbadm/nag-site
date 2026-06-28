import { Cpu, Wifi, Activity, Layers, Star, SlidersHorizontal, type LucideIcon } from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  wifi: Wifi,
  activity: Activity,
  layers: Layers,
  star: Star,
  sliders: SlidersHorizontal,
};

export function FeatureIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name && MAP[name]) || Star;
  return <Icon className={className} aria-hidden />;
}
