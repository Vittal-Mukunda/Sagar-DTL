import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-expect-error — plain .mjs plugin, no type declarations
import { contentApi } from "./vite-plugin-content-api.mjs";

// `base` is overridden at build time by the GitHub Action so the site works
// from a project page URL like https://<user>.github.io/<repo>/.
// Set the BASE_PATH env var (the Action does this automatically).
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  // contentApi() adds the live filesystem API (/api/manifest, /data, /api/events)
  // to both the dev and preview servers, so folders are never hardcoded.
  plugins: [react(), contentApi()],
});
