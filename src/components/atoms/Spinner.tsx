import { Spinner as HeroSpinner, type SpinnerProps as HeroSpinnerProps } from "@heroui/react";

export function Spinner(props: HeroSpinnerProps) {
  return <HeroSpinner size="sm" color="accent" {...props} />;
}
