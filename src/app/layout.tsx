import "./globals.css";

import type { Metadata } from "next";
import { Providers } from "@/components/providers/Providers";
import { inter } from "@/config/fonts";

export const metadata: Metadata = {
  title: "Second Brain",
  description: "An app to help you manage everything in our household",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
