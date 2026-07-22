"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button, Field } from "@/components/ui";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
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
    else router.push("/app");
  }

  return (
    <div className="min-h-dvh bg-[#f7faf8]">
      <div className="phone-shell flex flex-col">
        <div className="relative overflow-hidden px-6 pb-4 pt-10 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#d9f2e3,_transparent_55%)]" />
          <div className="relative">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-brand shadow-md">
              <Image src="/images/logo.png" alt="Wecare" width={56} height={56} className="object-cover" />
            </div>
            <h1 className="text-2xl font-extrabold text-brand">Wecare</h1>
            <p className="mt-3 text-xl font-bold text-foreground">
              Together, we can{" "}
              <span className="block text-2xl text-brand">Change Lives</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              Join our community and support amazing causes.
            </p>
            <div className="mx-auto mt-5 flex h-28 w-full max-w-xs items-end justify-center rounded-2xl bg-brand-light/80">
              <div className="flex -space-x-2 pb-3">
                {["#1b8e3d", "#28c76f", "#0b2d26", "#6ee7a0"].map((c, i) => (
                  <div
                    key={c}
                    className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-lg font-bold text-white shadow"
                    style={{ background: c, zIndex: 4 - i }}
                  >
                    {["J", "S", "A", "M"][i]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-4 -mt-1 rounded-2xl border border-border bg-white p-5 shadow-lg shadow-brand-dark/5">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" />
            or continue with
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {["Google", "Apple", "Facebook"].map((p) => (
              <button
                key={p}
                type="button"
                className="rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground hover:bg-gray-50"
              >
                {p}
              </button>
            ))}
          </div>

          <p className="mt-5 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-brand">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="wave-footer mt-auto flex flex-col items-center gap-2 px-6 pb-8 pt-8">
          <div className="flex items-center gap-2 text-xs text-brand">
            <ShieldCheck className="h-4 w-4" />
            Your data is safe and secure with us.
          </div>
          <Link href="/" className="text-xs text-muted underline">
            Back to demo home
          </Link>
        </div>
      </div>
    </div>
  );
}
