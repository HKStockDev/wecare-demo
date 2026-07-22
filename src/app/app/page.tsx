"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bell,
  Clock,
  GraduationCap,
  Heart,
  HeartPulse,
  LayoutGrid,
  Leaf,
  MapPin,
  Menu,
  PawPrint,
  Search,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SafeImage } from "@/components/SafeImage";
import { Avatar } from "@/components/Avatar";
import { Button, ProgressBar } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { CATEGORIES, DONOR_AVATARS } from "@/lib/demo-data";
import { useCampaigns, useEvents, useNotifications } from "@/lib/data";
import { formatCurrency, formatEventDate, percentRaised } from "@/lib/utils";
import { avatarForName } from "@/lib/avatars";

const iconMap = {
  GraduationCap,
  HeartPulse,
  Leaf,
  PawPrint,
  Users,
  LayoutGrid,
};

export default function HomePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const { campaigns: allCampaigns } = useCampaigns();
  const { events } = useEvents();
  const { notifications } = useNotifications();

  const campaigns = useMemo(() => {
    const list = allCampaigns;
    if (!query.trim()) return list.slice(0, 3);
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allCampaigns]);

  const firstName = user?.full_name?.split(" ")[0] || "Friend";
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-white">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" className="rounded-lg p-1 text-foreground">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <BrandLogo size={32} />
            <span className="text-lg font-extrabold text-brand">Wecare</span>
          </div>
          <Link href="/app/messages" className="relative rounded-lg p-1">
            <Bell className="h-6 w-6 text-foreground" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.avatar_url || avatarForName(user?.full_name)}
            name={user?.full_name}
            size={44}
          />
          <div>
            <h1 className="flex items-center gap-1.5 text-xl font-bold">
              Hello, {firstName}
              <Image
                src="/images/icon-wave.png"
                alt=""
                width={22}
                height={22}
                className="inline-block"
                unoptimized
              />
            </h1>
            <p className="flex items-center gap-1 text-sm text-muted">
              Together, we can change lives
              <Image
                src="/images/icon-heart.png"
                alt=""
                width={16}
                height={16}
                className="inline-block"
                unoptimized
              />
            </p>
          </div>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campaigns, causes or events..."
            className="w-full rounded-xl border border-border bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand"
          />
        </div>
      </header>

      <div className="space-y-6 px-4 py-4">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#d9f2e3] to-[#eefaf2]">
          <div className="relative z-0 p-5 pr-28">
            <p className="text-lg font-bold text-foreground">
              Small Act, <span className="text-brand">Big Impact</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Your support can bring hope and change lives.
            </p>
            <Link href="/app/explore">
              <Button className="mt-4">Donate Now</Button>
            </Link>
          </div>
          <div className="absolute bottom-0 right-0 top-0 w-32">
            <SafeImage
              src="/images/hero-community.jpg"
              alt="Community volunteers"
              fill
              className="object-cover object-left"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#eefaf2] via-[#eefaf2]/40 to-transparent" />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">Popular Campaigns</h2>
            <Link href="/app/explore" className="text-sm font-semibold text-brand">
              View all &gt;
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {campaigns.map((c) => (
              <Link
                key={c.id}
                href={`/app/campaigns/${c.id}`}
                className="w-[240px] shrink-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="relative h-32 w-full">
                  <SafeImage src={c.image_url} alt={c.title} fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-brand">
                    {c.category}
                  </span>
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-muted">
                    <Heart className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="truncate font-bold">{c.title}</h3>
                  <ProgressBar value={percentRaised(c.raised_amount, c.goal_amount)} className="mt-2" />
                  <p className="mt-1.5 text-xs text-muted">
                    <span className="font-semibold text-brand">
                      {formatCurrency(c.raised_amount)}
                    </span>{" "}
                    raised of {formatCurrency(c.goal_amount)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {DONOR_AVATARS.map((src) => (
                        <Avatar key={src} src={src} size={22} className="border-2 border-white" />
                      ))}
                    </div>
                    <p className="text-xs text-muted">{c.donors_count} donors</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">Categories</h2>
            <Link href="/app/explore" className="text-sm font-semibold text-brand">
              View all &gt;
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.icon as keyof typeof iconMap];
              return (
                <Link
                  key={cat.id}
                  href={`/app/explore?category=${cat.name}`}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-3 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="pb-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">Upcoming Events</h2>
            <span className="text-sm font-semibold text-brand">View all &gt;</span>
          </div>
          <div className="space-y-3">
            {events.map((ev) => {
              const { month, day } = formatEventDate(ev.date);
              return (
                <div
                  key={ev.id}
                  className="flex gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm"
                >
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-brand-light text-brand">
                    <span className="text-[10px] font-bold">{month}</span>
                    <span className="text-lg font-extrabold leading-none">{day}</span>
                  </div>
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <SafeImage src={ev.image_url} alt={ev.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold">{ev.title}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                      <MapPin className="h-3 w-3" /> {ev.location}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                      <Clock className="h-3 w-3" /> {ev.time}
                    </p>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" className="px-3 py-1.5 text-xs">
                        Join Event
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
