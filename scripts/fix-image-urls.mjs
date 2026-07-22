import pg from "pg";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), ".env.local") });

const client = new pg.Client({
  host: "aws-1-ap-south-1.pooler.supabase.com",
  port: 6543,
  database: process.env.POSTGRES_DB || "postgres",
  user: "postgres.wkevlvlpffjyuakemnij",
  password: process.env.POSTGRES_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

const map = [
  ["Education for All", "/images/campaigns/education.jpg"],
  ["Save Our Planet", "/images/campaigns/environment.jpg"],
  ["Animal Rescue Shelter", "/images/campaigns/animals.jpg"],
  ["Clean Water for Every Child", "/images/campaigns/water.jpg"],
  ["Green Tomorrow Initiative", "/images/campaigns/community.jpg"],
  ["Hope for Health Clinics", "/images/campaigns/health.jpg"],
];

await client.connect();
for (const [title, url] of map) {
  const r = await client.query(
    "update public.wecare_campaigns set image_url=$1 where title=$2",
    [url, title]
  );
  console.log(title, r.rowCount);
}
await client.query(
  "update public.wecare_profiles set avatar_url=$1 where email=$2",
  ["/images/avatars/john.jpg", "john@wecare.app"]
);
await client.query(
  "update public.wecare_profiles set avatar_url=$1 where email=$2",
  ["/images/avatars/admin.jpg", "admin@wecare.app"]
);
console.log("profiles updated");
await client.end();
