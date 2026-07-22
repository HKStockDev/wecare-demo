/**
 * One-time Supabase setup: apply schema, create demo users, seed data.
 * Usage: node scripts/setup-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
config({ path: join(root, ".env.local") });

const {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const admin = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function connectPg() {
  const attempts = [
    {
      label: "pooler ap-south-1",
      host: "aws-1-ap-south-1.pooler.supabase.com",
      port: 6543,
      user: "postgres.wkevlvlpffjyuakemnij",
    },
    {
      label: "direct",
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT || 5432),
      user: POSTGRES_USER || "postgres",
    },
  ];

  for (const a of attempts) {
    try {
      const client = new pg.Client({
        host: a.host,
        port: a.port,
        database: POSTGRES_DB || "postgres",
        user: a.user,
        password: POSTGRES_PASSWORD,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 20000,
      });
      console.log(`Connecting via ${a.label} (${a.host})...`);
      await client.connect();
      return client;
    } catch (err) {
      console.warn(`  failed: ${err.message.split("\n")[0]}`);
    }
  }
  throw new Error("Could not connect to Postgres");
}

async function runSchema() {
  const sql = readFileSync(join(root, "supabase", "schema.sql"), "utf8");
  const client = await connectPg();
  console.log("Applying schema.sql...");
  await client.query(sql);
  await client.end();
  console.log("Schema applied.");
}

async function ensureUser({ email, password, full_name, role, phone, location, bio }) {
  const { data: listed, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) {
    console.warn("listUsers warning:", listError.message || listError);
  }
  const existing = listed?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  let userId = existing?.id;
  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      // IMPORTANT: do not set user_metadata.role — stock-screener OCR trigger
      // only accepts ocr_user_role: 'admin' | 'worker'
      user_metadata: { full_name, wecare_role: role },
    });
    if (error) {
      console.error("createUser error raw:", JSON.stringify(error, null, 2));
      throw new Error(`Create user ${email}: ${error.message || error.status || "unknown"}`);
    }
    userId = data.user.id;
    console.log(`Created auth user: ${email}`);
  } else {
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: { full_name, wecare_role: role },
    });
    if (error) {
      console.error("updateUser error raw:", JSON.stringify(error, null, 2));
      throw new Error(`Update user ${email}: ${error.message || "unknown"}`);
    }
    console.log(`Updated auth user: ${email}`);
  }

  // Small delay so trigger can finish
  await new Promise((r) => setTimeout(r, 400));

  const { error: profileError } = await admin.from("wecare_profiles").upsert({
    id: userId,
    email,
    full_name,
    role,
    phone: phone || null,
    location: location || null,
    bio: bio || null,
  });
  if (profileError) throw new Error(`Upsert profile ${email}: ${profileError.message}`);
  return userId;
}

async function seedData(adminId, userId) {
  const { count } = await admin
    .from("wecare_campaigns")
    .select("*", { count: "exact", head: true });

  if ((count || 0) > 0) {
    console.log(`Campaigns already seeded (${count}). Skipping seed.`);
    return;
  }

  const campaigns = [
    {
      title: "Education for All",
      description:
        "Help us provide quality education to underprivileged children. Your donation funds school supplies, uniforms, and scholarships.",
      category: "Education",
      image_url:
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80",
      goal_amount: 20000,
      raised_amount: 12580,
      donors_count: 245,
      status: "active",
      created_by: adminId,
    },
    {
      title: "Save Our Planet",
      description:
        "Join our reforestation mission. We plant trees, restore habitats, and educate communities about climate action.",
      category: "Environment",
      image_url:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
      goal_amount: 35000,
      raised_amount: 22140,
      donors_count: 412,
      status: "active",
      created_by: adminId,
    },
    {
      title: "Animal Rescue Shelter",
      description:
        "Support abandoned pets with food, medical care, and loving homes until they find their forever families.",
      category: "Animals",
      image_url:
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80",
      goal_amount: 15000,
      raised_amount: 9870,
      donors_count: 189,
      status: "active",
      created_by: adminId,
    },
    {
      title: "Clean Water for Every Child",
      description:
        "Build clean water wells in rural communities so children can drink safely and stay in school.",
      category: "Health",
      image_url:
        "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&q=80",
      goal_amount: 50000,
      raised_amount: 38200,
      donors_count: 620,
      status: "active",
      created_by: adminId,
    },
    {
      title: "Green Tomorrow Initiative",
      description:
        "Urban gardens and green spaces for underserved neighborhoods — grow food, community, and hope.",
      category: "Community",
      image_url:
        "https://images.unsplash.com/photo-1466692476866-aef1dfb1e735?w=800&q=80",
      goal_amount: 25000,
      raised_amount: 18750,
      donors_count: 301,
      status: "active",
      created_by: adminId,
    },
    {
      title: "Hope for Health Clinics",
      description:
        "Mobile clinics bringing free checkups, vaccines, and medicine to remote villages.",
      category: "Health",
      image_url:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      goal_amount: 40000,
      raised_amount: 15600,
      donors_count: 178,
      status: "active",
      created_by: adminId,
    },
  ];

  const { data: inserted, error } = await admin
    .from("wecare_campaigns")
    .insert(campaigns)
    .select("id, title");
  if (error) throw new Error(`Seed campaigns: ${error.message}`);
  console.log(`Seeded ${inserted.length} campaigns`);

  const events = [
    {
      title: "Community Cleanup Drive",
      location: "Central Park, New York",
      event_date: "2026-07-15",
      event_time: "9:00 AM",
      image_url:
        "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&q=80",
    },
    {
      title: "Charity Fun Run 5K",
      location: "Brooklyn Bridge Park",
      event_date: "2026-07-28",
      event_time: "7:30 AM",
      image_url:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&q=80",
    },
    {
      title: "Food Drive Volunteer Day",
      location: "Downtown Community Center",
      event_date: "2026-08-05",
      event_time: "10:00 AM",
      image_url:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80",
    },
  ];
  const { error: evErr } = await admin.from("wecare_events").insert(events);
  if (evErr) throw new Error(`Seed events: ${evErr.message}`);

  const activities = [
    {
      user_name: "Anna",
      action: "shared an update on Education for All",
      avatar_color: "#28C76F",
    },
    {
      user_name: "James",
      action: "joined the community",
      avatar_color: "#00CFE8",
    },
    {
      user_name: "Lisa",
      action: "donated to Clean Water for Every Child",
      avatar_color: "#FF9F43",
    },
    {
      user_name: "David",
      action: "created a new campaign",
      avatar_color: "#EA5455",
    },
  ];
  await admin.from("wecare_activities").insert(activities);

  if (inserted[0]) {
    await admin.from("wecare_donations").insert([
      {
        campaign_id: inserted[0].id,
        donor_id: userId,
        donor_name: "John Doe",
        amount: 50,
        status: "completed",
      },
      {
        campaign_id: inserted[0].id,
        donor_id: userId,
        donor_name: "Sarah Johnson",
        amount: 100,
        status: "completed",
      },
      {
        campaign_id: inserted[3]?.id || inserted[0].id,
        donor_name: "Emma Wilson",
        amount: 250,
        status: "completed",
      },
    ]);
  }

  await admin.from("wecare_notifications").insert([
    {
      user_id: userId,
      title: "Donation received",
      body: "Sarah Johnson donated $100 to Education for All",
      read: false,
    },
    {
      user_id: userId,
      title: "Campaign milestone",
      body: "Clean Water for Every Child reached 75% of its goal!",
      read: false,
    },
    {
      user_id: userId,
      title: "New event",
      body: "Community Cleanup Drive is happening on Jul 15",
      read: false,
    },
  ]);

  console.log("Seed data inserted.");
}

async function main() {
  try {
    await runSchema();
  } catch (err) {
    console.error("Schema apply failed:", err.message);
    process.exit(1);
  }

  const userId = await ensureUser({
    email: "john@wecare.app",
    password: "demo123",
    full_name: "John Doe",
    role: "user",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "I'm passionate about making a positive impact in my community and supporting meaningful causes.",
  });

  const adminId = await ensureUser({
    email: "admin@wecare.app",
    password: "admin123",
    full_name: "Wecare Admin",
    role: "admin",
    phone: "+1 (555) 000-0000",
    location: "San Francisco, USA",
    bio: "Platform administrator",
  });

  await seedData(adminId, userId);
  console.log("\n✅ Supabase setup complete.");
  console.log("User:  john@wecare.app / demo123");
  console.log("Admin: admin@wecare.app / admin123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
