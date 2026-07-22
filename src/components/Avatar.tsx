"use client";

import Image from "next/image";
import { useState } from "react";
import { avatarForName } from "@/lib/avatars";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
  alt?: string;
};

export function Avatar({
  src,
  name = "",
  size = 40,
  className,
  alt,
}: AvatarProps) {
  const resolved = avatarForName(name, src);
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? "/images/avatar-default.svg" : resolved;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-brand-light",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageSrc}
        alt={alt || name || "User"}
        fill
        className="object-cover"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  );
}
