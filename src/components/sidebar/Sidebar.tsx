"use client";

import React, { useState } from "react";

import { CollapseItems } from "./CollapseItems";
import { FaAustralSign } from "react-icons/fa6";
import Image from "next/image";
import { IoHome } from "react-icons/io5";
import { Sidebar } from "./sidebar.styles";
import { SidebarItem } from "./SidebarItem";
import { SidebarMenu } from "./SidebarMenu";
import { generalMenuItems } from "./menu/GeneralMenu";
import { mainMenuItems } from "./menu/MainMenu";
import { usePathname } from "next/navigation";

export const SidebarContainer = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="h-screen z-[20] sticky top-0" style={{
      scrollbarGutter: "stable both-edges",
    }}>
      {collapsed ? (
        <div
          className={Sidebar.Overlay()}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className="flex justify-center items-center flex-col">
          {/* <CompaniesDropdown /> */}
          <Image src="/imgs/logo.png" alt="logo" width={100} height={100} priority />
          <span className="text-2xl font-bold">SECOND BRAIN</span>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<IoHome />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Main Menu">
              {generalMenuItems(pathname).map((item) => {
                if (item.type === "collapse") {
                  return (
                    <CollapseItems
                      key={item.title}
                      title={item.title}
                      icon={item.icon}
                      items={item.items ?? []}
                    />
                  );
                }
                return (
                  <SidebarItem
                    key={item.title}
                    title={item.title}
                    icon={item.icon}
                    isActive={item.isActive}
                    href={item.href}
                  />
                );
              })}
            </SidebarMenu>

            <SidebarMenu title="General">
              {mainMenuItems(pathname).map((item) => {
                if (item.type === "collapse") {
                  return (
                    <CollapseItems
                      key={item.title}
                      title={item.title}
                      icon={item.icon}
                      items={item.items ?? []}
                    />
                  );
                }
                return (
                  <SidebarItem
                    key={item.title}
                    title={item.title}
                    icon={item.icon}
                    isActive={item.isActive}
                    href={item.href}
                  />
                );
              })}
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={pathname === "/changelog"}
                title="Changelog"
                icon={<FaAustralSign />}
              />
            </SidebarMenu>
          </div>
          {/* <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <IoSettings />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <IoFilter />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div> */}
        </div>
      </div>
    </aside>
  );
};
