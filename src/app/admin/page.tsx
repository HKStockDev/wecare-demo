"use client";

import Link from "next/link";
import {
  BarChart3,
  Bell,
  FolderHeart,
  Heart,
  MessageCircle,
  Plus,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Avatar } from "@/components/Avatar";
import { SafeImage } from "@/components/SafeImage";
import { ProgressBar } from "@/components/ui";
import {
  ADMIN_STATS,
  CHART_DATA,
} from "@/lib/demo-data";
import { useActivities, useCampaigns, useDonations } from "@/lib/data";
import { formatCurrency, formatCurrencyExact, percentRaised, timeAgo } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { campaigns: allCampaigns } = useCampaigns();
  const { donations: allDonations } = useDonations();
  const { activities } = useActivities();
  const campaigns = allCampaigns.slice(0, 4);
  const donations = allDonations.slice(0, 5);

  const stats = [
    {
      label: "Total Funds Raised",
      value: formatCurrency(ADMIN_STATS.totalFunds),
      growth: `+${ADMIN_STATS.fundsGrowth}% from last 30 days`,
      icon: Heart,
    },
    {
      label: "Total Supporters",
      value: ADMIN_STATS.totalSupporters.toLocaleString(),
      growth: `+${ADMIN_STATS.supportersGrowth}% from last 30 days`,
      icon: Users,
    },
    {
      label: "Active Campaigns",
      value: String(ADMIN_STATS.activeCampaigns),
      growth: `+${ADMIN_STATS.campaignsGrowth} new this week`,
      icon: FolderHeart,
    },
    {
      label: "Community Members",
      value: ADMIN_STATS.communityMembers.toLocaleString(),
      growth: `+${ADMIN_STATS.membersGrowth}% from last 30 days`,
      icon: MessageCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="anim-fade-up">
        <h1 className="text-2xl font-extrabold lg:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Welcome back! Here&apos;s what&apos;s happening with your fundraising and community today.
        </p>
      </div>

      <div className="anim-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-white p-5 shadow-sm anim-hover-lift"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{s.label}</p>
                <p className="mt-1 text-2xl font-extrabold">{s.value}</p>
              </div>
              <div className="rounded-xl bg-brand-light p-2.5 text-brand">
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-brand-accent">{s.growth}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Fundraising Overview</h2>
            <select className="rounded-lg border border-border bg-gray-50 px-2 py-1 text-xs">
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="fundFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#28C76F" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#28C76F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#28C76F"
                  strokeWidth={2.5}
                  fill="url(#fundFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Recent Campaigns</h2>
            <Link href="/admin/campaigns" className="text-sm font-semibold text-brand">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {campaigns.map((c) => {
              const pct = percentRaised(c.raised_amount, c.goal_amount);
              return (
                <div key={c.id} className="flex gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <SafeImage src={c.image_url} alt="" fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <ProgressBar value={pct} className="mt-1.5" />
                    <p className="mt-1 text-[11px] text-muted">
                      {pct}% funded · {formatCurrency(c.raised_amount)} /{" "}
                      {formatCurrency(c.goal_amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-bold">Recent Donations</h2>
          <div className="space-y-3">
            {donations.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <Avatar src={undefined} name={d.donor_name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{d.donor_name}</p>
                  <p className="truncate text-xs text-muted">{d.campaign_title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrencyExact(d.amount)}</p>
                  <p className="text-[11px] text-muted">{timeAgo(d.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-bold">Community Activity</h2>
          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="flex gap-3">
                <Avatar name={a.user_name} src={a.avatar_url} size={40} />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{a.user_name}</span>{" "}
                    <span className="text-muted">{a.action}</span>
                  </p>
                  <p className="text-[11px] text-muted">{timeAgo(a.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-bold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Create Campaign", icon: Plus, href: "/admin/campaigns" },
              { label: "Send Notification", icon: Bell, href: "/admin/notifications" },
              { label: "Manage Users", icon: Users, href: "/admin/users" },
              { label: "View Reports", icon: BarChart3, href: "/admin/reports" },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-center transition hover:border-brand/30 hover:bg-brand-light/40"
              >
                <a.icon className="h-5 w-5 text-brand" />
                <span className="text-xs font-semibold">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
