import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out.");
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-charcoal/10 bg-ivory/85 backdrop-blur-md"
          : "border-b border-transparent bg-ivory"
      }`}
    >
      <nav className="container-zivora flex h-20 items-center justify-between">
        <Link
          to="/"
          className="font-display text-xl font-medium tracking-tightest text-charcoal"
        >
          ZIVORA
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <Link
            to="/"
            className="link-underline text-xs font-medium uppercase tracking-widest2 text-charcoal/70 transition-colors hover:text-charcoal"
          >
            Collection
          </Link>
          {isAuthenticated && (
            <Link
              to="/products/new"
              className="link-underline text-xs font-medium uppercase tracking-widest2 text-charcoal/70 transition-colors hover:text-charcoal"
            >
              New Piece
            </Link>
          )}
        </div>

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <Link
                to="/products/new"
                className="focus-ring text-charcoal/70 transition-colors hover:text-charcoal md:hidden"
                aria-label="Create product"
              >
                <Plus className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>
              <span className="hidden items-center gap-2 text-xs text-stone-500 sm:flex">
                <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="focus-ring border border-charcoal/20 px-4 py-2 text-[11px] font-medium uppercase tracking-widest2 text-charcoal transition-colors duration-300 hover:border-charcoal hover:bg-charcoal hover:text-ivory"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="link-underline text-xs font-medium uppercase tracking-widest2 text-charcoal/70 transition-colors hover:text-charcoal"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="focus-ring border border-charcoal/20 px-4 py-2 text-[11px] font-medium uppercase tracking-widest2 text-charcoal transition-colors duration-300 hover:border-charcoal hover:bg-charcoal hover:text-ivory"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
