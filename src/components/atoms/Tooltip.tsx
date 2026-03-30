import type { ReactNode } from "react";
import { Tooltip as HeroTooltip } from "@heroui/react";

interface TooltipProps {
  content: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}

export function Tooltip({ content, placement = "top", children }: TooltipProps) {
  return (
    <HeroTooltip>
      <HeroTooltip.Trigger>{children}</HeroTooltip.Trigger>
      <HeroTooltip.Content placement={placement}>{content}</HeroTooltip.Content>
    </HeroTooltip>
  );
}
