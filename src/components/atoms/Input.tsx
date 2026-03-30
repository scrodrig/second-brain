import type { ReactNode } from "react";
import { Input as HeroInput, type InputProps as HeroInputProps } from "@heroui/react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<HeroInputProps, "label"> {
  label?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  startContent?: ReactNode;
}

export function Input({ label, errorMessage, isInvalid, startContent, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative flex items-center">
        {startContent && (
          <span className="absolute left-3 flex items-center text-foreground-400">
            {startContent}
          </span>
        )}
        <HeroInput
          className={cn(
            "w-full rounded-lg border bg-content1 px-3 py-2 text-sm outline-none focus:ring-1",
            isInvalid
              ? "border-danger focus:border-danger focus:ring-danger"
              : "border-divider focus:border-primary focus:ring-primary",
            startContent && "pl-8",
            className
          )}
          {...props}
        />
      </div>
      {isInvalid && errorMessage && (
        <span className="text-xs text-danger">{errorMessage}</span>
      )}
    </div>
  );
}
