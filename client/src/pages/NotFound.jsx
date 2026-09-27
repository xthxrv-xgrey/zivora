import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-zivora flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-4 text-stone-400">Error 404</p>
      <h1 className="h-display text-6xl md:text-7xl">Not found.</h1>
      <p className="mt-4 max-w-xs text-sm text-stone-500">
        This page doesn't exist, or the piece has been removed.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="secondary">Back to collection</Button>
      </Link>
    </div>
  );
}
