"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Bell,
  ChevronDown,
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
import Image from "next/image";
import { Avatar } from "@/components/Avatar";
import { BrandLogo } from "@/components/BrandLogo";
import { LoginNotificationToast } from "@/components/LoginNotificationToast";
import { PageMotion } from "@/components/Motion";
import { AdminAlertsProvider, useAdminAlerts } from "@/lib/admin-alerts";
import { useAuth } from "@/lib/auth";
import { cn, timeAgo } from "@/lib/utils";

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

function AdminBell() {
  const { notifications, unreadCount, markAllRead, markRead } = useAdminAlerts();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full border border-border p-2 hover:bg-gray-50 anim-press"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4 text-muted" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-20 cursor-default"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-xl anim-slide-down">
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <p className="text-sm font-bold">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => void markAllRead()}
                  className="text-xs font-semibold text-brand"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted">
                  No notifications yet
                </p>
              )}
              {notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    void markRead(n.id);
                  }}
                  className={cn(
                    "block w-full border-b border-border px-3 py-2.5 text-left last:border-0 hover:bg-gray-50",
                    !n.read && "bg-brand-light/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    {!n.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted">{timeAgo(n.created_at)}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!user) return null;

  async function handleSignOut() {
    setOpen(false);
    await logout();
    router.replace("/admin/login");
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-gray-50 anim-press",
          open && "bg-gray-50"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <Avatar src={user.avatar_url} name={user.full_name} size={36} />
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-tight">{user.full_name}</p>
          <p className="text-[11px] text-muted">Administrator</p>
        </div>
        <ChevronDown
          className={cn(
            "hidden h-4 w-4 text-muted transition-transform sm:block",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-20 cursor-default"
            aria-label="Close account menu"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-white shadow-xl anim-slide-down"
          >
            <div className="border-b border-border px-3 py-3">
              <p className="truncate text-sm font-bold">{user.full_name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            <div className="p-1.5">
              <Link
                href="/admin/settings"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 text-muted" />
                Settings
              </Link>
              <Link
                href="/admin/notifications"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-gray-50"
              >
                <Bell className="h-4 w-4 text-muted" />
                Notifications
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => void handleSignOut()}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminLoginToast() {
  const { notifications, ready } = useAdminAlerts();
  return <LoginNotificationToast notifications={notifications} ready={ready} />;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <AdminAlertsProvider adminId={user.id}>
      <AdminLoginToast />
      <div className="flex min-h-dvh bg-[#f8f9fa] anim-page">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-brand-dark text-white lg:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-2.5">
              <BrandLogo size={36} />
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

          <div className="mx-3 mb-4 overflow-hidden rounded-2xl bg-[#0f3d32]">
            <div className="relative h-16 w-full">
              <Image
                src="/images/admin-sidebar-art.jpg"
                alt=""
                fill
                className="object-cover opacity-70"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f3d32] to-transparent" />
            </div>
            <div className="p-4 pt-2">
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
                className="w-full rounded-xl border border-border bg-gray-50 py-2.5 pl-4 pr-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <AdminBell />
              <AdminProfileMenu />
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            <PageMotion key={pathname}>{children}</PageMotion>
          </main>
        </div>
      </div>
    </AdminAlertsProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (isLogin) {
      if (user?.role === "admin") router.replace("/admin");
      else if (user) router.replace("/app");
      return;
    }
    if (!user) router.replace("/admin/login");
    else if (user.role !== "admin") router.replace("/app");
  }, [user, loading, router, isLogin]);

  if (isLogin) {
    if (loading || user) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-[#f8f9fa]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      );
    }
    return <>{children}</>;
  }

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f8f9fa]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
