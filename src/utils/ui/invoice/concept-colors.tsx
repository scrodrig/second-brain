import React, { ReactNode } from "react";

import { InvoiceConcept } from "@/interfaces";
import { IoCalendar } from "react-icons/io5";

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

export const CONCEPT_COLORS: Record<
  InvoiceConcept,
  { className: string; icon: ReactNode }
> = {
  Meal: { className: "bg-green-300", icon: <IoCalendar /> },
  Transportation: { className: "bg-red-300", icon: <IoCalendar /> },
  Technology: { className: "bg-amber-300", icon: <IoCalendar /> },
  Internet: { className: "bg-violet-300", icon: <IoCalendar /> },
  Electricity: { className: "bg-blue-300", icon: <IoCalendar /> },
  Education: { className: "bg-orange-300", icon: <IoCalendar /> },
  Others: { className: "bg-gray-500", icon: <IoCalendar /> },
};
