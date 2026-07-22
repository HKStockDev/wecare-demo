"use client";

import { ADMIN_STATS, CHART_DATA } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Reports & Analytics</h1>
        <p className="text-sm text-muted">Fundraising performance overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Total Raised</p>
          <p className="mt-1 text-2xl font-extrabold text-brand">
            {formatCurrency(ADMIN_STATS.totalFunds)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Avg Daily</p>
          <p className="mt-1 text-2xl font-extrabold">
            {formatCurrency(
              Math.round(
                CHART_DATA.reduce((s, d) => s + d.amount, 0) / CHART_DATA.length
              )
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Supporters</p>
          <p className="mt-1 text-2xl font-extrabold">
            {ADMIN_STATS.totalSupporters.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold">Daily Fundraising</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="amount" fill="#28C76F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
