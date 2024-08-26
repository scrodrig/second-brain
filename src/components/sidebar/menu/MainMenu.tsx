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

export const mainMenuItems: (pathname: string) => MenuItem[] = (
  pathname: string
) => {

  return [
    {
      isActive: pathname === "/developers",
      title: "Developers",
      icon: <IoPerson />,
      href: "/",
    },
    {
      isActive: pathname === "/view",
      title: "View",
      icon: <IoCashOutline />,
      href: "/",
    },
    {
      isActive: pathname === "/settings",
      title: "Settings",
      icon: <IoPersonRemove />,
      href: "/",
    },
  ];
};


