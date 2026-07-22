"use client";

import { Avatar } from "@/components/Avatar";
import { useActivities } from "@/lib/data";
import { timeAgo } from "@/lib/utils";

export default function AdminCommunityPage() {
  const { activities } = useActivities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Community</h1>
        <p className="text-sm text-muted">Recent member activity and engagement</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="space-y-4">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <Avatar src={a.avatar_url} name={a.user_name} size={44} />
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
