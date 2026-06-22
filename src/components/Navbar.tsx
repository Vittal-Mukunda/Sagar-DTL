import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { SECTIONS } from "../config/sections";
import { Logo } from "./Logo";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 font-bold uppercase tracking-wide text-sm transition-colors duration-200 ${
      isActive ? "text-bauhaus-red" : "text-foreground hover:text-bauhaus-blue"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-background border-b-4 border-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Logo className="h-9 sm:h-11 w-auto" />
            <span className="hidden sm:block h-8 w-0.5 bg-foreground" aria-hidden />
            <span className="hidden sm:block font-black uppercase tracking-tighter text-base leading-none">
              IEM
              <br />
              Dept.
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {SECTIONS.map((s) => (
              <NavLink key={s.id} to={`/${s.id}`} className={linkClass}>
                {s.nav}
              </NavLink>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden press border-2 border-foreground bg-white p-2 shadow-hard-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t-2 border-foreground bg-background">
          <div className="flex flex-col px-4 py-2">
            {SECTIONS.map((s) => (
              <NavLink
                key={s.id}
                to={`/${s.id}`}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {s.nav}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
