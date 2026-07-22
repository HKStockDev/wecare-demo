"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Heart,
  LogOut,
  Settings,
  User,
  X,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth";
import { avatarForName } from "@/lib/avatars";
import { cn } from "@/lib/utils";

type AppSideMenuProps = {
  open: boolean;
  onClose: () => void;
};

const links = [
  { href: "/app/profile", label: "My Profile", icon: User },
  { href: "/app/explore", label: "Explore Campaigns", icon: Compass },
  { href: "/app/create", label: "My Campaigns", icon: Heart },
  { href: "/app/profile", label: "Settings", icon: Settings },
];

export function AppSideMenu({ open, onClose }: AppSideMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    onClose();
    await logout();
    router.replace("/login");
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          "absolute inset-0 z-40 bg-black/40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute bottom-0 left-0 top-0 z-50 flex w-[78%] max-w-[300px] flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="bg-gradient-to-br from-brand to-brand-dark px-4 pb-5 pt-5 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrandLogo size={36} />
              <span className="text-lg font-extrabold">Wecare</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/15 p-1.5 hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Avatar
              src={user?.avatar_url || avatarForName(user?.full_name)}
              name={user?.full_name}
              size={48}
              className="border-2 border-white/40"
            />
            <div className="min-w-0">
              <p className="truncate font-bold">{user?.full_name}</p>
              <p className="truncate text-xs text-white/75">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-brand-light"
              >
                <Icon className="h-5 w-5 text-brand" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
