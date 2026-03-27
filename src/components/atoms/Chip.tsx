import { Chip as HeroChip, type ChipProps as HeroChipProps } from "@heroui/react";

export function Chip(props: HeroChipProps) {
  return <HeroChip radius="full" size="sm" {...props} />;
}
