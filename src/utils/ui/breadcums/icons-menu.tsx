import { CiCircleInfo } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { PiInvoiceFill } from "react-icons/pi";
import { ReactNode } from "react";
import { TbReportSearch } from "react-icons/tb";

type IconMenu = {
  title: string;
  icon: ReactNode;
};

const iconsMenu: (icons: string) => IconMenu = (icon) => {
  const icons: Record<string, IconMenu> = {
    home: {
      title: "Home",
      icon: <FaHome />,
    },
    invoices: {
      title: "Invoices",
      icon: <PiInvoiceFill />,
    },
    reports: {
      title: "Reports",
      icon: <TbReportSearch />,
    },
  };

  return (
    icons[icon] || {
      title: icon.charAt(0).toUpperCase() + icon.slice(1),
      icon: <CiCircleInfo />,
    }
  );
};

export const getBreadcums = (pathname: string) => {
  const pathnames = pathname.split("/").filter((x) => x);
  console.log("🚀 ~ getBreadcums ~ pathnames:", pathnames)

  const breadcrums: IconMenu[] = [];

  pathnames.forEach((path) => {
    const iconItem = iconsMenu(path);
    breadcrums.push(iconItem);
  });

  return [iconsMenu("home"), ...breadcrums];
};
