import "@/app/globals.css";

import { NavbarWrapper, SidebarContainer } from "@/components";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <div className="flex">
        <SidebarContainer />
        <NavbarWrapper>
          <div className="w-full px-5 sm:px-10 mt-5">{children}</div>
        </NavbarWrapper>
      </div>
    </main>
  );
}
