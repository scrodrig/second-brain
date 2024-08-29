import { InvoiceConcept } from "@/interfaces";

export const CONCEPT_COLORS_GRADIENT: Record<InvoiceConcept, string> = {
  Meal: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
  Transportation:
    "bg-gradient-to-br from-pink-500 to-indigo-500 border-small border-white/50 shadow-green-500/30",
  Technology:
    "bg-gradient-to-br from-yellow-500 to-red-500 border-small border-white/50 shadow-red-500/30",
  Internet:
    "bg-gradient-to-br from-purple-500 to-blue-500 border-small border-white/50 shadow-blue-500/30",
  Electricity:
    "bg-gradient-to-br from-yellow-500 to-green-500 border-small border-white/50 shadow-green-500/30",
  Education:
    "bg-gradient-to-br from-purple-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
  Others:
    "bg-gradient-to-br from-indigo-500 to-red-500 border-small border-white/50 shadow-red-500/30",
};

export const CONCEPT_COLORS: Record<InvoiceConcept, string> = {
  Meal: "bg-green-300",
  Transportation: "bg-red-300",
  Technology: "bg-amber-300",
  Internet: "bg-violet-300",
  Electricity: "bg-blue-300",
  Education: "bg-orange-300",
  Others: "bg-grey-500",
};
