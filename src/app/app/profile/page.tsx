"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Settings,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useDonations } from "@/lib/data";
import { formatCurrencyExact, timeAgo } from "@/lib/utils";
import { useMemo } from "react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { donations } = useDonations();
  const myDonations = useMemo(() => {
    return donations.filter(
      (d) => d.donor_name === user?.full_name || d.donor_name === "John Doe"
    );
  }, [user, donations]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="min-h-full bg-white">
      <div className="bg-gradient-to-b from-brand-light to-white px-4 pb-6 pt-8">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white shadow-md">
            {user?.full_name?.[0] || "U"}
          </div>
          <div>
            <h1 className="text-xl font-extrabold">{user?.full_name}</h1>
            <p className="text-sm text-muted">{user?.email}</p>
            {user?.location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                <MapPin className="h-3 w-3" /> {user.location}
              </p>
            )}
          </div>
        </div>
        {user?.bio && (
          <p className="mt-4 text-sm leading-relaxed text-muted">{user.bio}</p>
        )}
        <Link href="/app/profile/complete">
          <Button variant="outline" className="mt-4 w-full">
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        <div className="rounded-2xl border border-border bg-gray-50 p-4 text-center">
          <Wallet className="mx-auto h-5 w-5 text-brand" />
          <p className="mt-2 text-lg font-extrabold">
            {formatCurrencyExact(
              myDonations.reduce((s, d) => s + d.amount, 0)
            )}
          </p>
          <p className="text-xs text-muted">Total donated</p>
        </div>
        <div className="rounded-2xl border border-border bg-gray-50 p-4 text-center">
          <Heart className="mx-auto h-5 w-5 text-brand" />
          <p className="mt-2 text-lg font-extrabold">{myDonations.length}</p>
          <p className="text-xs text-muted">Donations</p>
        </div>
      </div>

      <div className="mt-6 px-4">
        <h2 className="mb-3 font-bold">Recent Donations</h2>
        <div className="space-y-2">
          {myDonations.slice(0, 5).map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-xl border border-border px-3 py-3"
            >
              <div>
                <p className="text-sm font-semibold">{d.campaign_title}</p>
                <p className="text-xs text-muted">{timeAgo(d.created_at)}</p>
              </div>
              <p className="font-bold text-brand">
                {formatCurrencyExact(d.amount)}
              </p>
            </div>
          ))}
          {myDonations.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">
              No donations yet. Explore campaigns to get started!
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-1 px-4 pb-8">
        {[
          { label: "Settings", icon: Settings },
          { label: "My Campaigns", icon: Heart },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-50"
          >
            <item.icon className="h-5 w-5 text-brand" />
            <span className="flex-1 font-medium">{item.label}</span>
            <ChevronRight className="h-4 w-4 text-muted" />
          </button>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-500 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
