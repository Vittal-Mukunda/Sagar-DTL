import type { LucideIcon } from "lucide-react";
import { ACCENT, type Accent } from "../config/theme";

interface SectionHeaderProps {
  title: string;
  description?: string;
  accent: Accent;
  icon?: LucideIcon;
  /** Small uppercase eyebrow label above the title. */
  eyebrow?: string;
}

/**
 * Color-blocked page banner with a bordered icon box — the recurring section
 * intro used across all content pages.
 */
export function SectionHeader({
  title,
  description,
  accent,
  icon: Icon,
  eyebrow,
}: SectionHeaderProps) {
  const a = ACCENT[accent];
  return (
    <header
      className={`relative overflow-hidden ${a.bg} ${a.on} border-b-4 border-foreground`}
    >
      <div className="stripe-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="flex items-start gap-4 sm:gap-6">
          {Icon && (
            <span className="hidden sm:flex shrink-0 h-16 w-16 items-center justify-center bg-white text-foreground border-4 border-foreground shadow-hard">
              <Icon className="h-8 w-8" strokeWidth={2.5} />
            </span>
          )}
          <div>
            {eyebrow && (
              <p className="label-bauhaus mb-2 opacity-80">{eyebrow}</p>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl">{title}</h1>
            {description && (
              <p className="mt-4 max-w-2xl text-base sm:text-lg font-medium leading-relaxed opacity-90">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
