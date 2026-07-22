"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: number;
  className?: string;
  alt?: string;
  /** full = splash App_logo with wordmark; mark = cropped circular icon */
  variant?: "mark" | "full";
};

/**
 * Official Wecare logo sourced from App_logo.png.
 * - mark: circular green icon (for headers / nav)
 * - full: full splash mark with wordmark (for large hero placements)
 */
export function BrandLogo({
  size = 40,
  className,
  alt = "Wecare",
  variant = "mark",
}: BrandLogoProps) {
  if (variant === "full") {
    return (
      <div
        className={cn("relative shrink-0 overflow-hidden", className)}
        style={{ width: size, height: Math.round(size * 0.91) }}
      >
        <Image
          src="/images/App_logo.png"
          alt={alt}
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-full bg-[#28C76F]", className)}
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
