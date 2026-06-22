import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Shape, accentByIndex } from "../components/Shapes";

export function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <div className="flex justify-center gap-4 mb-8" aria-hidden>
        <Shape kind="circle" accent={accentByIndex(0)} size="h-12 w-12" className="border-4 border-foreground" />
        <Shape kind="square" accent={accentByIndex(1)} size="h-12 w-12" className="border-4 border-foreground" />
        <Shape kind="triangle" accent={accentByIndex(2)} size="h-12 w-12" />
      </div>
      <h1 className="text-6xl sm:text-8xl">404</h1>
      <p className="mt-4 text-lg font-medium opacity-70">
        This page doesn’t exist in the composition.
      </p>
      <Link to="/" className="inline-block mt-8">
        <Button variant="blue">Back home</Button>
      </Link>
    </div>
  );
}
