import { Avatar as HeroAvatar, type AvatarProps as HeroAvatarProps } from "@heroui/react";

export function Avatar(props: HeroAvatarProps) {
  return <HeroAvatar size="sm" {...props} />;
}
