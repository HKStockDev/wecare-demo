"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_USERS, toProfile } from "./demo-data";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { Profile, UserRole } from "./types";

const SESSION_KEY = "wecare_session";

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<string | null>;
  register: (email: string, password: string, fullName: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    email: String(row.email),
    full_name: String(row.full_name || ""),
    phone: row.phone ? String(row.phone) : undefined,
    avatar_url: row.avatar_url ? String(row.avatar_url) : undefined,
    location: row.location ? String(row.location) : undefined,
    bio: row.bio ? String(row.bio) : undefined,
    date_of_birth: row.date_of_birth ? String(row.date_of_birth) : undefined,
    role: (row.role as UserRole) || "user",
  };
}

function loadLocalSession(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

function saveLocalSession(profile: Profile | null) {
  if (typeof window === "undefined") return;
  if (profile) localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  else localStorage.removeItem(SESSION_KEY);
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("wecare_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return mapProfile(data);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const useCloud = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!useCloud) {
        if (mounted) {
          setUser(loadLocalSession());
          setLoading(false);
        }
        return;
      }

      const supabase = getSupabase()!;
      const { data } = await supabase.auth.getSession();
      if (data.session?.user && mounted) {
        const profile = await fetchProfile(data.session.user.id);
        setUser(profile);
      }
      if (mounted) setLoading(false);

      const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (!session?.user) {
          setUser(null);
          return;
        }
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      });

      return () => sub.subscription.unsubscribe();
    }

    const cleanupPromise = init();
    return () => {
      mounted = false;
      void cleanupPromise.then((unsub) => unsub?.());
    };
  }, [useCloud]);

  const login = useCallback(
    async (email: string, password: string, role?: UserRole) => {
      const normalized = email.trim().toLowerCase();

      if (useCloud) {
        const supabase = getSupabase()!;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalized,
          password,
        });
        if (error) return error.message;
        const profile = await fetchProfile(data.user.id);
        if (!profile) return "Profile not found. Please contact support.";
        if (role && profile.role !== role) {
          await supabase.auth.signOut();
          return role === "admin"
            ? "This account is not an admin"
            : "Please use the admin portal for admin accounts";
        }
        setUser(profile);
        return null;
      }

      const candidates = [DEMO_USERS.user, DEMO_USERS.admin];
      const match = candidates.find(
        (u) =>
          u.email === normalized &&
          u.password === password &&
          (!role || u.role === role)
      );
      if (!match) return "Invalid email or password";
      if (role && match.role !== role) {
        return role === "admin"
          ? "This account is not an admin"
          : "Please use the admin portal for admin accounts";
      }
      const profile = toProfile(match);
      saveLocalSession(profile);
      setUser(profile);
      return null;
    },
    [useCloud]
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!email || !password || !fullName) return "Please fill all fields";
      if (password.length < 6) return "Password must be at least 6 characters";

      if (useCloud) {
        const supabase = getSupabase()!;
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { full_name: fullName, wecare_role: "user" },
          },
        });
        if (error) return error.message;
        if (!data.user) return "Registration failed";

        // Ensure profile exists (trigger may race)
        await supabase.from("wecare_profiles").upsert({
          id: data.user.id,
          email: email.trim().toLowerCase(),
          full_name: fullName,
          role: "user",
        });

        const profile = await fetchProfile(data.user.id);
        setUser(
          profile || {
            id: data.user.id,
            email: email.trim().toLowerCase(),
            full_name: fullName,
            role: "user",
          }
        );
        return null;
      }

      const profile: Profile = {
        id: `user-${Date.now()}`,
        email: email.trim().toLowerCase(),
        full_name: fullName,
        role: "user",
      };
      saveLocalSession(profile);
      setUser(profile);
      return null;
    },
    [useCloud]
  );

  const logout = useCallback(async () => {
    if (useCloud) {
      await getSupabase()?.auth.signOut();
    }
    saveLocalSession(null);
    setUser(null);
  }, [useCloud]);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!user) return;
      const next = { ...user, ...patch };
      setUser(next);

      if (useCloud) {
        const { id: _id, role: _role, ...rest } = patch;
        await getSupabase()
          ?.from("wecare_profiles")
          .update({
            full_name: next.full_name,
            email: next.email,
            phone: next.phone || null,
            location: next.location || null,
            bio: next.bio || null,
            date_of_birth: next.date_of_birth || null,
            avatar_url: next.avatar_url || null,
          })
          .eq("id", user.id);
      } else {
        saveLocalSession(next);
      }
    },
    [useCloud, user]
  );

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
