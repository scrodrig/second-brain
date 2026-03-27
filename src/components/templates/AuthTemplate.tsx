import type { ReactNode } from "react";
import { FaLeaf } from "react-icons/fa";

export function AuthTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-indigo-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <FaLeaf className="text-2xl" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Second Brain
          </h1>
          <p className="text-sm text-foreground-400">Family finance tracker</p>
        </div>
        {children}
      </div>
    </div>
  );
}
