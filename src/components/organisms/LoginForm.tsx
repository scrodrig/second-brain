"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FaGoogle } from "react-icons/fa";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

export function LoginForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    await signIn("credentials", { email, password, callbackUrl: "/" });
    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      <Button
        fullWidth
        variant="ghost"
        startContent={<FaGoogle />}
        onPress={() => signIn("google", { callbackUrl: "/" })}
      >
        {t("signInWithGoogle")}
      </Button>

      <div className="relative flex items-center py-2">
        <div className="flex-1 border-t border-divider" />
        <span className="mx-4 text-xs text-foreground-400">or</span>
        <div className="flex-1 border-t border-divider" />
      </div>

      <form onSubmit={handleCredentials} className="space-y-3">
        <Input
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" color="primary" isLoading={isLoading} fullWidth variant="primary">
          {t("signIn")}
        </Button>
      </form>
    </div>
  );
}
