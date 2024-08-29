// import { Footer, Sidebar, TopMenu } from "@/components";

import "@/app/globals.css";

import { SidebarContainer } from "@/components/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <div className="flex">
        <SidebarContainer />
        <div className="w-full px-5 sm:px-10">{children}</div>
      </div>
    </main>
  );
}
