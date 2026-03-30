import type { ReactNode } from "react";
import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LegacyColor = "primary" | "secondary" | "danger" | "default" | "warning" | "success";

interface ButtonProps extends Omit<HeroButtonProps, "color"> {
  color?: LegacyColor;
  fullWidth?: boolean;
  isLoading?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  href?: string;
}

const colorToVariant: Record<LegacyColor, HeroButtonProps["variant"]> = {
  primary: "primary",
  secondary: "secondary",
  danger: "danger",
  default: "ghost",
  warning: "ghost",
  success: "ghost",
};

export function Button({
  className,
  fullWidth,
  color,
  isLoading,
  variant,
  startContent,
  endContent,
  href,
  children,
  ...props
}: ButtonProps) {
  const resolvedVariant = color ? colorToVariant[color] : variant;

  const hasAdornment = !!startContent || !!endContent;
  const content = hasAdornment ? (
    <span className="flex items-center justify-center gap-2">
      {startContent}
      {children}
      {endContent}
    </span>
  ) : (
    children
  );

  if (href) {
    return (
      <Link href={href} className={cn(fullWidth && "w-full", className)}>
        <HeroButton
          className={cn(fullWidth && "w-full")}
          variant={resolvedVariant}
          isDisabled={props.isDisabled || isLoading}
          {...props}
        >
          {content}
        </HeroButton>
      </Link>
    );
  }

  return (
    <HeroButton
      className={cn(fullWidth && "w-full", className)}
      variant={resolvedVariant}
      isDisabled={props.isDisabled || isLoading}
      {...props}
    >
      {content}
    </HeroButton>
  );
}
