"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: number;
  className?: string;
  alt?: string;
};

/** Official Wecare mark (circular logo). */
export function BrandLogo({ size = 40, className, alt = "Wecare" }: BrandLogoProps) {
  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-full bg-brand", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/logo-mark.png"
        alt={alt}
        fill
        className="object-cover"
        unoptimized
        priority
      />
    </div>
  );
}
