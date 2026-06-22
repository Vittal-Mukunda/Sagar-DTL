import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Manifest, loadManifest } from "./manifest";

interface ManifestState {
  status: "loading" | "ready" | "error";
  manifest?: Manifest;
  error?: string;
}

const Ctx = createContext<ManifestState>({ status: "loading" });

/** Loads the manifest once and shares it with the whole app. */
export function ManifestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ManifestState>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    loadManifest()
      .then((m) => alive && setState({ status: "ready", manifest: m }))
      .catch((e) => alive && setState({ status: "error", error: String(e.message ?? e) }));
    return () => {
      alive = false;
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useManifest = () => useContext(Ctx);
