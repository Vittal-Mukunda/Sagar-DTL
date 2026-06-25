# IEM Department Website — RV College of Engineering

A self-updating website for the Department of Industrial Engineering & Management.
It gathers **study material, previous-year question papers, placement opportunities,
student projects, the student directory & EL list, and alumni/seniors' contacts** in one
place — with a bold Bauhaus design.

> **The big idea:** you never touch the code. Add files and folders to the repository,
> push them, and the website rebuilds itself to match. New folders become new browsable
> sections automatically.

- **Repository:** https://github.com/Vittal-Mukunda/Sagar-DTL
- **Live site:** https://vittal-mukunda.github.io/Sagar-DTL/

---

## 🚀 Set up from scratch with an AI agent (Antigravity / Cursor / Copilot Agent)

Got a **brand-new machine with nothing installed**? Open your AI coding agent
(Antigravity, Cursor, Windsurf, GitHub Copilot Agent, etc.), and **copy-paste the
prompt below verbatim**. The agent will install everything, pull the project, and
launch a live preview for you.

> 📋 **Copy everything inside the box below into the agent and send it:**

```text
You are setting up a web project on a brand-new computer that has NO development
tools installed yet. Do everything end-to-end and do not ask me to run commands
manually — run them yourself, verify each step succeeded, and fix any errors you hit.

PROJECT: "IEM Department Website" — a React + Vite + TypeScript + Tailwind site.
GITHUB REPO: https://github.com/Vittal-Mukunda/Sagar-DTL

Do the following, in order:

1. DETECT THE OS (Windows, macOS, or Linux) and use the matching commands.

2. INSTALL GIT if it is not already installed.
   - Windows: use winget ("winget install --id Git.Git -e") or download from git-scm.com.
   - macOS: "brew install git" (install Homebrew first if missing).
   - Linux: use the system package manager (apt/dnf/pacman).
   - Verify with "git --version".

3. INSTALL NODE.JS version 20 LTS (this includes npm) if it is not already installed.
   - Windows: "winget install --id OpenJS.NodeJS.LTS -e" (or use nvm-windows).
   - macOS: "brew install node@20" (or use nvm).
   - Linux: install via nvm ("nvm install 20") or NodeSource.
   - Verify with "node --version" (must be 20.x) and "npm --version".

4. CLONE THE REPOSITORY into a sensible folder and cd into it:
   git clone https://github.com/Vittal-Mukunda/Sagar-DTL.git
   cd Sagar-DTL

5. INSTALL DEPENDENCIES from package.json:
   npm install

6. START THE DEV SERVER:
   npm run dev
   This automatically regenerates the content manifest first, then serves the site
   at http://localhost:5173 . Open that URL in a browser to show me the live preview.

7. VERIFY: confirm the dev server is running, the page loads with no console errors,
   and the Home page plus the section pages (Study Material, Placements, Projects,
   Students, Alumni) are reachable. If anything fails, read the error, fix it, and retry.

8. (Optional) Confirm a production build also works:
   npm run build      # type-checks, regenerates the manifest, and bundles into dist/
   npm run preview    # serves the production build locally

When finished, tell me the local preview URL and a one-line summary of what you installed.
```

That single prompt is enough — the agent handles Git, Node.js, dependencies, the manifest
step, and the preview without any manual setup.

---

## How to add content (no coding)

Everything lives inside these five folders at the top of the repository:

| Folder | What goes in it | Shows up on page |
|---|---|---|
| `Notes and Papers/` | Notes, assignments, **PYQPs** (organise into subfolders by subject) | **Study Material** |
| `Placement Data/` | Placement notices (PDFs) + `opportunities.csv` | **Placements** |
| `Student Project/` | Project reports, slides, demos | **Projects** |
| `Students/` | `students.csv` (directory + EL list) | **Students** |
| `Alumni Contacts/` | `seniors.csv` (alumni + their companies) | **Alumni** |

After any change is pushed to the `main` branch, GitHub Actions rebuilds the site
automatically. Wait ~1–2 minutes and refresh the live site.

### ➕ Adding a new subject

A "subject" is just a **folder** inside `Notes and Papers/`. Create it and it becomes a
browsable card on the **Study Material** page — no code changes needed.

**On GitHub (easiest):**
1. Open the `Notes and Papers/` folder on GitHub.
2. Click **Add file → Create new file**.
3. In the filename box, type the subject folder name **followed by a slash**, then a
   placeholder filename. GitHub creates the folder when you add a file inside it. Example:
   ```
   IM252IB Quality Engineering/README.md
   ```
4. Put a short line of text in the file (e.g. `Notes and papers for Quality Engineering`)
   and commit. The new subject card appears on the site.
