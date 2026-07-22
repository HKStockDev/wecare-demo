import type { Activity, Campaign, Donation, Event, Notification, Profile } from "./types";

export const DEMO_USERS = {
  user: {
    id: "user-1",
    email: "john@wecare.app",
    password: "demo123",
    full_name: "John Doe",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "I'm passionate about making a positive impact in my community and supporting meaningful causes.",
    date_of_birth: "1990-05-15",
    avatar_url: "/images/avatars/john.jpg",
    role: "user" as const,
  },
  admin: {
    id: "admin-1",
    email: "admin@wecare.app",
    password: "admin123",
    full_name: "Wecare Admin",
    phone: "+1 (555) 000-0000",
    location: "San Francisco, USA",
    bio: "Platform administrator",
    avatar_url: "/images/avatars/admin.jpg",
    role: "admin" as const,
  },
};

export const DONOR_AVATARS = [
  "/images/avatars/sarah.jpg",
  "/images/avatars/michael.jpg",
  "/images/avatars/emma.jpg",
];

export const CATEGORIES = [
  { id: "education", name: "Education", icon: "GraduationCap" },
  { id: "health", name: "Health", icon: "HeartPulse" },
  { id: "environment", name: "Environment", icon: "Leaf" },
  { id: "animals", name: "Animals", icon: "PawPrint" },
  { id: "community", name: "Community", icon: "Users" },
  { id: "other", name: "Other", icon: "LayoutGrid" },
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    title: "Education for All",
    description:
      "Help us provide quality education to underprivileged children. Your donation funds school supplies, uniforms, and scholarships.",
    category: "Education",
    image_url: "/images/campaigns/education.jpg",
    goal_amount: 20000,
    raised_amount: 12580,
    donors_count: 245,
    status: "active",
    created_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "c2",
    title: "Save Our Planet",
    description:
      "Join our reforestation mission. We plant trees, restore habitats, and educate communities about climate action.",
    category: "Environment",
    image_url: "/images/campaigns/environment.jpg",
    goal_amount: 35000,
    raised_amount: 22140,
    donors_count: 412,
    status: "active",
    created_at: "2026-05-15T10:00:00Z",
  },
  {
    id: "c3",
    title: "Animal Rescue Shelter",
    description:
      "Support abandoned pets with food, medical care, and loving homes until they find their forever families.",
    category: "Animals",
    image_url: "/images/campaigns/animals.jpg",
    goal_amount: 15000,
    raised_amount: 9870,
    donors_count: 189,
    status: "active",
    created_at: "2026-06-10T10:00:00Z",
  },
  {
    id: "c4",
    title: "Clean Water for Every Child",
    description:
      "Build clean water wells in rural communities so children can drink safely and stay in school.",
    category: "Health",
    image_url: "/images/campaigns/water.jpg",
    goal_amount: 50000,
    raised_amount: 38200,
    donors_count: 620,
    status: "active",
    created_at: "2026-04-20T10:00:00Z",
  },
  {
    id: "c5",
    title: "Green Tomorrow Initiative",
    description:
      "Urban gardens and green spaces for underserved neighborhoods — grow food, community, and hope.",
    category: "Community",
    image_url: "/images/campaigns/community.jpg",
    goal_amount: 25000,
    raised_amount: 18750,
    donors_count: 301,
    status: "active",
    created_at: "2026-05-01T10:00:00Z",
  },
  {
    id: "c6",
    title: "Hope for Health Clinics",
    description:
      "Mobile clinics bringing free checkups, vaccines, and medicine to remote villages.",
    category: "Health",
    image_url: "/images/campaigns/health.jpg",
    goal_amount: 40000,
    raised_amount: 15600,
    donors_count: 178,
    status: "active",
    created_at: "2026-06-18T10:00:00Z",
  },
];

export const EVENTS: Event[] = [
  {
    id: "e1",
    title: "Community Cleanup Drive",
    location: "Central Park, New York",
    date: "2026-07-15",
    time: "9:00 AM",
    image_url: "/images/campaigns/event-cleanup.jpg",
  },
  {
    id: "e2",
    title: "Charity Fun Run 5K",
    location: "Brooklyn Bridge Park",
    date: "2026-07-28",
    time: "7:30 AM",
    image_url: "/images/campaigns/event-run.jpg",
  },
  {
    id: "e3",
    title: "Food Drive Volunteer Day",
    location: "Downtown Community Center",
    date: "2026-08-05",
    time: "10:00 AM",
    image_url: "/images/campaigns/event-food.jpg",
  },
];

