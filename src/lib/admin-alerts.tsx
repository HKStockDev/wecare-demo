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
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatCurrencyExact } from "@/lib/utils";
import type { Notification } from "@/lib/types";
import { DONATION_ALERT_EVENT, type DonationAlertDetail } from "@/lib/donation-alerts";

const recentAlertIds = new Set<string>();

function rememberAlert(id: string) {
  if (recentAlertIds.has(id)) return false;
  recentAlertIds.add(id);
  window.setTimeout(() => recentAlertIds.delete(id), 10000);
  return true;
}

type AdminAlertsValue = {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
};

const AdminAlertsContext = createContext<AdminAlertsValue | null>(null);

function mapNotification(row: Record<string, unknown>): Notification {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    read: Boolean(row.read),
    created_at: String(row.created_at),
  };
}

function pushLocalAlert(
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  detail: DonationAlertDetail
) {
  const next: Notification = {
    id: detail.id || `local-${Date.now()}`,
    title: "New donation received",
    body: `${detail.donor_name} donated ${formatCurrencyExact(detail.amount)} to ${detail.campaign_title}`,
    read: false,
    created_at: detail.created_at || new Date().toISOString(),
  };
  setNotifications((prev) => {
    if (prev.some((n) => n.id === next.id)) return prev;
    return [next, ...prev];
  });
  return next;
}

export function AdminAlertsProvider({
  adminId,
  children,
}: {
  adminId: string;
  children: ReactNode;
}) {
  const { pushToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const { data } = await getSupabase()!
      .from("wecare_notifications")
      .select("*")
      .or(`user_id.eq.${adminId},user_id.is.null`)
      .order("created_at", { ascending: false })
      .limit(40);
    if (data) setNotifications(data.map(mapNotification));
  }, [adminId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const alertOnce = (detail: DonationAlertDetail) => {
      const key = detail.id || `${detail.donor_name}-${detail.amount}-${detail.campaign_title}`;
      if (!rememberAlert(key)) return;
      const note = pushLocalAlert(setNotifications, detail);
      pushToast({
        title: note.title,
        body: note.body,
        kind: "success",
        id: `toast-${key}`,
      });
    };

    const onLocal = (event: Event) => {
      const detail = (event as CustomEvent<DonationAlertDetail>).detail;
      if (!detail) return;
      alertOnce(detail);
    };
    window.addEventListener(DONATION_ALERT_EVENT, onLocal);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("wecare-donations");
      channel.onmessage = (msg) => {
        const detail = msg.data as DonationAlertDetail;
        if (!detail?.donor_name) return;
        alertOnce(detail);
      };
    } catch {
      /* ignore */
    }

    return () => {
      window.removeEventListener(DONATION_ALERT_EVENT, onLocal);
      channel?.close();
    };
  }, [pushToast]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase()!;

    const channel = supabase
      .channel(`admin-alerts-${adminId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wecare_donations" },
        async (payload) => {
          const row = payload.new as Record<string, unknown>;
          const id = String(row.id || "");
          if (id && !rememberAlert(id)) {
            // already toasted via broadcast — still merge into list if needed
            return;
          }
          const campaignId = String(row.campaign_id || "");
          let campaignTitle = "a campaign";
          if (campaignId) {
            const { data } = await supabase
              .from("wecare_campaigns")
              .select("title")
              .eq("id", campaignId)
              .maybeSingle();
            if (data?.title) campaignTitle = String(data.title);
          }
          const donor = String(row.donor_name || "Someone");
          const amount = Number(row.amount || 0);
          const body = `${donor} donated ${formatCurrencyExact(amount)} to ${campaignTitle}`;
          pushToast({
            title: "New donation received",
            body,
            kind: "success",
            id: `toast-${id || body}`,
          });
          setNotifications((prev) => {
            if (prev.some((n) => n.id === id || n.id === `don-${id}` || n.body === body)) {
              return prev;
            }
            return [
              {
                id: id || `don-${Date.now()}`,
                title: "New donation received",
                body,
                read: false,
                created_at: String(row.created_at || new Date().toISOString()),
              },
              ...prev,
            ];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wecare_notifications" },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const userId = row.user_id ? String(row.user_id) : null;
          if (userId && userId !== adminId) return;
          const note = mapNotification(row);
          setNotifications((prev) => {
            if (prev.some((n) => n.id === note.id || n.body === note.body)) return prev;
            return [note, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [adminId, pushToast]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      if (!isSupabaseConfigured() || id.startsWith("don-") || id.startsWith("local-")) {
        return;
      }
      await getSupabase()!
        .from("wecare_notifications")
        .update({ read: true })
        .eq("id", id);
    },
    []
  );

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!isSupabaseConfigured()) return;
    await getSupabase()!
      .from("wecare_notifications")
      .update({ read: true })
      .eq("user_id", adminId)
      .eq("read", false);
  }, [adminId]);

  const value = useMemo(
    () => ({ notifications, unreadCount, markAllRead, markRead }),
    [notifications, unreadCount, markAllRead, markRead]
  );

  return (
    <AdminAlertsContext.Provider value={value}>{children}</AdminAlertsContext.Provider>
  );
}

export function useAdminAlerts() {
  const ctx = useContext(AdminAlertsContext);
  if (!ctx) throw new Error("useAdminAlerts must be used within AdminAlertsProvider");
  return ctx;
}
