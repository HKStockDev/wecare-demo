import sharp from "sharp";
import { copyFileSync } from "fs";
import { join } from "path";

const appLogo =
  "C:/Users/Administrator/Documents/MyWorkStation/26-07-21_ReactNative/App_logo.png";
const pub = join(process.cwd(), "public", "images");

copyFileSync(appLogo, join(pub, "App_logo.png"));
copyFileSync(appLogo, join(pub, "logo.png"));

const { data, info } = await sharp(appLogo)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

// Strict primary-green fill (circle only, not pale blobs / text edge cases)
function isCircleGreen(r, g, b) {
  // App_logo primary green fill
  return g > 120 && g > r + 35 && g > b + 35 && r < 130 && b < 130;
}

let sumX = 0,
  sumY = 0,
  n = 0;
const pts = [];
for (let y = 0; y < Math.floor(height * 0.72); y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    if (isCircleGreen(data[i], data[i + 1], data[i + 2])) {
      sumX += x;
      sumY += y;
      n++;
      pts.push([x, y]);
    }
  }
}

if (n < 200) throw new Error(`Too few circle pixels: ${n}`);

const cx = sumX / n;
const cy = sumY / n;

// Radius = 95th percentile distance from center (ignore outliers)
const dists = pts.map(([x, y]) => Math.hypot(x - cx, y - cy)).sort((a, b) => a - b);
const radius = dists[Math.floor(dists.length * 0.95)];
const side = Math.ceil(radius * 2) + 8;
const left = Math.max(0, Math.round(cx - side / 2));
const top = Math.max(0, Math.round(cy - side / 2));
const extractW = Math.min(side, width - left);
const extractH = Math.min(side, height - top);

console.log({ cx, cy, radius, left, top, extractW, extractH, n });

const square = await sharp(appLogo)
  .extract({ left, top, width: extractW, height: extractH })
  .resize(256, 256, { fit: "cover" })
  .png()
  .toBuffer();

const mask = Buffer.from(
  `<svg width="256" height="256"><circle cx="128" cy="128" r="128" fill="white"/></svg>`
);

await sharp(square)
  .composite([{ input: await sharp(mask).png().toBuffer(), blend: "dest-in" }])
  .png()
  .toFile(join(pub, "logo-mark.png"));

console.log("OK: logo-mark.png from App_logo.png circle");
