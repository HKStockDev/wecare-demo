"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
  alt?: string;
};

const DEFAULT_AVATAR = "/images/avatar-default.svg";

export function Avatar({
  src,
  name = "",
  size = 40,
  className,
  alt,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-brand-light",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={showPhoto ? (src as string) : DEFAULT_AVATAR}
        alt={alt || name || "User"}
        fill
        className="object-cover"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  );
}
