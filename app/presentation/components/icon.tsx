import { icons as LucideIcons } from "lucide-react";

type LucideIconType = keyof typeof LucideIcons;

interface IconTypes {
  icon: string;
  className?: string;
}

export function Icon({ icon, className }: IconTypes) {
  // eslint-disable-next-line import/namespace
  const IconComp = (LucideIcons[icon as LucideIconType] ??
    LucideIcons.TriangleAlert) as React.ElementType;

  return <IconComp className={className} />;
}
