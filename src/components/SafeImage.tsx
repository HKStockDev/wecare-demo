"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MISSING = "/images/missing-image.svg";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  alt,
  fallbackSrc = MISSING,
  className,
  onError,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = !src || failed ? fallbackSrc : src;

  return (
    <Image
      {...rest}
      src={imageSrc}
      alt={alt}
      className={cn(className)}
      unoptimized
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}
