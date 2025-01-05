import { FaBowlFood, FaBus, FaChrome, FaComputer } from "react-icons/fa6";
import React, { ReactNode } from "react";

import { Concept } from "@/interfaces";
import { IoCalendar } from "react-icons/io5";
import { IoMdSchool } from "react-icons/io";
import { MdElectricBolt } from "react-icons/md";
import { VscSymbolMisc } from "react-icons/vsc";

export const CONCEPT_COLORS_GRADIENT: Record<Concept, string> = {
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
  Concept,
  { className: string; icon: ReactNode }
> = {
  Meal: {
    className: "bg-green-300",
    icon: <FaBowlFood className="mr-2" size={20} />,
  },
  Transportation: {
    className: "bg-red-300",
    icon: <FaBus className="mr-2" size={20} />,
  },
  Technology: {
    className: "bg-amber-300",
    icon: <FaComputer className="mr-2" size={20} />,
  },
  Internet: {
    className: "bg-violet-300",
    icon: <FaChrome className="mr-2" size={20} />,
  },
  Electricity: {
    className: "bg-blue-300",
    icon: <MdElectricBolt className="mr-2" size={20} />,
  },
  Education: {
    className: "bg-orange-300",
    icon: <IoMdSchool className="mr-2" size={20} />,
  },
  Others: {
    className: "bg-gray-500",
    icon: <VscSymbolMisc className="mr-2" size={20} />,
  },
};
