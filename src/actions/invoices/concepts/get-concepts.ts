"use server";

import { Concept } from "@prisma/client";

const concepts: Concept[] = [
  "Meal",
  "Technology",
  "Internet",
  "Electricity",
  "Education",
  "Transportation",
  "Others",
];

export const getConcepts = async () => {
  return {
    concepts,
  };
};
