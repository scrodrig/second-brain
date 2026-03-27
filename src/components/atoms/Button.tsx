import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react";
import { cn } from "@/lib/utils";

interface ButtonProps extends HeroButtonProps {
  fullWidth?: boolean;
}

export function Button({ className, fullWidth, ...props }: ButtonProps) {
  return (
    <HeroButton
      className={cn(fullWidth && "w-full", className)}
      radius="lg"
      {...props}
    />
  );
}
