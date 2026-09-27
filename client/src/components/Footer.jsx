import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-charcoal/10 bg-ivory">
      <div className="container-zivora grid grid-cols-1 gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-medium tracking-tightest text-charcoal">
            ZIVORA
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-500">
            Considered objects, well made. A small, deliberate catalogue —
            nothing added just to fill the shelf.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Browse</p>
          <ul className="space-y-3 text-sm text-charcoal/70">
            <li>
              <Link to="/" className="link-underline hover:text-charcoal">
                Full collection
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/products/new" className="link-underline hover:text-charcoal">
                  Add a piece
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Account</p>
          <ul className="space-y-3 text-sm text-charcoal/70">
            {isAuthenticated ? (
              <li className="text-stone-500">You're signed in.</li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="link-underline hover:text-charcoal">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="link-underline hover:text-charcoal">
                    Create an account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="container-zivora flex flex-col items-center justify-between gap-4 border-t border-charcoal/10 py-6 text-[11px] uppercase tracking-widest2 text-stone-400 sm:flex-row">
        <span>© {new Date().getFullYear()} Zivora</span>
        <span>Made with intention</span>
      </div>
    </footer>
  );
}
