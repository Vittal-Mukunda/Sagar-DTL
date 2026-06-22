// @ts-check
/**
 * Build-time manifest generator — the heart of the "zero code change" workflow.
 *
 * It walks every top-level CONTENT folder in the repo (everything that isn't
 * code/config), produces `public/manifest.json` describing the full folder tree,
 * and copies those folders into `public/data/` so GitHub Pages can serve the files.
 *
 * Add a PDF or a new folder anywhere under a content folder, push it, and the
 * GitHub Action reruns this script — the website picks it up automatically.
 *
 * Run manually:  node scripts/generate-manifest.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_OUT = path.join(PUBLIC_DIR, "data");
const MANIFEST_OUT = path.join(PUBLIC_DIR, "manifest.json");

/** Top-level entries that are code/config, never content. */
const DENYLIST = new Set([
  "node_modules",
  "src",
  "public",
  "scripts",
  "dist",
  ".git",
  ".github",
  ".vscode",
  ".idea",
]);

/** Files we never expose (junk / system files). */
const IGNORED_FILES = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);

/**
 * Recursively describe a directory.
 * @param {string} absPath absolute path on disk
 * @param {string} relPath path relative to the repo's content root (used for URLs)
 * @returns {object}
 */
function walk(absPath, relPath) {
  const entries = fs
    .readdirSync(absPath, { withFileTypes: true })
    .filter((e) => !e.name.startsWith(".") && !IGNORED_FILES.has(e.name))
    // folders first, then alphabetical — stable, predictable ordering
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

  const children = entries.map((entry) => {
    const childRel = path.posix.join(relPath, entry.name);
    const childAbs = path.join(absPath, entry.name);
    if (entry.isDirectory()) {
      return walk(childAbs, childRel);
    }
    const stat = fs.statSync(childAbs);
    return {
      name: entry.name,
      type: "file",
      path: childRel,
      ext: path.extname(entry.name).slice(1).toLowerCase(),
      size: stat.size,
    };
  });

  return {
    name: path.basename(absPath),
    type: "folder",
    path: relPath,
    children,
  };
}

/** Recursively count files in a node (for nice empty-state / summary UI). */
function countFiles(node) {
  if (node.type === "file") return 1;
  return (node.children ?? []).reduce((sum, c) => sum + countFiles(c), 0);
}

function main() {
  // Discover content folders: every top-level directory not in the denylist.
  const roots = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() && !e.name.startsWith(".") && !DENYLIST.has(e.name)
    )
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // Reset the output data dir so deleted files don't linger.
  fs.rmSync(DATA_OUT, { recursive: true, force: true });
  fs.mkdirSync(DATA_OUT, { recursive: true });

  const tree = roots.map((name) => {
    const absPath = path.join(ROOT, name);
    // Copy the folder into public/data so the built site can serve the files.
    fs.cpSync(absPath, path.join(DATA_OUT, name), { recursive: true });
    return walk(absPath, name);
  });

  const manifest = {
    generatedAt: new Date().toISOString(),
    roots: tree,
  };

  fs.writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 2), "utf8");

  const total = tree.reduce((sum, r) => sum + countFiles(r), 0);
  console.log(
    `[manifest] ${roots.length} folder(s), ${total} file(s) -> public/manifest.json`
  );
  roots.forEach((r, i) => console.log(`  - ${r} (${countFiles(tree[i])} files)`));
}

main();
