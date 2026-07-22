"use client";

import { Bell, MessageCircle } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/demo-data";
import { timeAgo } from "@/lib/utils";

const messages = [
  {
    id: "m1",
    name: "Wecare Support",
    preview: "Thanks for joining our community!",
    time: "1h",
  },
  {
    id: "m2",
    name: "Education for All",
    preview: "Your donation helped 12 more students.",
    time: "1d",
  },
  {
    id: "m3",
    name: "Event Organizer",
    preview: "Reminder: Community Cleanup this Sunday.",
    time: "2d",
  },
];

export default function MessagesPage() {
  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-border px-4 py-4">
        <h1 className="text-xl font-extrabold">Messages</h1>
      </header>

      <section className="border-b border-border px-4 py-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-muted">
          <Bell className="h-4 w-4" /> Notifications
        </h2>
        <div className="space-y-2">
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="rounded-xl border border-border bg-brand-light/40 px-3 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">{n.title}</p>
                {!n.read && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted">{n.body}</p>
              <p className="mt-1 text-[11px] text-muted">{timeAgo(n.created_at)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-muted">
          <MessageCircle className="h-4 w-4" /> Inbox
        </h2>
        <div className="space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-border px-3 py-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {m.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <span className="text-[11px] text-muted">{m.time}</span>
                </div>
                <p className="truncate text-xs text-muted">{m.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
