/**
 * Accent helpers. Tailwind purges classes it can't see as literal strings, so we
 * map each accent to FULL literal class strings here rather than building them
 * dynamically (e.g. never `bg-bauhaus-${accent}`).
 */
export type Accent = "red" | "blue" | "yellow";

interface AccentClasses {
  /** Solid color-block background (for section banners). */
  bg: string;
  /** Text color matching the accent. */
  text: string;
  /** Readable foreground color to place ON the accent background. */
  on: string;
  /** Small solid swatch (badges / decorations). */
  swatch: string;
}

export const ACCENT: Record<Accent, AccentClasses> = {
  red: {
    bg: "bg-bauhaus-red",
    text: "text-bauhaus-red",
    on: "text-white",
    swatch: "bg-bauhaus-red",
  },
  blue: {
    bg: "bg-bauhaus-blue",
    text: "text-bauhaus-blue",
    on: "text-white",
    swatch: "bg-bauhaus-blue",
  },
  yellow: {
    bg: "bg-bauhaus-yellow",
    text: "text-[#9a7400]",
    on: "text-foreground",
    swatch: "bg-bauhaus-yellow",
  },
};

/** Cycle accents for repeating decorations. */
export const ACCENT_CYCLE: Accent[] = ["red", "blue", "yellow"];
