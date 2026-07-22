"use client";

import { Button, Input, Label, Textarea } from "@/components/ui";
import { useState } from "react";
import { Bell, Send } from "lucide-react";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  function onSend(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setTitle("");
      setBody("");
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Push Notifications</h1>
        <p className="text-sm text-muted">
          Send demo notifications (Firebase FCM integration in production)
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
        <Button type="submit" className="w-full" disabled={sent}>
          <Send className="h-4 w-4" />
          {sent ? "Sent (demo)!" : "Send Notification"}
        </Button>
      </form>
    </div>
  );
}