export const DONATIONS: Donation[] = [
  {
    id: "d1",
    campaign_id: "c1",
    campaign_title: "Education for All",
    donor_name: "Sarah Johnson",
    amount: 100,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: "completed",
  },
  {
    id: "d2",
    campaign_id: "c2",
    campaign_title: "Save Our Planet",
    donor_name: "Michael Chen",
    amount: 75,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    status: "completed",
  },
  {
    id: "d3",
    campaign_id: "c4",
    campaign_title: "Clean Water for Every Child",
    donor_name: "Emma Wilson",
    amount: 250,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    status: "completed",
  },
  {
    id: "d4",
    campaign_id: "c3",
    campaign_title: "Animal Rescue Shelter",
    donor_name: "James Brown",
    amount: 50,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    status: "completed",
  },
  {
    id: "d5",
    campaign_id: "c5",
    campaign_title: "Green Tomorrow Initiative",
    donor_name: "Olivia Martinez",
    amount: 120,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    status: "completed",
  },
  {
    id: "d6",
    campaign_id: "c1",
    campaign_title: "Education for All",
    donor_name: "John Doe",
    amount: 50,
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    status: "completed",
  },
];

export const ACTIVITIES: Activity[] = [
  {
    id: "a1",
    user_name: "Anna",
    action: "shared an update on Education for All",
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    avatar_color: "#28C76F",
    avatar_url: "/images/avatars/anna.jpg",
  },
  {
    id: "a2",
    user_name: "James",
    action: "joined the community",
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    avatar_color: "#00CFE8",
    avatar_url: "/images/avatars/james.jpg",
  },
  {
    id: "a3",
    user_name: "Lisa",
    action: "donated to Clean Water for Every Child",
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    avatar_color: "#FF9F43",
    avatar_url: "/images/avatars/lisa.jpg",
  },
  {
    id: "a4",
    user_name: "David",
    action: "created a new campaign",
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    avatar_color: "#EA5455",
    avatar_url: "/images/avatars/david.jpg",
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Donation received",
    body: "Sarah Johnson donated $100 to Education for All",
    read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "n2",
    title: "Campaign milestone",
    body: "Clean Water for Every Child reached 75% of its goal!",
    read: false,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "n3",
    title: "New event",
    body: "Community Cleanup Drive is happening on Jul 15",
    read: false,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

export const CHART_DATA = [
  { date: "Jun 22", amount: 4200 },
  { date: "Jun 26", amount: 5100 },
  { date: "Jun 30", amount: 4800 },
  { date: "Jul 04", amount: 6200 },
  { date: "Jul 08", amount: 7100 },
  { date: "Jul 12", amount: 6800 },
  { date: "Jul 16", amount: 8420 },
  { date: "Jul 20", amount: 9100 },
];

export const ADMIN_STATS = {
  totalFunds: 128560,
  totalSupporters: 12845,
  activeCampaigns: 18,
  communityMembers: 26473,
  fundsGrowth: 12.5,
  supportersGrowth: 8.2,
  campaignsGrowth: 2,
  membersGrowth: 10.4,
};

const STORAGE_KEY = "wecare_demo_donations";
const CAMPAIGNS_KEY = "wecare_demo_campaigns";

export function getStoredDonations(): Donation[] {
  if (typeof window === "undefined") return DONATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DONATIONS;
    return JSON.parse(raw) as Donation[];
  } catch {
    return DONATIONS;
  }
}

export function addDonation(donation: Donation) {
  const list = getStoredDonations();
  const next = [donation, ...list];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getStoredCampaigns(): Campaign[] {
  if (typeof window === "undefined") return CAMPAIGNS;
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    if (!raw) return CAMPAIGNS;
    return JSON.parse(raw) as Campaign[];
  } catch {
    return CAMPAIGNS;
  }
}

export function upsertCampaign(campaign: Campaign) {
  const list = getStoredCampaigns();
  const idx = list.findIndex((c) => c.id === campaign.id);
  const next =
    idx >= 0
      ? list.map((c, i) => (i === idx ? campaign : c))
      : [campaign, ...list];
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(next));
  return next;
}

export function toProfile(
  user: (typeof DEMO_USERS)["user"] | (typeof DEMO_USERS)["admin"]
): Profile {
  const { password: _, ...profile } = user;
  return profile;
}
