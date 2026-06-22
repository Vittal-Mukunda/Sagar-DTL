import { useParams } from "react-router-dom";
import { getSection } from "../config/sections";
import { useManifest } from "../lib/ManifestContext";
import { findRoot, isFile, type FileNode } from "../lib/manifest";
import { SectionHeader } from "../components/SectionHeader";
import { FolderBrowser } from "../components/FolderBrowser";
import { DataTable } from "../components/DataTable";
import { Card } from "../components/Card";
import { NotFound } from "./NotFound";

const TABLE_EXTS = ["csv", "xlsx", "xls"];

/**
 * One generic page renders every content section. It reads the section config
 * for title/colour, finds the matching folder in the manifest, and renders:
 *   - any spreadsheet (csv/xlsx) at the top level as a searchable DataTable, and
 *   - everything else through the recursive FolderBrowser.
 * Both are fully dynamic — driven entirely by what's in the repo.
 */
export function SectionPage() {
  const { id } = useParams();
  const section = id ? getSection(id) : undefined;
  const { status, manifest, error } = useManifest();

  if (!section) return <NotFound />;

  const root = manifest ? findRoot(manifest, section.folder) : undefined;

  // Top-level spreadsheets become tables; folders+other files go to the browser.
  const tables: FileNode[] = root
    ? root.children.filter((n): n is FileNode => isFile(n) && TABLE_EXTS.includes(n.ext))
    : [];
  const hasBrowsable = root
    ? root.children.some((n) => n.type === "folder" || !TABLE_EXTS.includes(n.ext))
    : false;

  return (
    <div>
      <SectionHeader
        eyebrow="IEM · RVCE"
        title={section.title}
        description={section.description}
        accent={section.accent}
        icon={section.icon}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {status === "loading" && (
          <Card className="p-8 font-bold uppercase tracking-wide">Loading…</Card>
        )}

        {status === "error" && (
          <Card className="p-8">
            <p className="font-bold uppercase tracking-wide text-bauhaus-red">
              Failed to load content
            </p>
            <p className="mt-2 font-medium opacity-70">{error}</p>
          </Card>
        )}

        {status === "ready" && !root && (
          <Card className="p-10 text-center">
            <p className="font-bold text-xl uppercase tracking-tight">
              Folder “{section.folder}” not found yet
            </p>
            <p className="mt-2 font-medium opacity-70 max-w-lg mx-auto">
              Create a folder named <code className="font-bold">{section.folder}</code> in
              the repository and add files to it. This page will fill in automatically.
            </p>
          </Card>
        )}

        {status === "ready" && root && (
          <div className="space-y-12">
            {tables.map((file) => (
              <section key={file.path}>
                <h2 className="text-2xl sm:text-3xl mb-5 flex items-center gap-3">
                  <span className="h-5 w-5 bg-bauhaus-yellow border-2 border-foreground" />
                  {file.name.replace(/\.[^.]+$/, "")}
                </h2>
                <DataTable file={file} />
              </section>
            ))}

            {hasBrowsable && (
              <section>
                {tables.length > 0 && (
                  <h2 className="text-2xl sm:text-3xl mb-5 flex items-center gap-3">
                    <span className="h-5 w-5 rounded-full bg-bauhaus-red border-2 border-foreground" />
                    Files & Folders
                  </h2>
                )}
                <FolderBrowser root={root} rootLabel={section.nav} hideExts={TABLE_EXTS} />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
