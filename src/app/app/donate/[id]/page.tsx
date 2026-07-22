"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Info,
  Lock,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { Button, Field, Input, Label } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useCampaigns, useDonations } from "@/lib/data";
import { formatCurrencyExact } from "@/lib/utils";

function DonateContent() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { campaigns, loading: campsLoading } = useCampaigns();
  const { add } = useDonations();
  const baseAmount = Number(search.get("amount") || 50);

  const campaign = useMemo(() => campaigns.find((c) => c.id === id), [campaigns, id]);

  const [amount] = useState(baseAmount);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12 / 28");
  const [cvc, setCvc] = useState("123");
  const [name, setName] = useState(user?.full_name || "John Doe");
  const [saveCard, setSaveCard] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const fee = +(amount * 0.05).toFixed(2);
  const total = +(amount + fee).toFixed(2);

  if (campsLoading) {
    return <div className="p-8 text-center text-muted">Loading...</div>;
  }

  if (!campaign) {
    return <div className="p-8 text-center text-muted">Campaign not found</div>;
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 800));
      await add({
        campaign_id: campaign!.id,
        campaign_title: campaign!.title,
        donor_name: user?.full_name || name,
        amount,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-white px-6 py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light text-brand">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-extrabold">Thank you!</h1>
        <p className="mt-2 text-muted">
          Your donation of {formatCurrencyExact(amount)} to{" "}
          <span className="font-semibold text-foreground">{campaign.title}</span>{" "}
          was successful.
        </p>
        <p className="mt-1 text-xs text-muted">(Demo payment — Stripe test mode)</p>
        <Button className="mt-8 w-full max-w-xs" onClick={() => router.push("/app")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f3f5f4]">
      <header className="flex items-center gap-3 bg-white px-4 py-4">
        <button type="button" onClick={() => router.back()} className="rounded-lg p-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold pr-6">Secure Payment</h1>
      </header>

      <div className="px-4 py-4 space-y-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold">
            Powered by <span className="text-[#635BFF]">Stripe</span>
          </p>
          <p className="text-xs text-muted">Your payment is secure and encrypted</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <h2 className="font-bold">Donation Summary</h2>
          <div className="mt-3 flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
              <SafeImage
                src={campaign.image_url}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{campaign.title}</p>
              <p className="line-clamp-2 text-xs text-muted">{campaign.description}</p>
            </div>
            <p className="font-bold">{formatCurrencyExact(amount)}</p>
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatCurrencyExact(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-muted">
                Platform Fee <Info className="h-3.5 w-3.5" />
              </span>
              <span>{formatCurrencyExact(fee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-brand">{formatCurrencyExact(total)} USD</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={pay}
          className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-3"
        >
          <h2 className="font-bold">Pay with Card</h2>
          <div>
            <Label>Card number</Label>
            <Field
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="1234 1234 1234 1234"
              icon={<CreditCard className="h-4 w-4" />}
              required
            />
            <div className="mt-1 flex gap-1 justify-end text-[10px] font-bold text-muted">
              <span className="rounded bg-blue-600 px-1 text-white">VISA</span>
              <span className="rounded bg-orange-500 px-1 text-white">MC</span>
              <span className="rounded bg-blue-400 px-1 text-white">AMEX</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Expiry date</Label>
              <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM / YY" required />
            </div>
            <div>
              <Label>CVC</Label>
              <Input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" required />
            </div>
          </div>
          <div>
            <Label>Name on card</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="accent-brand h-4 w-4"
            />
            Save card for future donations.
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full py-3.5" disabled={loading}>
            <Lock className="h-4 w-4" />
            {loading ? "Processing..." : `Pay ${formatCurrencyExact(total)} USD`}
          </Button>
          <p className="flex items-center justify-center gap-1 text-center text-xs text-muted">
            <Lock className="h-3 w-3" /> Payments are securely processed by{" "}
            <span className="font-semibold">Stripe</span>.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-[11px] text-muted">
              <Shield className="h-4 w-4 text-brand" /> 256-bit SSL Secure
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-[11px] text-muted">
              <ShieldCheck className="h-4 w-4 text-brand" /> PCI DSS Compliant
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading...</div>}>
      <DonateContent />
    </Suspense>
  );
}
