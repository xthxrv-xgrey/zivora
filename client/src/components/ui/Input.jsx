import { forwardRef } from "react";

export const Field = forwardRef(function Field(
  { label, error, hint, className = "", ...props },
  ref
) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-widest2 text-stone-500">
          {label}
        </span>
      )}
      <input
        ref={ref}
        className={`focus-ring w-full border-b bg-transparent pb-2.5 text-[15px] text-charcoal placeholder:text-stone-400 transition-colors duration-200 ${
          error ? "border-clay" : "border-charcoal/20 focus:border-charcoal"
        }`}
        {...props}
      />
      {error ? (
        <span className="mt-1.5 block text-xs text-clay-700">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-stone-500">{hint}</span>
      ) : null}
    </label>
  );
});

export const TextAreaField = forwardRef(function TextAreaField(
  { label, error, hint, className = "", ...props },
  ref
) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-widest2 text-stone-500">
          {label}
        </span>
      )}
      <textarea
        ref={ref}
        className={`focus-ring w-full resize-none border-b bg-transparent pb-2.5 text-[15px] leading-relaxed text-charcoal placeholder:text-stone-400 transition-colors duration-200 ${
          error ? "border-clay" : "border-charcoal/20 focus:border-charcoal"
        }`}
        {...props}
      />
      {error ? (
        <span className="mt-1.5 block text-xs text-clay-700">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-stone-500">{hint}</span>
      ) : null}
    </label>
  );
});
