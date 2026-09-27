import { Link } from "react-router-dom";
import { ArrowUpRight, ImageOff } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";

export default function ProductCard({ product, index = 0 }) {
  const outOfStock = !product.stock || product.stock <= 0;
  const revealRef = useScrollReveal();

  return (
    <Link
      ref={revealRef}
      to={`/products/${product._id}`}
      className="group reveal flex flex-col"
      style={{ transitionDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal/[0.04]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-expensive group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">
            <ImageOff className="h-6 w-6" strokeWidth={1.25} />
          </div>
        )}

        {outOfStock && (
          <span className="absolute left-3 top-3 border border-charcoal/20 bg-ivory/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest2 text-charcoal/70 backdrop-blur-sm">
            Sold out
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center border border-charcoal/15 bg-ivory/90 text-charcoal opacity-0 backdrop-blur-sm transition-all duration-300 ease-expensive group-hover:translate-x-0 group-hover:opacity-100 md:translate-x-2">
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow mb-1.5 text-stone-400">{product.category}</p>
          <h3 className="truncate font-display text-lg text-charcoal">{product.name}</h3>
        </div>
        <span className="shrink-0 pt-0.5 text-[15px] text-charcoal/80">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </span>
      </div>
    </Link>
  );
}
