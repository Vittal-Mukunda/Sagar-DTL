/**
 * Types + helpers for the generated manifest (public/manifest.json).
 * The manifest is produced by scripts/generate-manifest.mjs at build time and
 * mirrors the folder tree of the repo's content folders.
 */

export interface FileNode {
  name: string;
  type: "file";
  /** Path relative to the data root, e.g. "Notes and Papers/Notes/x.pdf". */
  path: string;
  ext: string;
  size: number;
}

export interface FolderNode {
  name: string;
  type: "folder";
  path: string;
  children: ManifestNode[];
}

export type ManifestNode = FileNode | FolderNode;

export interface Manifest {
  generatedAt: string;
  roots: FolderNode[];
}

/** Vite injects BASE_URL (e.g. "/" locally, "/repo/" on GitHub Pages). */
const BASE = import.meta.env.BASE_URL;

/** Build a servable URL for a manifest path, encoding each segment safely. */
export function fileUrl(relPath: string): string {
  const encoded = relPath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${BASE}data/${encoded}`;
}

/** Fetch + parse the manifest. Throws on network/parse error. */
export async function loadManifest(): Promise<Manifest> {
  const res = await fetch(`${BASE}manifest.json`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load manifest (${res.status})`);
  return res.json();
}

/** Find a top-level root folder by exact name. */
export function findRoot(manifest: Manifest, name: string): FolderNode | undefined {
  return manifest.roots.find((r) => r.name === name);
}

/**
 * Walk a folder by a path of child names. Returns undefined if any segment is
 * missing. Used by FolderBrowser to resolve the current breadcrumb location.
 */
export function resolveFolder(
  root: FolderNode | undefined,
  segments: string[]
): FolderNode | undefined {
  let current = root;
  for (const seg of segments) {
    if (!current) return undefined;
    const next = current.children.find(
      (c): c is FolderNode => c.type === "folder" && c.name === seg
    );
    current = next;
  }
  return current;
}

export const isFolder = (n: ManifestNode): n is FolderNode => n.type === "folder";
export const isFile = (n: ManifestNode): n is FileNode => n.type === "file";

/** Recursively gather every file under a node (used to flatten CSV lookups, etc.). */
export function collectFiles(node: ManifestNode): FileNode[] {
  if (node.type === "file") return [node];
  return node.children.flatMap(collectFiles);
}

/** Human-readable file size. */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
