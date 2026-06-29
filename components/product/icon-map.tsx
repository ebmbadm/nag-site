import {
  Cpu,
  Wifi,
  Activity,
  Layers,
  Star,
  SlidersHorizontal,
  GitBranch,
  Plug,
  Usb,
  Monitor,
  AudioWaveform,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  wifi: Wifi,
  activity: Activity,
  layers: Layers,
  star: Star,
  sliders: SlidersHorizontal,
  "git-branch": GitBranch,
  plug: Plug,
  usb: Usb,
  monitor: Monitor,
  "audio-waveform": AudioWaveform,
};

export function FeatureIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name && MAP[name]) || Star;
  return <Icon className={className} aria-hidden />;
}
