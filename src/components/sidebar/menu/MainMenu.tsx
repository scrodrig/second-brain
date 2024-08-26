import { FaUsers } from "react-icons/fa";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { PiInvoiceBold } from "react-icons/pi";

interface MenuItem {
  isActive?: boolean;
  title: string;
  icon: React.ReactNode;
  href: string;
  type?: "link" | "collapse";
  items?: string[];
}

export const mainMenuItems: (pathname: string) => MenuItem[] = (
  pathname: string
) => {
  return [
    {
      isActive: pathname === "/admin/users",
      title: "Users",
      icon: <FaUsers />,
      href: "/",
    },
    {
      isActive: pathname === "/admin/households",
      title: "Households",
      icon: <MdOutlineFamilyRestroom />,
      href: "/",
    },
    {
      isActive: pathname === "/admin/invoices",
      title: "Invoices",
      icon: <PiInvoiceBold />,
      href: "/",
    },
  ];
};
