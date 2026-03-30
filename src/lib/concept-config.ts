import { FaHamburger, FaLaptop, FaWifi, FaBolt, FaGraduationCap, FaBus, FaEllipsisH } from "react-icons/fa";
import type { IconType } from "react-icons";
import { Concept } from "@prisma/client";

interface ConceptConfig {
  icon: IconType;
  color: "success" | "danger" | "warning" | "accent" | "default";
  bgClass: string;
}

export const CONCEPT_CONFIG: Record<Concept, ConceptConfig> = {
  Meal:           { icon: FaHamburger,     color: "success",  bgClass: "bg-green-100 dark:bg-green-900/30" },
  Technology:     { icon: FaLaptop,        color: "warning",  bgClass: "bg-amber-100 dark:bg-amber-900/30" },
  Internet:       { icon: FaWifi,          color: "accent",   bgClass: "bg-violet-100 dark:bg-violet-900/30" },
  Electricity:    { icon: FaBolt,          color: "accent",   bgClass: "bg-blue-100 dark:bg-blue-900/30" },
  Education:      { icon: FaGraduationCap, color: "warning",  bgClass: "bg-orange-100 dark:bg-orange-900/30" },
  Transportation: { icon: FaBus,           color: "danger",   bgClass: "bg-red-100 dark:bg-red-900/30" },
  Others:         { icon: FaEllipsisH,     color: "default",  bgClass: "bg-gray-100 dark:bg-gray-800" },
};
