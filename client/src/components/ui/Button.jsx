import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-charcoal text-ivory hover:bg-charcoal-700 disabled:bg-charcoal/50",
  secondary:
    "border border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal/5 disabled:opacity-50",
  ghost: "text-charcoal hover:bg-charcoal/5 disabled:opacity-50",
  danger: "bg-clay text-ivory hover:bg-clay-700 disabled:bg-clay/50",
};

const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      className = "",
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium uppercase tracking-[0.08em] transition-colors duration-300 ease-expensive disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
