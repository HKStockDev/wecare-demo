"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { CATEGORIES } from "@/lib/demo-data";
import { useCampaigns } from "@/lib/data";
import type { Campaign } from "@/lib/types";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { upsert } = useCampaigns();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Education");
  const [goal, setGoal] = useState("10000");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const campaign: Campaign = {
      id: `c-${Date.now()}`,
      title,
      description,
      category,
      image_url:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      goal_amount: Number(goal) || 10000,
      raised_amount: 0,
      donors_count: 0,
      status: "active",
      created_at: new Date().toISOString(),
    };
    try {
      const created = await upsert(campaign);
      setSaved(true);
      setTimeout(() => router.push(`/app/campaigns/${created.id}`), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign");
    }
  }

  return (
    <div className="min-h-full bg-white px-4 py-5">
      <h1 className="text-xl font-extrabold">Create Campaign</h1>
      <p className="mt-1 text-sm text-muted">
        Share your cause and start raising funds
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label>Campaign Title *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Education for All"
            required
          />
        </div>
        <div>
          <Label>Category *</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Goal Amount (USD) *</Label>
          <Input
            type="number"
            min={100}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Description *</Label>
          <Textarea
            className="min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell supporters why this matters..."
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={saved}>
          {saved ? "Campaign created!" : "Publish Campaign"}
        </Button>
      </form>
    </div>
  );
}
