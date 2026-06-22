import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ExternalLink } from "lucide-react";
import { type FileNode, fileUrl } from "../lib/manifest";
import { Card } from "./Card";

type Row = Record<string, string>;

interface State {
  status: "loading" | "ready" | "error";
  headers: string[];
  rows: Row[];
  error?: string;
}

/** Parse a CSV or XLSX file at the given URL into headers + string rows. */
async function parseTable(file: FileNode): Promise<{ headers: string[]; rows: Row[] }> {
  const url = fileUrl(file.path);
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Could not load ${file.name} (${res.status})`);

  if (file.ext === "csv") {
    const text = await res.text();
    const parsed = Papa.parse<Row>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });
    const headers = (parsed.meta.fields ?? []).filter(Boolean);
    return { headers, rows: parsed.data };
  }

  // Excel — load the (heavy) parser only when an .xlsx is actually opened.
  const XLSX = await import("xlsx");
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<Row>(sheet, { defval: "", raw: false });
  const headers = json.length ? Object.keys(json[0]) : [];
  return { headers, rows: json };
}

/** Render a cell value, linkifying emails, URLs and phone numbers. */
function Cell({ value }: { value: string }) {
  const v = (value ?? "").toString().trim();
  if (!v) return <span className="opacity-30">—</span>;

  if (/^https?:\/\//i.test(v))
    return (
      <a
        href={v}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-bold text-bauhaus-blue underline decoration-2 underline-offset-2 hover:text-bauhaus-red"
      >
        Link <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return (
      <a href={`mailto:${v}`} className="font-medium text-bauhaus-blue hover:text-bauhaus-red break-all">
        {v}
      </a>
    );
  if (/^[+]?[\d][\d\s()-]{6,}$/.test(v))
    return (
      <a href={`tel:${v.replace(/\s/g, "")}`} className="font-medium hover:text-bauhaus-blue">
        {v}
      </a>
    );
  return <span>{v}</span>;
}

export function DataTable({ file }: { file: FileNode }) {
  const [state, setState] = useState<State>({
    status: "loading",
    headers: [],
    rows: [],
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" } | null>(null);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading", headers: [], rows: [] });
    parseTable(file)
      .then((r) => alive && setState({ status: "ready", ...r }))
      .catch(
        (e) =>
          alive &&
          setState({ status: "error", headers: [], rows: [], error: String(e.message ?? e) })
      );
    return () => {
      alive = false;
    };
  }, [file.path]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = state.rows;
    if (q) {
      rows = rows.filter((row) =>
        Object.values(row).some((v) => (v ?? "").toString().toLowerCase().includes(q))
      );
    }
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = (a[sort.col] ?? "").toString();
        const bv = (b[sort.col] ?? "").toString();
        const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: "base" });
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [state.rows, query, sort]);

  const toggleSort = (col: string) =>
    setSort((prev) =>
      prev?.col === col
        ? { col, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" }
    );

  if (state.status === "loading")
    return <Card className="p-8 font-bold uppercase tracking-wide">Loading table…</Card>;

  if (state.status === "error")
    return (
      <Card className="p-8">
        <p className="font-bold uppercase tracking-wide text-bauhaus-red">
          Could not read this file
        </p>
        <p className="mt-2 font-medium opacity-70">{state.error}</p>
      </Card>
    );

  return (
    <div>
      {/* Search */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full border-2 border-foreground bg-white pl-10 pr-3 py-3 font-medium shadow-hard-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          />
        </div>
        <p className="label-bauhaus opacity-60">
          {filtered.length} / {state.rows.length} rows
        </p>
      </div>

      <div className="overflow-x-auto border-2 md:border-4 border-foreground shadow-hard md:shadow-hard-lg bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-foreground text-white">
              {state.headers.map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 align-bottom">
                  <button
                    onClick={() => toggleSort(h)}
                    className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wide hover:text-bauhaus-yellow"
                  >
                    {h}
                    {sort?.col === h ? (
                      sort.dir === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr
                key={i}
                className={`border-t-2 border-foreground ${
                  i % 2 ? "bg-muted/40" : "bg-white"
                }`}
              >
                {state.headers.map((h) => (
                  <td key={h} className="px-4 py-3 align-top font-medium">
                    <Cell value={row[h]} />
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={state.headers.length || 1}
                  className="px-4 py-8 text-center font-bold uppercase tracking-wide opacity-60"
                >
                  No matching rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
