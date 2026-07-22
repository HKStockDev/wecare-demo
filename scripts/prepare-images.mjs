import sharp from "sharp";
import { join } from "path";
import { writeFileSync } from "fs";

const pub = join(process.cwd(), "public", "images");
const assets =
  "C:/Users/Administrator/.cursor/projects/c-Users-Administrator-Documents-MyWorkStation-26-07-21-ReactNative/assets";
const appLogo =
  "C:/Users/Administrator/Documents/MyWorkStation/26-07-21_ReactNative/App_logo.png";

async function main() {
  const meta = await sharp(appLogo).metadata();
  console.log("App_logo", meta.width, meta.height);

  // Crop roughly the green circle (upper-center of splash)
  const cropSize = Math.min(meta.width, meta.height) - 40;
  const left = Math.floor((meta.width - cropSize) / 2);
  const top = Math.max(0, Math.floor((meta.height - cropSize) / 2) - 28);
  const square = await sharp(appLogo)
    .extract({
      left,
      top,
      width: cropSize,
      height: Math.min(cropSize, meta.height - top),
    })
    .resize(256, 256)
    .png()
    .toBuffer();

  const mask = Buffer.from(
    `<svg width="256" height="256"><circle cx="128" cy="128" r="128" fill="white"/></svg>`
  );

  await sharp(square)
    .composite([{ input: await sharp(mask).png().toBuffer(), blend: "dest-in" }])
    .png()
    .toFile(join(pub, "logo-mark.png"));
  console.log("wrote logo-mark.png from App_logo");

  // Prefer generated clean mark as primary if App crop looks off — also keep alt
  await sharp(join(assets, "logo-mark.png"))
    .resize(256, 256)
    .png()
    .toFile(join(pub, "logo-mark-alt.png"));

  // Use generated clean circular logo as the main mark, masked to circle
  const gen = await sharp(join(assets, "logo-mark.png"))
    .resize(256, 256)
    .ensureAlpha()
    .png()
    .toBuffer();
  await sharp(gen)
    .composite([{ input: await sharp(mask).png().toBuffer(), blend: "dest-in" }])
    .png()
    .toFile(join(pub, "logo-mark.png"));
  console.log("wrote clean circular logo-mark.png");

  await sharp(join(assets, "icon-wave.png"))
    .resize(64, 64)
    .png()
    .toFile(join(pub, "icon-wave.png"));
  await sharp(join(assets, "icon-heart.png"))
    .resize(64, 64)
    .png()
    .toFile(join(pub, "icon-heart.png"));

  const camps = {
    "campaigns/education.jpg":
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    "campaigns/environment.jpg":
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    "campaigns/animals.jpg":
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80",
    "campaigns/water.jpg":
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
    "campaigns/community.jpg":
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
    "campaigns/health.jpg":
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  };

  for (const [path, url] of Object.entries(camps)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf)
        .resize(800, 500, { fit: "cover" })
        .jpeg({ quality: 82 })
        .toFile(join(pub, path));
      console.log("ok", path);
    } catch (e) {
      console.log("fail", path, e.message);
    }
  }

  // Sidebar decorative illustration (soft green community)
  try {
    const res = await fetch(
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=200&fit=crop&q=80"
    );
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize(320, 120, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toFile(join(pub, "admin-sidebar-art.jpg"));
    console.log("ok admin-sidebar-art.jpg");
  } catch (e) {
    console.log("fail sidebar art", e.message);
  }

  writeFileSync(join(pub, ".assets-ready"), new Date().toISOString());
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
