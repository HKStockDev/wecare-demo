import sharp from "sharp";
import { copyFileSync, writeFileSync } from "fs";
import { join } from "path";

const src =
  "C:/Users/Administrator/.cursor/projects/c-Users-Administrator-Documents-MyWorkStation-26-07-21-ReactNative/assets/c__Users_Administrator_Documents_MyWorkStation_26-07-21_ReactNative_image-removebg-preview.png";
const heroSrc =
  "C:/Users/Administrator/.cursor/projects/c-Users-Administrator-Documents-MyWorkStation-26-07-21-ReactNative/assets/c__Users_Administrator_Documents_MyWorkStation_26-07-21_ReactNative_login_ad.png";
const pub = join(process.cwd(), "public", "images");

copyFileSync(src, join(pub, "logo-source.png"));
copyFileSync(heroSrc, join(pub, "admin-login-hero.png"));

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

let minX = width,
  minY = height,
  maxX = 0,
  maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 20) continue;
    if (r < 25 && g < 25 && b < 25) continue;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
}

const side = Math.max(maxX - minX + 1, maxY - minY + 1) + 8;
const cx = Math.floor((minX + maxX) / 2);
const cy = Math.floor((minY + maxY) / 2);
const left = Math.max(0, Math.min(width - side, cx - Math.floor(side / 2)));
const top = Math.max(0, Math.min(height - side, cy - Math.floor(side / 2)));
const extractW = Math.min(side, width - left);
const extractH = Math.min(side, height - top);

console.log({ minX, minY, maxX, maxY, left, top, extractW, extractH });

const square = await sharp(src)
  .extract({ left, top, width: extractW, height: extractH })
  .resize(512, 512, { fit: "cover" })
  .png()
  .toBuffer();

const maskSvg = `<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="white"/></svg>`;
writeFileSync(join(pub, "_mask.svg"), maskSvg);
const mask = await sharp(join(pub, "_mask.svg")).png().toBuffer();

await sharp(square)
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toFile(join(pub, "logo-mark.png"));

// Same file for all logo usages
copyFileSync(join(pub, "logo-mark.png"), join(pub, "App_logo.png"));
copyFileSync(join(pub, "logo-mark.png"), join(pub, "logo.png"));

console.log("Logo assets updated from image-removebg-preview.png");
