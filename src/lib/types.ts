export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  date_of_birth?: string;
  role: UserRole;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  goal_amount: number;
  raised_amount: number;
  donors_count: number;
  status: "active" | "paused" | "completed";
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  image_url: string;
}

export interface Donation {
  id: string;
  campaign_id: string;
  campaign_title: string;
  donor_name: string;
  amount: number;
  created_at: string;
  status: "completed" | "pending" | "failed";
}

export interface Activity {
  id: string;
  user_name: string;
  action: string;
  created_at: string;
  avatar_color: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}
