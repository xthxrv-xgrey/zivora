import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import { createProduct } from "../api/product.api";
import {
  validateProductCategory,
  validateProductDescription,
  validateProductImage,
  validateProductName,
  validateProductPrice,
  validateProductStock,
  extractApiErrorMessage,
} from "../utils/validators";
import { Field, TextAreaField } from "../components/ui/Input";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const validate = () => {
    const nextErrors = {
      name: validateProductName(form.name),
      description: validateProductDescription(form.description),
      price: validateProductPrice(form.price),
      category: validateProductCategory(form.category),
      stock: validateProductStock(form.stock),
      image: validateProductImage(imageFile),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("price", form.price);
    formData.append("category", form.category.trim());
    if (form.stock !== "") formData.append("stock", form.stock);
    formData.append("image", imageFile);

    setSubmitting(true);
    try {
      const product = await createProduct(formData);
      toast.success("Piece added to the catalogue.");
      navigate(`/products/${product._id}`);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to create product."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-zivora max-w-2xl py-14 md:py-20">
      <SectionHeading eyebrow="New Piece" title="Add to the catalogue" />

      <form onSubmit={handleSubmit} noValidate className="mt-12 space-y-9">
        <Field
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. Kobo Ceramic Vessel"
        />
        <TextAreaField
          label="Description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="What makes this piece worth keeping?"
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
            label="Stock — optional"
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
          placeholder="e.g. Homeware"
        />

        <div>
          <span className="mb-2 block text-[11px] font-medium uppercase tracking-widest2 text-stone-500">
            Image — JPEG, PNG or WebP, max 5 MB
          </span>

          <label
            className={`focus-ring flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors duration-200 ${
              errors.image ? "border-clay" : "border-charcoal/20 hover:border-charcoal"
            }`}
          >
            <UploadCloud className="h-5 w-5 shrink-0 text-stone-500" strokeWidth={1.5} />
            <span className="truncate text-sm text-stone-500">
              {imageFile ? imageFile.name : "Choose an image"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>
          {errors.image && (
            <span className="mt-1.5 block text-xs text-clay-700">{errors.image}</span>
          )}

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 aspect-square w-36 object-cover"
            />
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? "Adding" : "Add piece"}
        </Button>
      </form>
    </div>
  );
}
