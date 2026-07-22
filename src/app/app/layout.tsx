"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Compass,
  Home,
  MessageCircle,
  Plus,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/app/create", label: "Create", icon: Plus, fab: true },
  { href: "/app/messages", label: "Messages", icon: MessageCircle },
  { href: "/app/profile", label: "Profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!loading && user?.role === "admin") router.replace("/admin");
  }, [user, loading, router]);

  if (loading || !user || user.role === "admin") {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#f7faf8]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  const hideNav = pathname.includes("/donate") || pathname.includes("/profile/complete");

  return (
    <div className="h-dvh overflow-hidden bg-[#eef2f0]">
      <div className={cn("phone-shell", hideNav ? "" : "pb-0")}>
        <div className={cn("phone-shell-scroll", !hideNav && "pb-24")}>
          {children}
        </div>
        {!hideNav && (
          <nav className="absolute bottom-0 left-0 right-0 z-20 border-t border-border bg-white px-2 pb-3 pt-2">
            <div className="relative flex items-end justify-around">
              {tabs.map((tab) => {
                const active =
                  tab.href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(tab.href);
                if (tab.fab) {
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40"
                    >
                      <Plus className="h-7 w-7" strokeWidth={2.5} />
                    </Link>
                  );
                }
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      "flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-medium",
                      active ? "text-brand" : "text-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
