import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { getProducts } from "../api/product.api";
import { extractApiErrorMessage } from "../utils/validators";
import ProductGrid from "../components/ProductGrid";
import EmptyState from "../components/EmptyState";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import { useAuth } from "../context/AuthContext";

export default function ProductList() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(extractApiErrorMessage(err, "Failed to load products."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="container-zivora flex min-h-[86vh] flex-col justify-center border-b border-charcoal/10 pb-20 pt-16">
        <p className="eyebrow mb-8 text-stone-500">Zivora — Autumn Catalogue</p>

        <h1 className="h-display max-w-5xl text-[13vw] sm:text-7xl md:text-8xl">
          Objects worth
          <br />
          <span className="italic text-clay">keeping.</span>
        </h1>

        <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <p className="max-w-md text-[15px] leading-relaxed text-stone-500">
            A small, deliberate catalogue of things designed to last — chosen
            for how they're made, not how fast they sell out.
          </p>

          <a
            href="#collection"
            className="focus-ring group flex items-center gap-3 border-b border-charcoal/30 pb-1 text-xs font-medium uppercase tracking-widest2 text-charcoal transition-colors hover:border-charcoal"
          >
            View the collection
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 ease-expensive group-hover:translate-y-1" />
          </a>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="container-zivora py-20 md:py-28">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={`${products.length || ""} ${products.length === 1 ? "piece" : "pieces"}`.trim()}
            title="The full collection"
          />
          {isAuthenticated && (
            <Link to="/products/new">
              <Button variant="secondary" size="sm">
                Add a piece
              </Button>
            </Link>
          )}
        </div>

        {loading && <ProductGridSkeleton />}

        {!loading && error && (
          <div className="border border-clay/30 bg-clay-50 px-6 py-10 text-center">
            <p className="text-sm text-clay-700">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <EmptyState
            title="Nothing here yet"
            description="Once pieces are added to the catalogue, they'll appear here."
            action={
              isAuthenticated && (
                <Link to="/products/new">
                  <Button size="sm">Create the first piece</Button>
                </Link>
              )
            }
          />
        )}

        {!loading && !error && products.length > 0 && <ProductGrid products={products} />}
      </section>
    </div>
  );
}
