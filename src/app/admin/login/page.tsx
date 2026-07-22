"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, Lock, Mail, Shield } from "lucide-react";
import { Button, Field } from "@/components/ui";
import { Avatar } from "@/components/Avatar";
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
      <div className="relative hidden flex-col justify-between bg-gradient-to-b from-[#071a16] via-[#0b2d26] to-[#0f3d32] p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <BrandLogo size={40} />
          <span className="text-xl font-extrabold text-brand-accent">Wecare</span>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold leading-tight">
            Welcome <span className="text-brand-accent">Back!</span>
          </h1>
          <p className="mt-3 max-w-sm text-white/65">
            Sign in to your admin account to continue managing Wecare.
          </p>
          <div className="mt-10 flex -space-x-3">
            {[
              "/images/avatars/admin.jpg",
              "/images/avatars/sarah.jpg",
              "/images/avatars/john.jpg",
              "/images/avatars/michael.jpg",
            ].map((src) => (
              <Avatar
                key={src}
                src={src}
                size={64}
                className="border-4 border-[#0b2d26]"
              />
            ))}
          </div>
        </div>

        <p className="flex items-center gap-2 text-sm text-white/60">
          <Shield className="h-4 w-4 text-brand-accent" />
          Secure. Reliable. Impactful. Together, we build a better tomorrow.
        </p>
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <BrandLogo size={36} />
              <span className="text-lg font-extrabold text-brand">Wecare</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold">Admin Portal</h2>
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
                Remember Me
              </label>
              <button type="button" className="font-medium text-brand">
                Forgot Password?
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
            <KeyRound className="h-4 w-4" />
            Login with Security Key
          </Button>

          <p className="mt-8 text-center text-xs text-muted">
            © 2025 <span className="font-semibold text-brand">Wecare</span>. All rights
            reserved.{" "}
            <Link href="/" className="underline">
              Demo home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
