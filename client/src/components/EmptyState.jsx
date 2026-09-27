import { PackageSearch } from "lucide-react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center border border-charcoal/10 px-6 py-28 text-center">
      <PackageSearch className="mb-5 h-8 w-8 text-stone-400" strokeWidth={1.25} />
      <h3 className="h-display text-2xl">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-500">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
