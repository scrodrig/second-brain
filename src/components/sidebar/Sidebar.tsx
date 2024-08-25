"use client";

import { Avatar, Tooltip } from "@nextui-org/react";
import { FaFastBackward, FaPercentage, FaSearch } from "react-icons/fa";
import {
  IoBalloonSharp,
  IoBuild,
  IoCartOutline,
  IoCashOutline,
  IoFilter,
  IoHome,
  IoPerson,
  IoPersonRemove,
  IoSettings,
} from "react-icons/io5";
import React, { useState } from "react";

// import { HomeIcon } from "../icons/sidebar/home-icon";
// import { PaymentsIcon } from "../icons/sidebar/payments-icon";
// import { BalanceIcon } from "../icons/sidebar/balance-icon";
// import { AccountsIcon } from "../icons/sidebar/accounts-icon";
// import { CustomersIcon } from "../icons/sidebar/customers-icon";
// import { ProductsIcon } from "../icons/sidebar/products-icon";
// import { ReportsIcon } from "../icons/sidebar/reports-icon";
// import { DevIcon } from "../icons/sidebar/dev-icon";
// import { ViewIcon } from "../icons/sidebar/view-icon";
// import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./CollapseItems";
import { CompaniesDropdown } from "./CompaniesDropdown";
import { FaAustralSign } from "react-icons/fa6";
import { Sidebar } from "./sidebar.styles";
import { SidebarItem } from "./SidebarItem";
import { SidebarMenu } from "./SidebarMenu";
// import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";

// import { FilterIcon } from "../icons/sidebar/filter-icon";
// import { useSidebarContext } from "../layout/layout-context";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="h-screen z-[20] sticky top-0">
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
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
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
              <SidebarItem
                isActive={pathname === "/accounts"}
                title="Accounts"
                icon={<IoPerson />}
                href="accounts"
              />
              <SidebarItem
                isActive={pathname === "/payments"}
                title="Payments"
                icon={<IoCashOutline />}
              />
              <CollapseItems
                icon={<IoBalloonSharp />}
                items={["Banks Accounts", "Credit Cards", "Loans"]}
                title="Balances"
              />
              <SidebarItem
                isActive={pathname === "/customers"}
                title="Customers"
                icon={<IoPersonRemove />}
              />
              <SidebarItem
                isActive={pathname === "/products"}
                title="Products"
                icon={<IoCartOutline />}
              />
              <SidebarItem
                isActive={pathname === "/reports"}
                title="Reports"
                icon={<IoBuild />}
              />
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                isActive={pathname === "/developers"}
                title="Developers"
                icon={<FaPercentage />}
              />
              <SidebarItem
                isActive={pathname === "/view"}
                title="View Test Data"
                icon={<FaFastBackward />}
              />
              <SidebarItem
                isActive={pathname === "/settings"}
                title="Settings"
                icon={<FaSearch />}
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={pathname === "/changelog"}
                title="Changelog"
                icon={<FaAustralSign />}
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
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
          </div>
        </div>
      </div>
    </aside>
  );
};
