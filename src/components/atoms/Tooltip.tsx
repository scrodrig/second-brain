import { Tooltip as HeroTooltip, type TooltipProps as HeroTooltipProps } from "@heroui/react";

export function Tooltip(props: HeroTooltipProps) {
  return <HeroTooltip placement="top" {...props} />;
}
