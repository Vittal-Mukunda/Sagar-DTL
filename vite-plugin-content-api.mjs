// @ts-check
/**
 * Live content API — the backend that makes the filesystem the single source
 * of truth at runtime (no build step, no hardcoded folders).
 *
 * Runs as Vite middleware in BOTH `vite` (dev) and `vite preview` (production
 * preview), exposing three routes mounted on the same origin as the app:
 *
 *   GET /api/manifest  -> live scan of the content root, returned as JSON.
 *                         Re-reads the disk on every request, so folders that
 *                         are created / renamed / deleted by hand appear with
 *                         no code change and no rebuild.
 *   GET /data/<path>   -> streams the actual file from the content root
 *                         (path-traversal protected).
 *   GET /api/events    -> Server-Sent Events stream. An fs.watch on the content
 *                         root pushes a `change` event (debounced) so connected
 *                         browsers refresh in real time. The frontend also polls
 *                         on an interval as a fallback where recursive watching
 *                         isn't available.
 *
 * Configure the scanned directory with the CONTENT_ROOT env var; it defaults to
 * the Vite project root (the repo).
 */
import fs from "node:fs";
import path from "node:path";
import { scanContent, DENYLIST } from "./scripts/scan-content.mjs";

const MIME = {
  pdf: "application/pdf",
  csv: "text/csv; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  json: "application/json; charset=utf-8",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
  mp4: "video/mp4",
};

function mimeFor(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  return MIME[ext] ?? "application/octet-stream";
}

function sendJson(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(json);
}

/** Resolve a request path under contentRoot, rejecting traversal escapes. */
function safeJoin(contentRoot, urlPath) {
  let rel;
  try {
    rel = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  rel = rel.replace(/^\/+/, "").split("/").join(path.sep);
  const abs = path.resolve(contentRoot, rel);
  const root = path.resolve(contentRoot);
  if (abs !== root && !abs.startsWith(root + path.sep)) return null; // escaped
  return abs;
}

/** True when a watch event path lives outside the content folders we expose. */
function isIgnoredChange(relPath) {
  const top = relPath.split(/[\\/]/)[0];
  return !top || top.startsWith(".") || DENYLIST.has(top);
}

/**
 * Wire the API routes and the file watcher onto a Vite/preview server.
 * @param {import('vite').ViteDevServer | import('vite').PreviewServer} server
 * @param {string} contentRoot
 */
function attach(server, contentRoot) {
  /** @type {Set<import('node:http').ServerResponse>} */
  const clients = new Set();

  // --- GET /api/manifest : live filesystem scan -----------------------------
  server.middlewares.use("/api/manifest", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    try {
      sendJson(res, 200, scanContent(contentRoot));
    } catch (err) {
      sendJson(res, 500, { error: String(err?.message ?? err) });
    }
  });

  // --- GET /api/events : SSE stream of change notifications -----------------
  server.middlewares.use("/api/events", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });
    res.write("retry: 3000\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
  });

  // --- GET /data/<path> : stream the real file ------------------------------
  server.middlewares.use("/data", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const abs = safeJoin(contentRoot, req.url ?? "");
    if (!abs) {
      res.statusCode = 400;
      return res.end("Bad path");
    }
    fs.stat(abs, (err, stat) => {
      if (err || !stat.isFile()) {
        res.statusCode = 404;
        return res.end("Not found");
      }
      res.writeHead(200, {
        "Content-Type": mimeFor(abs),
        "Content-Length": stat.size,
        "Cache-Control": "no-cache",
        "Content-Disposition": `inline; filename="${encodeURIComponent(path.basename(abs))}"`,
      });
      if (req.method === "HEAD") return res.end();
      fs.createReadStream(abs).pipe(res);
    });
  });

  // --- File watcher : broadcast a debounced `change` to all SSE clients -----
  let debounce;
  const broadcast = () => {
    const payload = `event: change\ndata: ${new Date().toISOString()}\n\n`;
    for (const res of clients) res.write(payload);
  };
  let watcher;
  try {
    watcher = fs.watch(contentRoot, { recursive: true }, (_evt, filename) => {
      if (filename && isIgnoredChange(String(filename))) return;
      clearTimeout(debounce);
      debounce = setTimeout(broadcast, 200);
    });
  } catch {
    // Recursive watching unsupported on this platform — the client's periodic
    // poll covers it.
  }

  // Keep SSE connections alive through idle timeouts / proxies.
  const heartbeat = setInterval(() => {
    for (const res of clients) res.write(": ping\n\n");
  }, 25000);

  const dispose = () => {
    clearInterval(heartbeat);
    clearTimeout(debounce);
    watcher?.close();
    for (const res of clients) res.end();
    clients.clear();
  };
  server.httpServer?.on("close", dispose);
}

/** @returns {import('vite').Plugin} */
export function contentApi() {
  let contentRoot = process.cwd();
  return {
    name: "content-api",
    configResolved(config) {
      contentRoot = path.resolve(process.env.CONTENT_ROOT ?? config.root);
      config.logger.info(`[content-api] serving live content from ${contentRoot}`);
    },
    configureServer(server) {
      attach(server, contentRoot);
    },
    configurePreviewServer(server) {
      attach(server, contentRoot);
    },
  };
}
