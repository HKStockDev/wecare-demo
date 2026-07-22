"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { Button, ProgressBar } from "@/components/ui";
import { useCampaigns } from "@/lib/data";
import { formatCurrency, percentRaised } from "@/lib/utils";
import type { Campaign } from "@/lib/types";

export default function AdminCampaignsPage() {
  const [query, setQuery] = useState("");
  const { campaigns, upsert } = useCampaigns();

  const filtered = useMemo(
    () =>
      campaigns.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      ),
    [campaigns, query]
  );

  async function toggleStatus(c: Campaign) {
    await upsert({
      ...c,
      status: c.status === "active" ? "paused" : "active",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Campaigns</h1>
          <p className="text-sm text-muted">Manage all fundraising campaigns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> New Campaign
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-gray-50 text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Campaign</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
                <th className="px-4 py-3 font-semibold">Donors</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const pct = percentRaised(c.raised_amount, c.goal_amount);
                return (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                          <SafeImage src={c.image_url} alt="" fill className="object-cover" />
                        </div>
                        <span className="font-semibold">{c.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{c.category}</td>
                    <td className="px-4 py-3">
                      <div className="w-40">
                        <ProgressBar value={pct} />
                        <p className="mt-1 text-xs text-muted">
                          {formatCurrency(c.raised_amount)} / {formatCurrency(c.goal_amount)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{c.donors_count}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          c.status === "active"
                            ? "bg-brand-light text-brand"
                            : "bg-gray-100 text-muted"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void toggleStatus(c)}
                        className="text-sm font-semibold text-brand"
                      >
                        {c.status === "active" ? "Pause" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
