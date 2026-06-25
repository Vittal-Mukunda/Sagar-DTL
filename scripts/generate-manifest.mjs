// @ts-check
/**
 * Static build generator — for hosts that can't run a server (GitHub Pages).
 *
 * The website is normally driven by the LIVE API (vite-plugin-content-api.mjs),
 * which scans the filesystem on every request so manual folder changes show up
 * instantly. For a fully static export there's no server to scan on demand, so
 * this script snapshots the tree into `public/manifest.json` and copies the
 * content folders into `public/data/` at build time. The frontend falls back to
 * that snapshot automatically when the live API isn't reachable.
 *
 * Run manually:  node scripts/generate-manifest.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanContent, discoverRoots, countFiles } from "./scan-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_OUT = path.join(PUBLIC_DIR, "data");
const MANIFEST_OUT = path.join(PUBLIC_DIR, "manifest.json");

function main() {
  const roots = discoverRoots(ROOT);

  // Reset the output data dir so deleted files don't linger.
  fs.rmSync(DATA_OUT, { recursive: true, force: true });
  fs.mkdirSync(DATA_OUT, { recursive: true });

  // Copy each content folder into public/data so the built site can serve files.
  for (const name of roots) {
    fs.cpSync(path.join(ROOT, name), path.join(DATA_OUT, name), {
      recursive: true,
    });
  }

  const manifest = scanContent(ROOT);
  fs.writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 2), "utf8");

  const total = manifest.roots.reduce((sum, r) => sum + countFiles(r), 0);
  console.log(
    `[manifest] ${roots.length} folder(s), ${total} file(s) -> public/manifest.json`
  );
  manifest.roots.forEach((r) => console.log(`  - ${r.name} (${countFiles(r)} files)`));
}

main();
