"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type MotionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
};

/** Soft page enter — wrap page roots / shells. */
export function PageMotion({ children, className, delay = 0, style }: MotionProps) {
  return (
    <div
      className={cn("anim-page", className)}
      style={{ animationDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </div>
  );
}

/** Fade + slight rise for hero blocks, cards, forms. */
export function FadeUp({ children, className, delay = 0, style }: MotionProps) {
  return (
    <div
      className={cn("anim-fade-up", className)}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

/** Stagger children with CSS nth-child delays. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("anim-stagger", className)}>{children}</div>;
}

/** Scale-in for logos and avatars. */
export function ScaleIn({ children, className, delay = 0 }: MotionProps) {
  return (
    <div
      className={cn("anim-scale-in", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
