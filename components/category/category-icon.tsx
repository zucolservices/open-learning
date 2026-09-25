import {
  BrainCircuit,
  Briefcase,
  CalendarCheck,
  Cloud,
  Database,
  Handshake,
  Landmark,
  Network,
  Palette,
  ShieldCheck,
  Sparkles,
  SquareCode,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "data-engineering": Database,
  "ai-ml": BrainCircuit,
  "platform-cloud": Cloud,
  architecture: Network,
  "security-government": ShieldCheck,
  "cross-cutting": Sparkles,
  "software-development": SquareCode,
  design: Palette,
  "delivery-management": CalendarCheck,
  "business-analysis": Briefcase,
  "presales-client": Handshake,
  "domain-knowledge": Landmark,
  leadership: Users,
};

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
