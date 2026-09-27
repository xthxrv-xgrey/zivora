import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, ImageOff, Pencil, Trash2 } from "lucide-react";
import { deleteProduct, getProduct } from "../api/product.api";
import { extractApiErrorMessage } from "../utils/validators";
import { ProductDetailSkeleton } from "../components/ui/Skeleton";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProduct(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) setError(extractApiErrorMessage(err, "Product not found."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      toast.success("Piece removed from the catalogue.");
      navigate("/");
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Failed to delete product."));
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="container-zivora py-14">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-zivora py-20">
        <div className="mx-auto max-w-md border border-clay/30 bg-clay-50 px-6 py-10 text-center">
          <p className="text-sm text-clay-700">{error}</p>
          <Link to="/" className="mt-6 inline-block">
            <Button variant="secondary" size="sm">
              Back to collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const outOfStock = !product.stock || product.stock <= 0;

  return (
    <div className="container-zivora py-10 md:py-14">
      <Link
        to="/"
        className="focus-ring inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest2 text-charcoal/60 transition-colors hover:text-charcoal"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Collection
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="aspect-[4/5] w-full overflow-hidden bg-charcoal/[0.04]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-400">
              <ImageOff className="h-8 w-8" strokeWidth={1.25} />
            </div>
          )}
        </div>

        <div className="flex flex-col pt-2 lg:pt-6">
          <p className="eyebrow mb-4 text-stone-500">{product.category}</p>
          <h1 className="h-display text-4xl md:text-5xl">{product.name}</h1>

          <p className="mt-6 text-[15px] leading-loose text-stone-500">
            {product.description}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <span className="font-display text-3xl text-charcoal">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <Badge tone={outOfStock ? "warning" : "neutral"}>
              {outOfStock ? "Sold out" : `${product.stock} in stock`}
            </Badge>
          </div>

          {isAuthenticated && (
            <div className="mt-12 flex gap-3 border-t border-charcoal/10 pt-8">
              <Link to={`/products/${product._id}/edit`}>
                <Button variant="secondary" size="md">
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Edit
                </Button>
              </Link>
              <Button variant="danger" size="md" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove this piece?"
        description={`"${product.name}" will be permanently removed from the catalogue. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
