"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Shield, ShieldCheck } from "lucide-react";
import { Button, Field } from "@/components/ui";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth";
import { useRedirectIfAuthenticated } from "@/lib/use-redirect-if-authenticated";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const { loading: authLoading, blocked } = useRedirectIfAuthenticated();
  const router = useRouter();
  const [email, setEmail] = useState("admin@wecare.app");
  const [password, setPassword] = useState("admin123");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const err = await login(email, password, "admin");
    setLoading(false);
    if (err) setError(err);
    else router.push("/admin");
  }

  if (authLoading || blocked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f8f9fa]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left — Admin_dashboard/login.png layout with login_ad artwork */}
      <div className="relative hidden flex-col overflow-hidden bg-gradient-to-b from-[#071a16] via-[#0b2d26] to-[#0f3d32] lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl" />
          <div className="absolute -right-16 bottom-40 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center px-10 pb-8 pt-12 text-center text-white">
          <BrandLogo size={72} className="shadow-xl shadow-black/40" />
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-brand-accent">
            Wecare
          </p>

          <h1 className="mt-10 text-4xl font-extrabold leading-tight xl:text-5xl">
            Welcome <span className="text-brand-accent">Back!</span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-white/70 xl:text-base">
            Sign in to your admin account to continue managing Wecare.
          </p>

          <div className="relative mt-8 w-full max-w-lg flex-1">
            <div className="relative mx-auto h-full min-h-[280px] w-full overflow-hidden">
              <Image
                src="/images/admin-login-people.png"
                alt="Wecare community"
                fill
                className="object-contain object-bottom"
                unoptimized
                priority
              />
            </div>
          </div>

          <div className="mt-6 w-full max-w-lg rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-sm">
            <p className="flex items-center justify-center gap-2 text-sm text-white/85">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-accent" />
              <span>
                <span className="font-semibold text-white">Secure. Reliable. Impactful.</span>{" "}
                Together, we build a better tomorrow.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <BrandLogo size={56} />
            <p className="mt-2 text-lg font-extrabold text-brand">Wecare</p>
          </div>

          <h2 className="text-3xl font-extrabold text-foreground">Admin Portal</h2>
          <p className="mt-1 text-muted">Sign in to access your dashboard</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                Email Address
              </label>
              <Field
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                icon={<Mail className="h-4 w-4" />}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">
                Password
              </label>
              <Field
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={<Lock className="h-4 w-4" />}
                right={
                  <button type="button" onClick={() => setShow((s) => !s)}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-brand"
                />
                Remember me
              </label>
              <button type="button" className="font-medium text-brand">
                Forgot password?
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              <Lock className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" type="button">
            <Shield className="h-4 w-4 text-brand" />
            Login with Security Key
          </Button>

          <p className="mt-8 text-center text-xs text-muted">
            © 2025 <span className="font-semibold text-brand">Wecare</span>. All rights
            reserved.
          </p>
          <p className="mt-3 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              ← Go to first page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
