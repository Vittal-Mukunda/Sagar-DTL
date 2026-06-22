import { useState } from "react";
import { Folder, FolderOpen, ChevronRight, Download, Home } from "lucide-react";
import {
  type FolderNode,
  type ManifestNode,
  fileUrl,
  formatSize,
  isFolder,
  resolveFolder,
} from "../lib/manifest";
import { Card } from "./Card";
import { FileIcon } from "./FileIcon";
import { Shape, accentByIndex } from "./Shapes";

interface FolderBrowserProps {
  root: FolderNode;
  /** Label for the root crumb (defaults to the folder name). */
  rootLabel?: string;
  /** Extensions to hide (e.g. ["csv"] when a page renders them as tables). */
  hideExts?: string[];
}

/**
 * The dynamic engine — recursively browses any folder from the manifest.
 * Navigating into subfolders is internal state (no routing), with breadcrumbs.
 * Adding folders/files to the repo makes them appear here automatically.
 */
export function FolderBrowser({ root, rootLabel, hideExts = [] }: FolderBrowserProps) {
  const [segments, setSegments] = useState<string[]>([]);
  const current = resolveFolder(root, segments) ?? root;

  const visible: ManifestNode[] = current.children.filter(
    (n) => n.type === "folder" || !hideExts.includes(n.ext)
  );

  const goTo = (depth: number) => setSegments(segments.slice(0, depth));

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-1 mb-6 text-sm font-bold uppercase tracking-wide">
        <button
          onClick={() => setSegments([])}
          className="press inline-flex items-center gap-1 px-2 py-1 border-2 border-foreground bg-white shadow-hard-sm hover:bg-muted"
        >
          <Home className="h-4 w-4" />
          {rootLabel ?? root.name}
        </button>
        {segments.map((seg, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            <ChevronRight className="h-4 w-4 opacity-50" />
            <button
              onClick={() => goTo(i + 1)}
              className="px-2 py-1 hover:text-bauhaus-blue"
            >
              {seg}
            </button>
          </span>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((node, i) =>
            isFolder(node) ? (
              <Card
                key={node.path}
                decorIndex={i}
                interactive
                className="p-5"
                onClick={() => setSegments([...segments, node.name])}
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 flex h-12 w-12 items-center justify-center border-2 border-foreground bg-bauhaus-yellow">
                    <Folder className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-lg leading-tight break-words pr-4">
                      {node.name}
                    </p>
                    <p className="label-bauhaus mt-1 opacity-60">
                      {node.children.length} item
                      {node.children.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <a
                key={node.path}
                href={fileUrl(node.path)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card decorIndex={i} interactive className="p-5 h-full">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 flex h-12 w-12 items-center justify-center border-2 border-foreground bg-white text-bauhaus-blue">
                      <FileIcon ext={node.ext} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-tight break-words pr-4">
                        {node.name}
                      </p>
                      <p className="label-bauhaus mt-1 opacity-60 flex items-center gap-2">
                        <span>{node.ext || "file"}</span>
                        <span>·</span>
                        <span>{formatSize(node.size)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-bauhaus-red opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="h-4 w-4" /> Open
                  </div>
                </Card>
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="p-10 text-center">
      <div className="flex justify-center gap-3 mb-5" aria-hidden>
        <Shape kind="circle" accent={accentByIndex(0)} size="h-6 w-6" />
        <Shape kind="square" accent={accentByIndex(1)} size="h-6 w-6" />
        <Shape kind="triangle" accent={accentByIndex(2)} size="h-6 w-6" />
      </div>
      <FolderOpen className="mx-auto h-10 w-10 mb-3" strokeWidth={2} />
      <p className="font-bold text-xl uppercase tracking-tight">Nothing here yet</p>
      <p className="mt-2 font-medium opacity-70 max-w-md mx-auto">
        Files added to this folder on GitHub will show up here automatically.
      </p>
    </Card>
  );
}
