"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useDonations } from "@/lib/data";
import { formatCurrencyExact, timeAgo } from "@/lib/utils";

export default function AdminDonationsPage() {
  const [query, setQuery] = useState("");
  const { donations } = useDonations();
  const filtered = donations.filter(
    (d) =>
      d.donor_name.toLowerCase().includes(query.toLowerCase()) ||
      d.campaign_title.toLowerCase().includes(query.toLowerCase())
  );
  const total = useMemo(
    () => filtered.reduce((s, d) => s + d.amount, 0),
    [filtered]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Donations</h1>
        <p className="text-sm text-muted">
          Track all payments · Total shown:{" "}
          <span className="font-bold text-brand">{formatCurrencyExact(total)}</span>
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search donors or campaigns..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-gray-50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Donor</th>
              <th className="px-4 py-3 font-semibold">Campaign</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">When</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-semibold">{d.donor_name}</td>
                <td className="px-4 py-3 text-muted">{d.campaign_title}</td>
                <td className="px-4 py-3 font-bold text-brand">
                  {formatCurrencyExact(d.amount)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand">
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{timeAgo(d.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
