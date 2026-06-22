import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` is overridden at build time by the GitHub Action so the site works
// from a project page URL like https://<user>.github.io/<repo>/.
// Set the BASE_PATH env var (the Action does this automatically).
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
});
