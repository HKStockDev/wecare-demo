"use client";

import { CreditCard, ShieldCheck } from "lucide-react";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Payment Settings</h1>
        <p className="text-sm text-muted">Stripe gateway configuration (demo)</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#635BFF]/10 p-3 text-[#635BFF]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Stripe</p>
              <p className="text-sm text-muted">Connected · Test mode</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
              <span className="text-muted">Publishable key</span>
              <span className="font-mono text-xs">pk_test_••••••••</span>
            </div>
            <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
              <span className="text-muted">Platform fee</span>
              <span className="font-semibold">5%</span>
            </div>
            <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
              <span className="text-muted">Currency</span>
              <span className="font-semibold">USD</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-brand">
            <ShieldCheck className="h-5 w-5" />
            <p className="font-bold">Security</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>✓ PCI DSS compliant checkout</li>
            <li>✓ 256-bit SSL encryption</li>
            <li>✓ Webhook signature verification</li>
            <li>✓ Demo donations stored locally until Supabase is connected</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
