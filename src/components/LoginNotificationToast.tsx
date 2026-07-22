"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/components/Toast";
import {
  consumeLoginToastPending,
  hasLoginToastPending,
} from "@/lib/login-toast";
import type { Notification } from "@/lib/types";

/**
 * After login, if unread notifications exist, show one toast for ~3s.
 * `ready` should become true once the notification list has finished its first load.
 */
export function LoginNotificationToast({
  notifications,
  ready = true,
}: {
  notifications: Notification[];
  ready?: boolean;
}) {
  const { pushToast } = useToast();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (!ready) return;
    if (!hasLoginToastPending()) return;

    const unread = notifications.filter((n) => !n.read);
    consumeLoginToastPending();
    handled.current = true;

    if (unread.length === 0) return;

    const first = unread[0];
    pushToast({
      title:
        unread.length === 1
          ? first.title
          : `You have ${unread.length} new notifications`,
      body:
        unread.length === 1
          ? first.body
          : unread
              .slice(0, 2)
              .map((n) => n.title)
              .join(" · "),
      kind: "info",
      durationMs: 3000,
    });
  }, [notifications, ready, pushToast]);

  return null;
}
