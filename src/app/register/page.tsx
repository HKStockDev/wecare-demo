"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button, Field } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useRedirectIfAuthenticated } from "@/lib/use-redirect-if-authenticated";

export default function RegisterPage() {
  const { register } = useAuth();
  const { loading: authLoading, blocked } = useRedirectIfAuthenticated();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const err = await register(email, password, fullName);
    setLoading(false);
    if (err) setError(err);
    else router.push("/app/profile/complete");
  }

  if (authLoading || blocked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f7faf8]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f7faf8]">
      <div className="phone-shell px-5 py-10">
        <h1 className="text-center text-2xl font-extrabold text-brand">Create Account</h1>
        <p className="mt-2 text-center text-sm text-muted">
          Join Wecare and start supporting causes
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <Field
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="h-4 w-4" />}
            required
          />
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
              <button type="button" onClick={() => setShow((s) => !s)}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