5. Now upload the real PDFs into that folder (see below).

> 💡 **Naming tip:** name the folder with the **course code + full subject name**, exactly
> as you want it shown, e.g. `IM252IA Operations Research` or
> `MAT231TB Statistics, Laplace Transform and Numerical Methods`. The folder name is the
> card title on the site.

You can also nest folders (e.g. a subject folder containing `Notes/` and `Papers/`
subfolders). The site mirrors whatever folder structure you create.

### 📎 Adding files (PDFs, slides, etc.) the right way

1. Open the target folder on GitHub (e.g. `Notes and Papers/IM252IA Operations Research/`).
2. Click **Add file → Upload files**, then **drag your files in**.
3. Add a short commit message and click **Commit changes**.
4. Wait ~1–2 minutes for the rebuild; the files appear on the site automatically.

**File guidelines:**
- ✅ Supported & previewable: **PDF**. Also fine to upload: images, slides, docs, `.zip`.
- ✅ Use clear, human-readable filenames (e.g. `2023 Mid-Sem QP.pdf`, not `scan001.pdf`) —
  the filename is what visitors see and click.
- ⚠️ Avoid huge files. GitHub blocks single files over **100 MB**; keep PDFs reasonable.
- ⚠️ Don't rename the **CSV files** (`students.csv`, `opportunities.csv`, `seniors.csv`) —
  the pages look for those exact names.

### 📊 Adding / editing tables (Students, Placements, Alumni)

These pages read **CSV files** you can edit in Excel or Google Sheets and export as `.csv`.
Template files are already in the repo — open one to see its columns, then replace the
example rows with real data:

- `Students/students.csv` → `Name, USN, Section, Phone, Email, EL Topic`
- `Placement Data/opportunities.csv` → `Company, Role, Package, Eligibility, Deadline, Link`
- `Alumni Contacts/seniors.csv` → `Name, Batch, Company, Role, LinkedIn, Email`

You can add or remove columns freely — the table shows whatever columns your file has.
Email, phone and link columns become clickable automatically.

> ⚠️ **Privacy note:** this site is public, so any phone numbers/emails in the CSVs are
> visible to everyone on the internet and may be collected by spam bots. Only include
> contact details you're comfortable making public.

---

## Hosting (one-time setup)

The site deploys to **GitHub Pages** via the workflow in `.github/workflows/deploy.yml`.

1. Push this project to a GitHub repository.
2. In the repo, go to **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Every push to the `main` branch now rebuilds and redeploys automatically.
4. Your site lives at `https://<your-username>.github.io/<repo-name>/`.

---

## Running locally (optional, for developers)

```bash
npm install      # one time
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build into dist/
npm run manifest # regenerate the folder index after adding files locally
```

When the dev or preview server is running, the folder structure on disk is the
**single source of truth** — create, rename or delete a folder in the file
manager and the open website updates on its own, no rebuild and no code change.
`npm run build` additionally snapshots the tree into `manifest.json` for fully
static hosting (GitHub Pages).

---

## How it works (for developers)

- **`vite-plugin-content-api.mjs`** is the live backend, mounted on both the dev and
  preview servers. It exposes:
  - `GET /api/manifest` — scans the content root on every request (no caching) and returns the folder tree as JSON.
  - `GET /data/<path>` — streams the actual file straight from disk (path-traversal protected).
  - `GET /api/events` — a Server-Sent Events stream; an `fs.watch` on the content root pushes a
    `change` event whenever anything is added/renamed/removed.
  Set `CONTENT_ROOT` to scan a directory other than the repo root.
- **`scripts/scan-content.mjs`** holds the shared directory-walk logic used by both the live API
  and the static build generator, so all modes describe the tree identically.
- **`scripts/generate-manifest.mjs`** is the static fallback: at build time it writes
  `public/manifest.json` and copies files into `public/data/` for hosts that can't run a server.
- **`src/lib/ManifestContext.tsx`** loads from the live API, subscribes to the SSE stream for
  instant updates, and also re-scans every few seconds as a safety net. It falls back to the
  static `manifest.json` when no server is reachable.
- **React + Vite + TypeScript + Tailwind** render that manifest. `FolderBrowser`
  recursively renders folders/files; `DataTable` parses CSV/XLSX into a searchable table.
- **`src/config/sections.ts`** is the only place that maps a folder to a page (title, colour,
  icon). The *contents* are always dynamic, so day-to-day additions need no code edits.
- Design tokens (Bauhaus colours, hard shadows, Outfit font) live in `tailwind.config.ts`
  and `src/index.css`.

Tech: React 18, Vite 5, Tailwind 3, react-router-dom (HashRouter), lucide-react,
papaparse, xlsx.
