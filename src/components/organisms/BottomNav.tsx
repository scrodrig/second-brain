"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaFileInvoice, FaHome, FaUsers, FaCog } from "react-icons/fa";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: FaHome, labelKey: "home" },
  { href: "/invoices", icon: FaFileInvoice, labelKey: "invoices" },
  { href: "/household", icon: FaUsers, labelKey: "household" },
  { href: "/settings", icon: FaCog, labelKey: "settings" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-divider bg-background/80 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const isActive =
            pathname.endsWith(href) ||
            (href !== "/" && pathname.includes(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-foreground-400 hover:text-foreground"
              )}
            >
              <Icon className="text-xl" />
              <span className="text-[10px] font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
