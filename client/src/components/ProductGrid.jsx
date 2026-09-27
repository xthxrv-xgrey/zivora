import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}
