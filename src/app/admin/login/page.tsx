"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { Button, Field } from "@/components/ui";
import { BrandLogo } from "@/components/BrandLogo";
import { FadeUp } from "@/components/Motion";
import { useAuth } from "@/lib/auth";
import { markLoginToastPending } from "@/lib/login-toast";
import { SITE_URL } from "@/lib/site";
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
    else {
      markLoginToastPending();
      router.push("/admin");
    }
  }

  if (authLoading || blocked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f8f9fa]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2 anim-page">
      {/* Left — full login_ad.png artwork as-is */}
      <div className="relative hidden min-h-dvh overflow-hidden bg-[#0b2d26] lg:block">
        <Image
          src="/images/login_ad.png"
          alt="Wecare admin"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <FadeUp delay={100} className="w-full max-w-md">
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
            <Button type="submit" className="w-full anim-press" disabled={loading}>
              <Lock className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full anim-press" type="button">
            <Shield className="h-4 w-4 text-brand" />
            Login with Security Key
          </Button>

          <p className="mt-8 text-center text-xs text-muted">
            © 2025 <span className="font-semibold text-brand">Wecare</span>. All rights
            reserved.
          </p>
          <p className="mt-4 text-center">
            <a
              href={SITE_URL}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand-light px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/10 anim-press"
            >
              ← Go to first page
            </a>
          </p>
        </FadeUp>
      </div>
    </div>
  );
}
