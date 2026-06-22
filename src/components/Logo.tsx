import { useState } from "react";

interface LogoProps {
  /** "light" inverts the black line-art logo to white (for dark backgrounds). */
  variant?: "dark" | "light";
  className?: string;
}

/**
 * The official RV College of Engineering logo.
 * Place the image at `public/rvce-logo.png` — until it exists, a clean text
 * mark is shown as a fallback so the site never breaks.
 */
export function Logo({ variant = "dark", className = "h-10 w-auto" }: LogoProps) {
  const [failed, setFailed] = useState(false);
  const src = `${import.meta.env.BASE_URL}rvce-logo.png`;

  if (failed) {
    return (
      <span
        className={`font-black uppercase tracking-tighter text-xl leading-none ${
          variant === "light" ? "text-white" : "text-foreground"
        }`}
      >
        RVCE
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="RV College of Engineering"
      onError={() => setFailed(true)}
      className={`${className} ${variant === "light" ? "invert" : ""} object-contain`}
    />
  );
}
