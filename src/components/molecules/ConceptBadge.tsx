"use client";

import { useTranslations } from "next-intl";
import { Concept } from "@prisma/client";
import { Chip } from "@/components/atoms/Chip";
import { Tooltip } from "@/components/atoms/Tooltip";
import { CONCEPT_CONFIG } from "@/lib/concept-config";

interface ConceptBadgeProps {
  concept: Concept;
  showTooltip?: boolean;
}

export function ConceptBadge({ concept, showTooltip = true }: ConceptBadgeProps) {
  const t = useTranslations("concepts");
  const config = CONCEPT_CONFIG[concept];
  const Icon = config.icon;

  const chip = (
    <Chip
      color={config.color}
      startContent={<Icon className="text-sm" />}
      variant="soft"
    >
      {t(concept)}
    </Chip>
  );

  if (!showTooltip) return chip;

  return (
    <Tooltip content={t(concept)} placement="top">
      {chip}
    </Tooltip>
  );
}
