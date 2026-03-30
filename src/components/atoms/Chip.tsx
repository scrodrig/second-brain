import type { ReactNode } from "react";
import { Chip as HeroChip, type ChipProps as HeroChipProps } from "@heroui/react";

interface ChipProps extends HeroChipProps {
  startContent?: ReactNode;
}

export function Chip({ startContent, children, ...props }: ChipProps) {
  return (
    <HeroChip size="sm" {...props}>
      {startContent ? (
        <span className="flex items-center gap-1">
          {startContent}
          {children}
        </span>
      ) : (
        children
      )}
    </HeroChip>
  );
}
