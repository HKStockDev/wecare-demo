"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ACTIVITIES,
  CAMPAIGNS,
  DONATIONS,
  EVENTS,
  NOTIFICATIONS,
  addDonation as addLocalDonation,
  getStoredCampaigns,
  getStoredDonations,
  upsertCampaign as upsertLocalCampaign,
} from "./demo-data";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import { broadcastDonationAlert } from "./donation-alerts";
import type { Activity, Campaign, Donation, Event, Notification } from "./types";

function mapCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    category: String(row.category),
    image_url: String(row.image_url),
    goal_amount: Number(row.goal_amount),
    raised_amount: Number(row.raised_amount),
    donors_count: Number(row.donors_count),
    status: row.status as Campaign["status"],
    created_at: String(row.created_at),
  };
}

function mapDonation(row: Record<string, unknown>, titleMap?: Map<string, string>): Donation {
  return {
    id: String(row.id),
    campaign_id: String(row.campaign_id),
    campaign_title:
      (row.campaign_title as string) ||
      titleMap?.get(String(row.campaign_id)) ||
      "Campaign",
    donor_name: String(row.donor_name),
    amount: Number(row.amount),
    created_at: String(row.created_at),
    status: row.status as Donation["status"],
  };
}

function mapEvent(row: Record<string, unknown>): Event {
  return {
    id: String(row.id),
    title: String(row.title),
    location: String(row.location),
    date: String(row.event_date || row.date),
    time: String(row.event_time || row.time),
    image_url: String(row.image_url),
  };
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setCampaigns(getStoredCampaigns());
      setLoading(false);
      return;
    }
    const { data, error } = await getSupabase()!
      .from("wecare_campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCampaigns(data.map(mapCampaign));
    else setCampaigns(getStoredCampaigns());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upsert = useCallback(
    async (campaign: Campaign) => {
      if (!isSupabaseConfigured()) {
        setCampaigns(upsertLocalCampaign(campaign));
        return campaign;
      }
      const payload = {
        title: campaign.title,
        description: campaign.description,
        category: campaign.category,
        image_url: campaign.image_url,
        goal_amount: campaign.goal_amount,
        raised_amount: campaign.raised_amount,
        donors_count: campaign.donors_count,
        status: campaign.status,
      };
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          campaign.id
        );
      if (isUuid) {
        const { data, error } = await getSupabase()!
          .from("wecare_campaigns")
          .update(payload)
          .eq("id", campaign.id)
          .select("*")
          .single();
        if (!error && data) {
          await refresh();
          return mapCampaign(data);
        }
      }
      const { data, error } = await getSupabase()!
        .from("wecare_campaigns")
        .insert(payload)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      await refresh();
      return mapCampaign(data);
    },
    [refresh]
  );

  return { campaigns, loading, refresh, upsert };
}

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>(DONATIONS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setDonations(getStoredDonations());
      setLoading(false);
      return;
    }
    const supabase = getSupabase()!;
    const [{ data: dons }, { data: camps }] = await Promise.all([
      supabase.from("wecare_donations").select("*").order("created_at", { ascending: false }),
      supabase.from("wecare_campaigns").select("id, title"),
    ]);
    const titleMap = new Map((camps || []).map((c) => [String(c.id), String(c.title)]));
    if (dons) setDonations(dons.map((d) => mapDonation(d, titleMap)));
    else setDonations(getStoredDonations());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (donation: Omit<Donation, "id" | "created_at" | "status"> & { status?: Donation["status"] }) => {
      if (!isSupabaseConfigured()) {
        const full: Donation = {
          id: `d-${Date.now()}`,
          created_at: new Date().toISOString(),
          status: "completed",
          ...donation,
        };
        setDonations(addLocalDonation(full));
        broadcastDonationAlert({
          id: full.id,
          donor_name: full.donor_name,
          amount: full.amount,
          campaign_title: full.campaign_title,
          created_at: full.created_at,
        });
        return full;
      }
      const { data, error } = await getSupabase()!.rpc("wecare_record_donation", {
        p_campaign_id: donation.campaign_id,
        p_donor_name: donation.donor_name,
        p_amount: donation.amount,
      });
      if (error) throw new Error(error.message);
      const mapped = mapDonation(data, new Map([[donation.campaign_id, donation.campaign_title]]));
      broadcastDonationAlert({
        id: mapped.id,
        donor_name: mapped.donor_name,
        amount: mapped.amount,
        campaign_title: donation.campaign_title,
        created_at: mapped.created_at,
      });
      await refresh();
      return mapped;
    },
    [refresh]
  );

  return { donations, loading, refresh, add };
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>(EVENTS);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    void getSupabase()!
      .from("wecare_events")
      .select("*")
      .order("event_date", { ascending: true })
      .then(({ data }) => {
        if (data?.length) setEvents(data.map(mapEvent));
      });
  }, []);
  return { events };
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    void getSupabase()!
      .from("wecare_activities")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) {
          setActivities(
            data.map((a) => ({
              id: String(a.id),
              user_name: String(a.user_name),
              action: String(a.action),
              created_at: String(a.created_at),
              avatar_color: String(a.avatar_color || "#28C76F"),
              avatar_url: a.avatar_url ? String(a.avatar_url) : undefined,
            }))
          );
        }
      });
  }, []);
  return { activities };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    void getSupabase()!
      .from("wecare_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) {
          setNotifications(
            data.map((n) => ({
              id: String(n.id),
              title: String(n.title),
              body: String(n.body),
              read: Boolean(n.read),
              created_at: String(n.created_at),
            }))
          );
        }
      });
  }, []);
  return { notifications };
}
