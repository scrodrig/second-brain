import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardTemplate>{children}</DashboardTemplate>;
}
