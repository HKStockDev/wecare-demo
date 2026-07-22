"use client";

import { Avatar } from "@/components/Avatar";
import { DEMO_USERS } from "@/lib/demo-data";

const users = [
  {
    ...DEMO_USERS.user,
    donations: 3,
    joined: "Jun 2026",
  },
  {
    id: "u2",
    full_name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "user" as const,
    location: "Boston, USA",
    avatar_url: "/images/avatars/sarah.jpg",
    donations: 8,
    joined: "May 2026",
  },
  {
    id: "u3",
    full_name: "Michael Chen",
    email: "michael@example.com",
    role: "user" as const,
    location: "Seattle, USA",
    avatar_url: "/images/avatars/michael.jpg",
    donations: 5,
    joined: "Apr 2026",
  },
  {
    id: "u4",
    full_name: "Emma Wilson",
    email: "emma@example.com",
    role: "user" as const,
    location: "Austin, USA",
    avatar_url: "/images/avatars/emma.jpg",
    donations: 12,
    joined: "Mar 2026",
  },
  {
    ...DEMO_USERS.admin,
    donations: 0,
    joined: "Jan 2026",
  },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Users</h1>
        <p className="text-sm text-muted">Community members and administrators</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-gray-50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Donations</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={"avatar_url" in u ? u.avatar_url : undefined}
                      name={u.full_name}
                      size={36}
                    />
                    <div>
                      <p className="font-semibold">{u.full_name}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      u.role === "admin"
                        ? "bg-brand-light text-brand"
                        : "bg-gray-100 text-muted"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{u.location}</td>
                <td className="px-4 py-3 font-semibold">{u.donations}</td>
                <td className="px-4 py-3 text-muted">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
