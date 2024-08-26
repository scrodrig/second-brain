import { FaBalanceScaleLeft, FaRegUser } from "react-icons/fa";

import { FcTodoList } from "react-icons/fc";
import { MdFamilyRestroom } from "react-icons/md";
import { PiInvoiceFill } from "react-icons/pi";
import { TbReportSearch } from "react-icons/tb";

interface MenuItem {
  isActive?: boolean;
  title: string;
  icon: React.ReactNode;
  href: string;
  type?: "link" | "collapse";
  items?: string[];
}

export const generalMenuItems: (pathname: string) => MenuItem[] = (
  pathname: string
) => {

  return [
    {
      isActive: pathname === "/accounts",
      title: "Accounts",
      icon: <FaRegUser  />,
      href: "accounts",
    },
    {
      isActive: pathname === "/households",
      title: "Households",
      icon: <MdFamilyRestroom  />,
      href: "/",
    },
    {
      isActive: pathname === "/invoices",
      title: "Invoices",
      icon: <PiInvoiceFill  />,
      href: "/invoices",
    },
    {
      title: "Balances",
      items: ["Banks Accounts", "Credit Cards", "Loans"],
      icon: <FaBalanceScaleLeft  />,
      type: "collapse",
      href: "/",
    },
    {
      isActive: pathname === "/todos",
      title: "Todos",
      icon: <FcTodoList  />,
      href: "/",
    },
    {
      isActive: pathname === "/reports",
      title: "Reports",
      icon: <TbReportSearch  />,
      href: "/",
    },
  ];
};


