import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32 text-center">
      <p className="text-7xl font-bold text-(--color-border)">404</p>
      <p className="text-(--color-muted) mt-2 mb-6 text-sm">Page not found.</p>
      <Link to="/" className="text-sm text-(--color-accent) hover:underline">Back to Dashboard</Link>
    </div>
  );
}
