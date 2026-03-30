import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Montserrat Alternates", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#6366f1",
          accent: "#f59e0b",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: { DEFAULT: "#6366f1", foreground: "#ffffff" },
            secondary: { DEFAULT: "#f59e0b", foreground: "#000000" },
          },
        },
        dark: {
          colors: {
            primary: { DEFAULT: "#818cf8", foreground: "#ffffff" },
            secondary: { DEFAULT: "#fbbf24", foreground: "#000000" },
          },
        },
      },
    }),
  ],
};

export default config;
