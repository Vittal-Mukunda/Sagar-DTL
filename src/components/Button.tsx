import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "red" | "blue" | "yellow" | "outline" | "ghost";
type Shape = "square" | "pill";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  shape?: Shape;
}

const VARIANTS: Record<Variant, string> = {
  red: "bg-bauhaus-red text-white border-2 border-foreground shadow-hard hover:bg-bauhaus-red/90",
  blue: "bg-bauhaus-blue text-white border-2 border-foreground shadow-hard hover:bg-bauhaus-blue/90",
  yellow:
    "bg-bauhaus-yellow text-foreground border-2 border-foreground shadow-hard hover:bg-bauhaus-yellow/90",
  outline:
    "bg-white text-foreground border-2 border-foreground shadow-hard hover:bg-muted",
  ghost: "bg-transparent text-foreground border-2 border-transparent hover:bg-muted",
};

/** Bauhaus button — uppercase, hard shadow, physical press on click. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "red", shape = "square", className = "", ...props }, ref) => {
    const radius = shape === "pill" ? "rounded-full" : "rounded-none";
    return (
      <button
        ref={ref}
        className={`press inline-flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-wider ${radius} ${VARIANTS[variant]} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground disabled:opacity-50 disabled:pointer-events-none ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
