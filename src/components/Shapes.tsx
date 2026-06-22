import { ACCENT, ACCENT_CYCLE, type Accent } from "../config/theme";

type ShapeKind = "circle" | "square" | "triangle";

interface ShapeProps {
  kind: ShapeKind;
  accent: Accent;
  /** Tailwind size classes, e.g. "h-4 w-4". */
  size?: string;
  className?: string;
}

/** A single Bauhaus primitive shape (circle / square / triangle). */
export function Shape({ kind, accent, size = "h-4 w-4", className = "" }: ShapeProps) {
  const color = ACCENT[accent].swatch;
  if (kind === "circle")
    return <span className={`${size} ${color} rounded-full block ${className}`} />;
  if (kind === "triangle")
    return <span className={`${size} ${color} clip-triangle block ${className}`} />;
  return <span className={`${size} ${color} rounded-none block ${className}`} />;
}

/** Pick a shape kind by index so repeating decorations cycle predictably. */
export function shapeByIndex(i: number): ShapeKind {
  return (["circle", "square", "triangle"] as const)[i % 3];
}

export function accentByIndex(i: number): Accent {
  return ACCENT_CYCLE[i % ACCENT_CYCLE.length];
}

/**
 * The brand mark: three overlapping primitives in the three primaries.
 * Used in the navbar and footer.
 */
export function GeometricLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-hidden>
      <span className="h-6 w-6 rounded-full bg-bauhaus-red border-2 border-foreground" />
      <span className="h-6 w-6 rounded-none bg-bauhaus-blue border-2 border-foreground -ml-2" />
      <span className="h-6 w-6 bg-bauhaus-yellow border-2 border-foreground clip-triangle -ml-2" />
    </span>
  );
}

/**
 * Large decorative composition for color-blocked panels (hero, CTA).
 * Purely decorative; absolutely positioned by the parent.
 */
export function ShapeComposition({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <span className="absolute left-0 top-0 h-40 w-40 rounded-full border-4 border-foreground bg-bauhaus-yellow" />
      <span className="absolute right-4 top-10 h-28 w-28 rotate-45 border-4 border-foreground bg-white" />
      <span className="absolute bottom-0 left-1/3 h-32 w-32 border-4 border-foreground bg-bauhaus-red clip-triangle" />
    </div>
  );
}
