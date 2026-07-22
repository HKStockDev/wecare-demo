export const DONATION_ALERT_EVENT = "wecare:donation";

export type DonationAlertDetail = {
  id?: string;
  donor_name: string;
  amount: number;
  campaign_title: string;
  created_at?: string;
};

export function broadcastDonationAlert(detail: DonationAlertDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DONATION_ALERT_EVENT, { detail }));
  try {
    const channel = new BroadcastChannel("wecare-donations");
    channel.postMessage(detail);
    channel.close();
  } catch {
    /* ignore */
  }
}
