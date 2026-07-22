"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useToast } from "@/components/Toast";
import { NOTIFICATIONS } from "@/lib/demo-data";
import {
  PUSH_NOTIFICATION_EVENT,
  type PushNotificationDetail,
} from "@/lib/push-notifications";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Notification } from "@/lib/types";

type UserNotificationsValue = {
  notifications: Notification[];
  unreadCount: number;
  ready: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

const UserNotificationsContext = createContext<UserNotificationsValue | null>(null);

function mapNotification(row: Record<string, unknown>): Notification {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    read: Boolean(row.read),
    created_at: String(row.created_at),
  };
}

function prependUnique(
  prev: Notification[],
  next: Notification
): Notification[] {
  if (prev.some((n) => n.id === next.id)) return prev;
  return [next, ...prev];
}

export function UserNotificationsProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const { pushToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    isSupabaseConfigured() ? [] : NOTIFICATIONS
  );
  const [ready, setReady] = useState(() => !isSupabaseConfigured());

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setReady(true);
      return;
    }
    try {
      const { data } = await getSupabase()!
        .from("wecare_notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data?.length) {
        setNotifications(data.map(mapNotification));
      } else {
        setNotifications([]);
      }
    } finally {
      setReady(true);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Demo / same-browser fallback when admin sends without cloud DB
  useEffect(() => {
    const ingest = (detail: PushNotificationDetail) => {
      if (!detail?.title) return;
      const note: Notification = {
        id: detail.id || `push-${Date.now()}`,
        title: detail.title,
        body: detail.body,
        read: false,
        created_at: detail.created_at || new Date().toISOString(),
      };
      setNotifications((prev) => prependUnique(prev, note));
      pushToast({
        title: note.title,
        body: note.body,
        kind: "info",
        durationMs: 3000,
        id: `toast-${note.id}`,
      });
    };

    const onLocal = (event: Event) => {
      const detail = (event as CustomEvent<PushNotificationDetail>).detail;
      if (detail) ingest(detail);
    };
    window.addEventListener(PUSH_NOTIFICATION_EVENT, onLocal);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("wecare-push-notifications");
      channel.onmessage = (msg) => {
        const detail = msg.data as PushNotificationDetail;
        if (detail?.title) ingest(detail);
      };
    } catch {
      /* ignore */
    }

    return () => {
      window.removeEventListener(PUSH_NOTIFICATION_EVENT, onLocal);
      channel?.close();
    };
  }, [pushToast]);

  // Supabase Realtime — live INSERT for this user
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase()!;

    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wecare_notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const note = mapNotification(payload.new as Record<string, unknown>);
          setNotifications((prev) => {
            if (prev.some((n) => n.id === note.id)) return prev;
            return [note, ...prev];
          });
          pushToast({
            title: note.title,
            body: note.body,
            kind: "info",
            durationMs: 3000,
            id: `toast-${note.id}`,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "wecare_notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const note = mapNotification(payload.new as Record<string, unknown>);
          setNotifications((prev) =>
            prev.map((n) => (n.id === note.id ? note : n))
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, pushToast]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      if (!isSupabaseConfigured()) return;
      // Skip local/demo ids that are not UUIDs
      if (!/^[0-9a-f-]{36}$/i.test(id)) return;
      await getSupabase()!
        .from("wecare_notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("user_id", userId);
    },
    [userId]
  );

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!isSupabaseConfigured()) return;
    await getSupabase()!
      .from("wecare_notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
  }, [userId]);

  const value = useMemo(
    () => ({ notifications, unreadCount, ready, markRead, markAllRead }),
    [notifications, unreadCount, ready, markRead, markAllRead]
  );

  return (
    <UserNotificationsContext.Provider value={value}>
      {children}
    </UserNotificationsContext.Provider>
  );
}

export function useUserNotifications() {
  const ctx = useContext(UserNotificationsContext);
  if (!ctx) {
    throw new Error("useUserNotifications must be used within UserNotificationsProvider");
  }
  return ctx;
}
