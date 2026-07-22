"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft, Heart, Share2, Users } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { Button, ProgressBar } from "@/components/ui";
import { useCampaigns } from "@/lib/data";
import { formatCurrency, percentRaised } from "@/lib/utils";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { campaigns, loading } = useCampaigns();
  const campaign = useMemo(() => campaigns.find((c) => c.id === id), [campaigns, id]);

  if (loading) {
    return <div className="p-8 text-center text-muted">Loading...</div>;
  }

  if (!campaign) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted">Campaign not found</p>
        <Button className="mt-4" onClick={() => router.push("/app/explore")}>
          Back to Explore
        </Button>
      </div>
    );
  }

  const pct = percentRaised(campaign.raised_amount, campaign.goal_amount);

  return (
    <div className="bg-white min-h-full pb-8">
      <div className="relative h-56 w-full">
        <SafeImage
          src={campaign.image_url}
          alt={campaign.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-4 top-4 rounded-full bg-white/90 p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute right-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/90 p-2">
            <Heart className="h-5 w-5 text-muted" />
          </span>
          <span className="rounded-full bg-white/90 p-2">
            <Share2 className="h-5 w-5 text-muted" />
          </span>
        </div>
        <span className="absolute bottom-4 left-4 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-brand">
          {campaign.category}
        </span>
      </div>

      <div className="px-4 pt-4">
        <h1 className="text-2xl font-extrabold">{campaign.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{campaign.description}</p>

        <div className="mt-5 rounded-2xl border border-border bg-gray-50 p-4">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-2xl font-extrabold text-brand">
                {formatCurrency(campaign.raised_amount)}
              </p>
              <p className="text-sm text-muted">
                raised of {formatCurrency(campaign.goal_amount)} goal
              </p>
            </div>
            <p className="text-lg font-bold text-foreground">{pct}%</p>
          </div>
          <ProgressBar value={pct} />
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
            <Users className="h-4 w-4" /> {campaign.donors_count} generous donors
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          {[25, 50, 100].map((amt) => (
            <Link
              key={amt}
              href={`/app/donate/${campaign.id}?amount=${amt}`}
              className="flex-1 rounded-xl border border-brand/30 bg-brand-light py-2.5 text-center text-sm font-bold text-brand"
            >
              ${amt}
            </Link>
          ))}
        </div>

        <Link href={`/app/donate/${campaign.id}?amount=50`} className="mt-4 block">
          <Button className="w-full py-3.5 text-base">Donate Now</Button>
        </Link>
      </div>
    </div>
  );
}
