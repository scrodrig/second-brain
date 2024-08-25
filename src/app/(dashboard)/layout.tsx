// import { Footer, Sidebar, TopMenu } from "@/components";

import { SidebarWrapper } from "@/components/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      {/* <TopMenu />
      <Sidebar /> */}
      <div className='flex'>
        {/* <SidebarWrapper > */}
          <SidebarWrapper />
          {/* </SidebarWrapper> */}
      </div>
      <div className="px-0 sm:px-0">{children}</div>
      {/* <Footer /> */}
    </main>
  );
}