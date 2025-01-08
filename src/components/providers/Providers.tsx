"use client";

import * as React from "react";

import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProviderProps } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextUIProvider>
      <ThemeProvider
        defaultTheme='system'
        attribute='class'
        {...themeProps}>
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
}