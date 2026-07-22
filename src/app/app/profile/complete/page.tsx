"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import { Button, Field, Label, Textarea } from "@/components/ui";
import { useAuth } from "@/lib/auth";

export default function CompleteProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dob, setDob] = useState(user?.date_of_birth || "");
  const [location, setLocation] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [agreed, setAgreed] = useState(true);

  function onContinue(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      email,
      phone,
      date_of_birth: dob,
      location,
      bio,
    });
    router.push("/app");
  }

  return (
    <div className="min-h-full bg-white px-4 pb-10 pt-4">
      <div className="mb-4 flex items-center">
        <button type="button" onClick={() => router.back()} className="p-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold pr-6">
          Complete Your Profile
        </h1>
      </div>

      <div className="mb-6 flex items-center justify-between px-2">
        {[
          { label: "Account", done: true },
          { label: "Profile", active: true },
          { label: "Preferences", done: false },
        ].map((step, i) => (
          <div key={step.label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step.done || step.active
                  ? "bg-brand text-white"
                  : "bg-gray-200 text-muted"
              }`}
            >
              {step.done ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium ${
                step.active ? "text-brand" : "text-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-col items-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-3xl font-bold text-muted">
            {fullName?.[0] || "U"}
          </div>
          <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow">
            <Camera className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 font-bold">Add your profile photo</p>
        <p className="text-sm text-muted">Help your community recognize you</p>
      </div>

      <form onSubmit={onContinue} className="space-y-3">
        <div>
          <Label>Full Name *</Label>
          <Field
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="h-4 w-4" />}
            required
          />
        </div>
        <div>
          <Label>Email Address *</Label>
          <Field
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
            required
          />
        </div>
        <div>
          <Label>Phone Number *</Label>
          <Field
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={<Phone className="h-4 w-4" />}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Field
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>
        <div>
          <Label>Location</Label>
          <Field
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            icon={<MapPin className="h-4 w-4" />}
            placeholder="New York, USA"
          />
        </div>
        <div>
          <Label>About You</Label>
          <div className="relative">
            <Pencil className="absolute left-3 top-3 h-4 w-4 text-brand" />
            <Textarea
              className="min-h-[100px] pl-10"
              value={bio}
              maxLength={200}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your community about yourself..."
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted">
              {bio.length}/200
            </span>
          </div>
        </div>

        <label className="flex items-start gap-2 pt-1 text-sm text-muted">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 accent-brand"
            required
          />
          <span>
            I agree to the{" "}
            <span className="text-brand">Terms of Service</span> and{" "}
            <span className="text-brand">Privacy Policy</span>
          </span>
        </label>

        <Button type="submit" className="w-full" disabled={!agreed}>
          Continue
        </Button>
      </form>
    </div>
  );
}
