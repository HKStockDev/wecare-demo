"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

/**
 * Blocks login/register pages when a session already exists.
 * Never redirects to "/" — only role homes (/app or /admin).
 */
export function useRedirectIfAuthenticated(options?: {
  preferRole?: UserRole;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    // Stay off the demo landing page (/) for authenticated sessions
    if (user.role === "admin") {
      router.replace("/admin");
      return;
    }
    router.replace("/app");
  }, [user, loading, router, options?.preferRole]);

  return { user, loading, blocked: Boolean(user) };
}
