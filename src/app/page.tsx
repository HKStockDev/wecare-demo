import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LayoutDashboard, Smartphone } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-gradient-to-br from-[#0b2d26] via-[#0f3d32] to-[#1b8e3d] text-white">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-6 py-16">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-brand-accent shadow-lg shadow-black/30">
            <Image
              src="/images/logo.png"
              alt="Wecare"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Wecare
          </h1>
          <p className="max-w-md text-base text-white/75 sm:text-lg">
            Fundraising & community engagement platform — client demo
          </p>
        </div>

        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <Link
            href="/login"
            className="group flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur transition hover:bg-white/15"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/20 text-brand-accent">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">User Portal</h2>
              <p className="mt-1 text-sm text-white/65">
                Browse campaigns, donate, join events — mobile web experience
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-accent">
              Open app <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/admin/login"
            className="group flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur transition hover:bg-white/15"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/20 text-brand-accent">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Dashboard</h2>
              <p className="mt-1 text-sm text-white/65">
                Manage campaigns, donations, users, and community activity
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-accent">
              Open admin <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-center text-sm text-white/70">
          <p className="font-medium text-white/90">Demo accounts</p>
          <p className="mt-2">
            User: <code className="text-brand-accent">john@wecare.app</code> /{" "}
            <code className="text-brand-accent">demo123</code>
          </p>
          <p>
            Admin: <code className="text-brand-accent">admin@wecare.app</code> /{" "}
            <code className="text-brand-accent">admin123</code>
          </p>
        </div>
      </div>
    </main>
  );
}
