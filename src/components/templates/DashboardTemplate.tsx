import type { ReactNode } from "react";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Navbar } from "@/components/organisms/Navbar";
import { BottomNav } from "@/components/organisms/BottomNav";

export function DashboardTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Sidebar — hidden on mobile */}
      <aside className="hidden md:flex md:w-64 md:flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  );
}
