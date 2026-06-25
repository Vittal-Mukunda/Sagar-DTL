import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SECTIONS } from "../config/sections";
import { ACCENT } from "../config/theme";
import { useManifest } from "../lib/ManifestContext";
import { findRoot, collectFiles } from "../lib/manifest";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export function Home() {
  const { manifest } = useManifest();

  const fileCount = (folder: string) => {
    const root = manifest ? findRoot(manifest, folder) : undefined;
    return root ? collectFiles(root).length : 0;
  };

  return (
    <div>
      {/* HERO */}
      <section className="border-b-4 border-foreground">
        <div className="dot-grid px-4 sm:px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center">
          <p className="label-bauhaus text-bauhaus-red mb-4">
            RV College of Engineering
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl">
            Industrial
            <br />
            Engineering <span className="text-bauhaus-blue">&</span>
            <br />
            Management
          </h1>
          <p className="mt-6 max-w-md text-lg font-medium leading-relaxed">
            One home for everything in the department — study material, question
            papers, placements, projects, and the people behind them.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/study">
              <Button variant="red">
                Study Material <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/placements">
              <Button variant="outline">Placements</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">Explore the department</h2>
          <p className="label-bauhaus opacity-60">{SECTIONS.length} sections</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s, i) => {
            const a = ACCENT[s.accent];
            const count = fileCount(s.folder);
            return (
              <Link key={s.id} to={`/${s.id}`} className="group block h-full">
                <Card decorIndex={i} interactive className="h-full p-0 overflow-hidden">
                  <div className={`${a.bg} ${a.on} px-6 py-5 border-b-2 md:border-b-4 border-foreground flex items-center justify-between`}>
                    <s.icon className="h-9 w-9" strokeWidth={2.5} />
                    <span className="label-bauhaus">{count} files</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl leading-tight">{s.title}</h3>
                    <p className="mt-3 font-medium opacity-70 leading-relaxed">
                      {s.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 font-bold uppercase tracking-wide text-sm group-hover:gap-3 transition-all">
                      Open <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* Contribute card */}
          <Card decorIndex={SECTIONS.length} className="h-full p-6 bg-foreground text-white">
            <h3 className="text-2xl leading-tight text-white">Add your own files</h3>
            <p className="mt-3 font-medium text-white/70 leading-relaxed">
              Push notes, papers or data to the GitHub repository and this site
              rebuilds itself. New folders become new sections — no coding needed.
            </p>
          </Card>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-bauhaus-yellow border-y-4 border-foreground">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x-2 lg:divide-x-4 divide-foreground border-x-0">
          {SECTIONS.slice(0, 4).map((s, i) => (
            <div
              key={s.id}
              className={`px-4 py-8 text-center ${i >= 2 ? "border-t-2 lg:border-t-0 border-foreground" : ""}`}
            >
              <p className="text-4xl sm:text-5xl font-black">{fileCount(s.folder)}</p>
              <p className="label-bauhaus mt-2">{s.nav}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
