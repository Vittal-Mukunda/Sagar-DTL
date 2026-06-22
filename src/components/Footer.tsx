import { Link } from "react-router-dom";
import { SECTIONS } from "../config/sections";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-foreground text-white border-t-4 border-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Logo variant="light" className="h-12 w-auto" />
              <span className="font-black uppercase tracking-tighter text-xl leading-none">
                IEM Dept.
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-white/70 leading-relaxed max-w-xs">
              Department of Industrial Engineering & Management, RV College of
              Engineering, Bengaluru. A student-built knowledge hub.
            </p>
          </div>

          <div>
            <p className="label-bauhaus text-bauhaus-yellow mb-4">Sections</p>
            <ul className="space-y-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/${s.id}`}
                    className="font-medium text-white/80 hover:text-white transition-colors"
                  >
                    {s.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-bauhaus text-bauhaus-yellow mb-4">Contribute</p>
            <p className="text-sm font-medium text-white/70 leading-relaxed">
              Add files to the GitHub repository and the site updates itself —
              no code changes required. See the README to learn how.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t-2 border-white/20">
          <p className="text-xs font-medium text-white/50">
            © {new Date().getFullYear()} IEM Department, RVCE. Built by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
