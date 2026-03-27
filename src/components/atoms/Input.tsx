import { Input as HeroInput, type InputProps as HeroInputProps } from "@heroui/react";

export function Input(props: HeroInputProps) {
  return <HeroInput radius="lg" variant="bordered" {...props} />;
}
