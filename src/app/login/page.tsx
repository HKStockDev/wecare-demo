"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { BrandLogo } from "@/components/BrandLogo";
import { FadeUp, ScaleIn } from "@/components/Motion";
import { SafeImage } from "@/components/SafeImage";
import { Button, Field } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { DONOR_AVATARS } from "@/lib/demo-data";
import { markLoginToastPending } from "@/lib/login-toast";
import { SITE_URL } from "@/lib/site";
import { useRedirectIfAuthenticated } from "@/lib/use-redirect-if-authenticated";

export default function LoginPage() {
  const { login } = useAuth();
  const { loading: authLoading, blocked } = useRedirectIfAuthenticated();
  const router = useRouter();
  const [email, setEmail] = useState("john@wecare.app");
  const [password, setPassword] = useState("demo123");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const err = await login(email, password, "user");
    setLoading(false);
    if (err) setError(err);
    else {
      markLoginToastPending();
      router.push("/app");
    }
  }

  if (authLoading || blocked) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#f7faf8]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-hidden bg-[#f7faf8] anim-page">
      <div className="phone-shell">
        <div className="phone-shell-scroll">
        <div className="relative overflow-hidden px-6 pb-4 pt-10 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#d9f2e3,_transparent_55%)]" />
          <div className="relative">
            <ScaleIn className="mx-auto mb-3">
              <BrandLogo size={56} />
            </ScaleIn>
            <FadeUp delay={80}>
              <h1 className="text-2xl font-extrabold text-brand">Wecare</h1>
            </FadeUp>
            <FadeUp delay={140}>
              <p className="mt-3 text-xl font-bold text-foreground">
                Together, we can{" "}
                <span className="block text-2xl text-brand">Change Lives</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                Join our community and support amazing causes.
              </p>
            </FadeUp>
            <FadeUp delay={200} className="relative mx-auto mt-5 h-28 w-full max-w-xs overflow-hidden rounded-2xl">
              <SafeImage
                src="/images/login-hero.jpg"
                alt="Community"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center -space-x-2">
                {["/images/avatars/john.jpg", ...DONOR_AVATARS].map((src) => (
                  <Avatar
                    key={src}
                    src={src}
                    size={48}
                    className="border-4 border-white shadow"
                  />
                ))}
              </div>
            </FadeUp>
          </div>
        </div>

        <FadeUp delay={260} className="relative z-10 mx-4 -mt-1 rounded-2xl border border-border bg-white p-5 shadow-lg shadow-brand-dark/5">
          <h2 className="text-xl font-bold">Welcome Back!</h2>
          <p className="mt-1 text-sm text-muted">Sign in to your account and continue</p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <Field
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />
            <Field
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              right={
                <button type="button" onClick={() => setShow((s) => !s)} className="text-muted">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />
            <div className="text-right">
              <button type="button" className="text-sm font-medium text-brand">
                Forgot Password?
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full anim-press" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" />
            or continue with
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "Google", icon: "/images/social-google.svg" },
              { name: "Apple", icon: "/images/social-apple.svg" },
              { name: "Facebook", icon: "/images/social-facebook.svg" },
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground hover:bg-gray-50 anim-press"
              >
                <Image src={p.icon} alt="" width={18} height={18} unoptimized />
                {p.name}
              </button>
            ))}
          </div>

          <p className="mt-5 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-brand">
              Sign Up
            </Link>
          </p>
        </FadeUp>

        <FadeUp delay={320} className="wave-footer mt-auto flex flex-col items-center gap-2 px-6 pb-8 pt-8">
          <div className="flex items-center gap-2 text-xs text-brand">
            <ShieldCheck className="h-4 w-4" />
            Your data is safe and secure with us.
          </div>
          <a
            href={SITE_URL}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-white/80 px-4 py-2 text-xs font-semibold text-brand shadow-sm hover:bg-white anim-press"
          >
            ← Go to first page
          </a>
        </FadeUp>
        </div>
      </div>
    </div>
  );
}
