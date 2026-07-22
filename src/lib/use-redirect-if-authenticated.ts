"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

/**
 * Blocks login/register pages when a session already exists.
 * - admin → /admin
 * - user → /app
 * Optionally require a specific role (e.g. admin login only allows admins through after auth).
 */
export function useRedirectIfAuthenticated(options?: {
  /** If set, only this role is accepted on this page after login; others go to their home. */
  preferRole?: UserRole;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    if (user.role === "admin") {
      router.replace("/admin");
      return;
    }
    router.replace("/app");
  }, [user, loading, router, options?.preferRole]);

  return { user, loading, blocked: Boolean(user) };
}
