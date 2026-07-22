"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Search } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { ProgressBar } from "@/components/ui";
import { CATEGORIES } from "@/lib/demo-data";
import { useCampaigns } from "@/lib/data";
import { formatCurrency, percentRaised } from "@/lib/utils";
import { Suspense } from "react";

function ExploreContent() {
  const params = useSearchParams();
  const initial = params.get("category") || "All";
  const [category, setCategory] = useState(initial);
  const [query, setQuery] = useState("");
  const { campaigns: all } = useCampaigns();

  const campaigns = useMemo(() => {
    return all.filter((c) => {
      const matchCat = category === "All" || c.category === category;
      const matchQ =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [category, query, all]);

  return (
    <div className="bg-white min-h-full">
      <header className="sticky top-0 z-10 border-b border-border bg-white px-4 py-4">
        <h1 className="text-xl font-extrabold">Explore Campaigns</h1>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search causes..."
            className="w-full rounded-xl border border-border bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All", ...CATEGORIES.map((c) => c.name)].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                category === c
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-4 p-4">
        {campaigns.map((c) => (
          <Link
            key={c.id}
            href={`/app/campaigns/${c.id}`}
            className="block overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
          >
            <div className="relative h-40 w-full">
              <SafeImage src={c.image_url} alt={c.title} fill className="object-cover" />
              <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-brand">
                {c.category}
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5">
                <Heart className="h-4 w-4 text-muted" />
              </span>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold">{c.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{c.description}</p>
              <ProgressBar
                value={percentRaised(c.raised_amount, c.goal_amount)}
                className="mt-3"
              />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span>
                  <span className="font-bold text-brand">
                    {formatCurrency(c.raised_amount)}
                  </span>{" "}
                  <span className="text-muted">of {formatCurrency(c.goal_amount)}</span>
                </span>
                <span className="text-muted">{c.donors_count} donors</span>
              </div>
            </div>
          </Link>
        ))}
        {campaigns.length === 0 && (
          <p className="py-12 text-center text-muted">No campaigns found.</p>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
