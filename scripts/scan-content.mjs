// @ts-check
/**
 * Shared filesystem scanner — the single source of truth for the content tree.
 *
 * Both the live API (vite-plugin-content-api.mjs) and the static build
 * generator (generate-manifest.mjs) import `scanContent()` from here, so the
 * dev server, the preview server and a static GitHub Pages build all describe
 * the folder tree identically.
 *
 * The folder structure on disk is authoritative: this module never caches and
 * re-reads the directory on every call, so creating / renaming / deleting a
 * folder is reflected the next time it runs.
 */
import fs from "node:fs";
import path from "node:path";

/** Top-level entries that are code/config, never content. */
export const DENYLIST = new Set([
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
export const IGNORED_FILES = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);

/**
 * Recursively describe a directory.
 * @param {string} absPath absolute path on disk
 * @param {string} relPath path relative to the content root (used for URLs)
 * @returns {object}
 */
export function walk(absPath, relPath) {
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
export function countFiles(node) {
  if (node.type === "file") return 1;
  return (node.children ?? []).reduce((sum, c) => sum + countFiles(c), 0);
}

/** Top-level content folder names: every directory not in the denylist. */
export function discoverRoots(contentRoot) {
  return fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter(
      (e) => e.isDirectory() && !e.name.startsWith(".") && !DENYLIST.has(e.name)
    )
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * Scan the content root and return the manifest object the frontend consumes.
 * Pure read — no files are copied or written.
 * @param {string} contentRoot absolute path to scan
 * @returns {{ generatedAt: string, roots: object[] }}
 */
export function scanContent(contentRoot) {
  const roots = discoverRoots(contentRoot).map((name) =>
    walk(path.join(contentRoot, name), name)
  );
  return { generatedAt: new Date().toISOString(), roots };
}
