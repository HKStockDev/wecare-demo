"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Compass,
  Home,
  MessageCircle,
  Plus,
  User,
} from "lucide-react";
import { AppSideMenu } from "@/components/AppSideMenu";
import { LoginNotificationToast } from "@/components/LoginNotificationToast";
import { PageMotion } from "@/components/Motion";
import { AppMenuContext } from "@/lib/app-menu";
import { useAuth } from "@/lib/auth";
import {
  UserNotificationsProvider,
  useUserNotifications,
} from "@/lib/user-notifications";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/app/create", label: "Create", icon: Plus, fab: true },
  { href: "/app/messages", label: "Messages", icon: MessageCircle },
  { href: "/app/profile", label: "Profile", icon: User },
];

function UserLoginToast() {
  const { notifications, ready } = useUserNotifications();
  return <LoginNotificationToast notifications={notifications} ready={ready} />;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuApi = useMemo(
    () => ({ openMenu: () => setMenuOpen(true) }),
    []
  );
  const hideNav = pathname.includes("/donate") || pathname.includes("/profile/complete");

  return (
    <AppMenuContext.Provider value={menuApi}>
      <UserLoginToast />
      <div className="h-dvh overflow-hidden bg-[#eef2f0] anim-page">
        <div className={cn("phone-shell", hideNav ? "" : "pb-0")}>
          <AppSideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
          <div className={cn("phone-shell-scroll", !hideNav && "pb-24")}>
            <PageMotion key={pathname}>{children}</PageMotion>
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
                        className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 anim-press"
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
    </AppMenuContext.Provider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <UserNotificationsProvider userId={user.id}>
      <AppShell>{children}</AppShell>
    </UserNotificationsProvider>
  );
}
