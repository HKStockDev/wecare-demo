export const PUSH_NOTIFICATION_EVENT = "wecare:push-notification";

export type PushNotificationDetail = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

/** Cross-tab / same-browser demo broadcast when Supabase is unavailable. */
export function broadcastPushNotification(detail: PushNotificationDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PUSH_NOTIFICATION_EVENT, { detail }));
  try {
    const channel = new BroadcastChannel("wecare-push-notifications");
    channel.postMessage(detail);
    channel.close();
  } catch {
    /* ignore */
  }
}
