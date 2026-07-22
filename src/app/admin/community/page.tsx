"use client";

import { ACTIVITIES } from "@/lib/demo-data";
import { timeAgo } from "@/lib/utils";

export default function AdminCommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Community</h1>
        <p className="text-sm text-muted">Recent member activity and engagement</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="space-y-4">
          {ACTIVITIES.map((a) => (
            <div key={a.id} className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: a.avatar_color }}
              >
                {a.user_name[0]}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">{a.user_name}</span>{" "}
                  <span className="text-muted">{a.action}</span>
                </p>
                <p className="mt-1 text-xs text-muted">{timeAgo(a.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
