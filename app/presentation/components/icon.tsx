import { icons as LucideIcons } from "lucide-react";

import { TAILWIND_TEXT, cn } from "../utils";

type LucideIconType = keyof typeof LucideIcons;

interface IconTypes {
  icon: string;
  color?: string;
  className?: string;
}

export function Icon({ icon, color, className }: IconTypes) {
  // eslint-disable-next-line import/namespace
  const IconComp = (LucideIcons[icon as LucideIconType] ??
    LucideIcons.TriangleAlert) as React.ElementType;

  return (
    <IconComp
      className={cn(
        className,
        color ? TAILWIND_TEXT[color as keyof typeof TAILWIND_TEXT] : null,
      )}
    />
  );
}
