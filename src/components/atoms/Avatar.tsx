import { Avatar as HeroAvatar, type AvatarProps as HeroAvatarProps } from "@heroui/react";

interface AvatarProps extends HeroAvatarProps {
  src?: string;
  name?: string;
}

export function Avatar({ src, name, ...props }: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <HeroAvatar size="sm" {...props}>
      {src && <HeroAvatar.Image src={src} alt={name ?? ""} />}
      <HeroAvatar.Fallback>{initials}</HeroAvatar.Fallback>
    </HeroAvatar>
  );
}
