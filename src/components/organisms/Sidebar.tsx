"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaHome, FaFileInvoice, FaUsers, FaCog, FaLeaf } from "react-icons/fa";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: FaHome, labelKey: "home" },
  { href: "/invoices", icon: FaFileInvoice, labelKey: "invoices" },
  { href: "/household", icon: FaUsers, labelKey: "household" },
  { href: "/settings", icon: FaCog, labelKey: "settings" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <div className="flex h-full w-64 flex-col border-r border-divider bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-divider px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
          <FaLeaf className="text-sm text-white" />
        </div>
        <span className="font-heading text-base font-bold">Second Brain</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const isActive =
            pathname.endsWith(href) ||
            (href !== "/" && pathname.includes(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground-500 hover:bg-default-100 hover:text-foreground"
              )}
            >
              <Icon className="text-base" />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
