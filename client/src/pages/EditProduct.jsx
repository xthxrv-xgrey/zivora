import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProduct, updateProduct } from "../api/product.api";
import {
  validateProductCategory,
  validateProductDescription,
  validateProductName,
  validateProductPrice,
  validateProductStock,
  extractApiErrorMessage,
} from "../utils/validators";
import { Field, TextAreaField } from "../components/ui/Input";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import Loader from "../components/Loader";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProduct(id)
      .then((product) => {
        if (cancelled) return;
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          category: product.category,
          stock: String(product.stock ?? 0),
        });
      })
      .catch((err) => {
        if (!cancelled) setLoadError(extractApiErrorMessage(err, "Product not found."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const nextErrors = {
      name: validateProductName(form.name),
      description: validateProductDescription(form.description),
      price: validateProductPrice(form.price),
      category: validateProductCategory(form.category),
      stock: validateProductStock(form.stock),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: form.stock === "" ? undefined : Number(form.stock),
      };
      const updated = await updateProduct(id, payload);
      toast.success("Changes saved.");
      navigate(`/products/${updated._id}`);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to update product."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading" />;

  if (loadError) {
    return (
      <div className="container-zivora max-w-2xl py-20">
        <div className="border border-clay/30 bg-clay-50 px-6 py-10 text-center">
          <p className="text-sm text-clay-700">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-zivora max-w-2xl py-14 md:py-20">
      <SectionHeading
        eyebrow="Editing"
        title="Refine this piece"
        description="The image can't be changed here — only new pieces can set an image."
      />

      <form onSubmit={handleSubmit} noValidate className="mt-12 space-y-9">
        <Field
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <TextAreaField
          label="Description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-8">
          <Field
            label="Price (₹)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
          />
          <Field
            label="Stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            error={errors.stock}
          />
        </div>

        <Field
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          error={errors.category}
        />

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? "Saving" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
