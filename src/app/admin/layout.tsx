"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  FolderHeart,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/campaigns", label: "Campaigns", icon: FolderHeart },
  { href: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/community", label: "Community", icon: UsersRound },
  { href: "/admin/blog", label: "Blog & Updates", icon: FileText },
  { href: "/admin/notifications", label: "Push Notifications", icon: Bell },
  { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { href: "/admin/payments", label: "Payment Settings", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    if (!loading && !user) router.replace("/admin/login");
    if (!loading && user && user.role !== "admin") router.replace("/app");
  }, [user, loading, router, isLogin]);

  if (isLogin) return <>{children}</>;

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f8f9fa]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-[#f8f9fa]">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-brand-dark text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-brand-accent">
              <Image src="/images/logo.png" alt="" fill className="object-cover" />
            </div>
            <div>
              <p className="font-extrabold leading-tight">Wecare</p>
              <p className="text-[10px] text-white/50">Together for a kinder world.</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "border-l-2 border-brand-accent bg-white/10 text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-3 mb-4 rounded-2xl bg-[#0f3d32] p-4">
          <p className="text-sm font-bold">Together We Make a Difference</p>
          <p className="mt-1 text-xs text-white/55">
            Manage impact. Empower communities.
          </p>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/admin/login");
            }}
            className="mt-3 flex items-center gap-2 text-xs font-semibold text-brand-accent"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <span className="font-extrabold text-brand">Wecare Admin</span>
          </div>
          <div className="relative hidden max-w-md flex-1 md:block">
            <input
              placeholder="Search campaigns, users..."
              className="w-full rounded-xl border border-border bg-gray-50 py-2.5 pl-4 pr-4 text-sm outline-none focus:border-brand"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button type="button" className="relative rounded-full border border-border p-2">
              <Bell className="h-4 w-4 text-muted" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-accent" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight">{user.full_name}</p>
                <p className="text-[11px] text-muted">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
