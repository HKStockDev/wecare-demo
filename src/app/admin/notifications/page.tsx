"use client";

import { useState } from "react";
import { Bell, Send } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { broadcastPushNotification } from "@/lib/push-notifications";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminNotificationsPage() {
  const { pushToast } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    setStatus(null);

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    try {
      if (isSupabaseConfigured()) {
        const { data, error: rpcError } = await getSupabase()!.rpc(
          "wecare_push_notification",
          { p_title: trimmedTitle, p_body: trimmedBody }
        );
        if (rpcError) throw new Error(rpcError.message);
        const count = typeof data === "number" ? data : Number(data) || 0;
        setStatus(`Sent to ${count} user${count === 1 ? "" : "s"}`);
        pushToast({
          title: "Notification sent",
          body: `Delivered to ${count} user${count === 1 ? "" : "s"}`,
          kind: "success",
          durationMs: 3000,
        });
      } else {
        broadcastPushNotification({
          id: `push-${Date.now()}`,
          title: trimmedTitle,
          body: trimmedBody,
          created_at: new Date().toISOString(),
        });
        setStatus("Sent to online users (demo mode)");
        pushToast({
          title: "Notification sent",
          body: "Demo broadcast to open user sessions",
          kind: "success",
          durationMs: 3000,
        });
      }
      setTitle("");
      setBody("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send";
      setError(message);
      pushToast({ title: "Send failed", body: message, kind: "error" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 anim-fade-up">
      <div>
        <h1 className="text-2xl font-extrabold">Push Notifications</h1>
        <p className="text-sm text-muted">
          Send live notifications to all users. They appear on the user bell via
          Supabase Realtime.
        </p>
      </div>

      <form
        onSubmit={onSend}
        className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 text-brand">
          <Bell className="h-5 w-5" />
          <span className="font-semibold">Compose notification</span>
        </div>
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Campaign milestone reached!"
            required
          />
        </div>
        <div>
          <Label>Message</Label>
          <Textarea
            className="min-h-[120px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your push notification..."
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {status && !error && (
          <p className="text-sm font-medium text-brand">{status}</p>
        )}
        <Button type="submit" className="w-full" disabled={sending}>
          <Send className="h-4 w-4" />
          {sending ? "Sending..." : "Send Notification"}
        </Button>
      </form>
    </div>
  );
}
