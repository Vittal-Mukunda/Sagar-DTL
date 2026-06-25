import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { type Manifest, loadManifest, EVENTS_URL } from "./manifest";

interface ManifestState {
  status: "loading" | "ready" | "error";
  manifest?: Manifest;
  error?: string;
  /** Whether the live API (real-time updates) is backing this data. */
  live: boolean;
}

const Ctx = createContext<ManifestState>({ status: "loading", live: false });

/** How often to re-scan as a fallback when live updates are available. */
const POLL_MS = 5000;

/** Structural fingerprint, ignoring the per-scan generatedAt timestamp. */
const signature = (m: Manifest) => JSON.stringify(m.roots);

/**
 * Loads the manifest and keeps it in sync with the filesystem: it subscribes to
 * the server's change stream (SSE) for instant updates and also re-scans on an
 * interval as a safety net. The UI only re-renders when the folder tree
 * actually changed, so idle polls are free.
 */
export function ManifestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ManifestState>({
    status: "loading",
    live: false,
  });
  const sigRef = useRef<string>("");

  useEffect(() => {
    let stopped = false;
    let source: EventSource | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;

    /** Re-fetch; update state only when the tree changed (or on first load). */
    async function refresh(initial: boolean) {
      try {
        const { manifest, live } = await loadManifest();
        if (stopped) return live;
        const sig = signature(manifest);
        if (initial || sig !== sigRef.current) {
          sigRef.current = sig;
          setState({ status: "ready", manifest, live });
        }
        return live;
      } catch (e) {
        if (initial && !stopped) {
          setState({ status: "error", error: String((e as Error).message ?? e), live: false });
        }
        return false;
      }
    }

    refresh(true).then((live) => {
      if (stopped || !live) return;

      // Real-time: the server pushes on every create/rename/delete.
      try {
        source = new EventSource(EVENTS_URL);
        source.addEventListener("change", () => refresh(false));
      } catch {
        // EventSource unavailable — polling below still keeps us in sync.
      }

      // Fallback: periodic re-scan in case a watch event is missed.
      timer = setInterval(() => refresh(false), POLL_MS);
    });

    return () => {
      stopped = true;
      source?.close();
      if (timer) clearInterval(timer);
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useManifest = () => useContext(Ctx);
