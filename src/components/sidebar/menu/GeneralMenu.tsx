import {
  IoBalloonSharp,
  IoCartOutline,
  IoCashOutline,
  IoPerson,
  IoPersonRemove,
} from "react-icons/io5";

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
      icon: <IoPerson />,
      href: "accounts",
    },
    {
      isActive: pathname === "/payments",
      title: "Payments",
      icon: <IoCashOutline />,
      href: "/",
    },
    {
      title: "Balances",
      items: ["Banks Accounts", "Credit Cards", "Loans"],
      icon: <IoBalloonSharp />,
      type: "collapse",
      href: "/",
    },
    {
      isActive: pathname === "/customers",
      title: "Customers",
      icon: <IoPersonRemove />,
      href: "/",
    },
    {
      isActive: pathname === "/products",
      title: "Products",
      icon: <IoCartOutline />,
      href: "/",
    },
    {
      isActive: pathname === "/reports",
      title: "Reports",
      icon: <IoCartOutline />,
      href: "/",
    },
  ];
};


