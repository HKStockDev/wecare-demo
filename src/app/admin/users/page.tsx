"use client";

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
    donations: 8,
    joined: "May 2026",
  },
  {
    id: "u3",
    full_name: "Michael Chen",
    email: "michael@example.com",
    role: "user" as const,
    location: "Seattle, USA",
    donations: 5,
    joined: "Apr 2026",
  },
  {
    id: "u4",
    full_name: "Emma Wilson",
    email: "emma@example.com",
    role: "user" as const,
    location: "Austin, USA",
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                      {u.full_name[0]}
                    </div>
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
                        ? "bg-amber-50 text-amber-700"
                        : "bg-brand-light text-brand"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{u.location || "—"}</td>
                <td className="px-4 py-3">{u.donations}</td>
                <td className="px-4 py-3 text-muted">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
