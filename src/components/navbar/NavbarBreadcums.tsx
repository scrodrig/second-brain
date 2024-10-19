"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

import { getBreadcums } from "@/utils";
import { usePathname } from "next/navigation";

export const NavbarBreadcums = () => {
  const router = usePathname();

  const breadcums = getBreadcums(router);

  return (
    <Breadcrumbs>
      {
        breadcums.map((item, index) => (
          <BreadcrumbItem
            key={index}
            startContent={item.icon}
          >
            {item.title}
          </BreadcrumbItem>
        ))
      }
    </Breadcrumbs>
  );
};


