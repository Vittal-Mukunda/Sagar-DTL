import type { ReactNode } from "react";
import { Shape, shapeByIndex, accentByIndex } from "./Shapes";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Index drives the cycling corner-decoration shape + color. */
  decorIndex?: number;
  /** Subtle lift on hover (for clickable cards). */
  interactive?: boolean;
  onClick?: () => void;
}

/**
 * Bauhaus card — thick border, hard offset shadow, and a small geometric
 * decoration in the top-right corner that cycles shape + color by index.
 */
export function Card({
  children,
  className = "",
  decorIndex = 0,
  interactive = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white border-2 md:border-4 border-foreground shadow-hard md:shadow-hard-lg ${
        interactive
          ? "press hover:-translate-y-1 cursor-pointer"
          : "transition-transform duration-200"
      } ${className}`}
    >
      <Shape
        kind={shapeByIndex(decorIndex)}
        accent={accentByIndex(decorIndex)}
        size="h-3 w-3"
        className="absolute right-3 top-3 border border-foreground"
      />
      {children}
    </div>
  );
}
