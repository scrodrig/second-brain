"use client";

import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { FaSignOutAlt } from "react-icons/fa";

export function Navbar() {
  const t = useTranslations("nav");
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b border-divider bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        {/* Left: breadcrumb area — kept minimal for now */}
        <span className="font-heading text-sm font-semibold text-foreground-500">
          Second Brain
        </span>
      </div>

      <div className="flex items-center gap-3">
        {session?.user && (
          <>
            <Avatar
              src={session.user.image ?? undefined}
              name={session.user.name ?? undefined}
              size="sm"
            />
            <Button
              size="sm"
              variant="light"
              isIconOnly
              aria-label={t("signOut")}
              onPress={() => signOut({ callbackUrl: "/login" })}
            >
              <FaSignOutAlt className="text-base" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
