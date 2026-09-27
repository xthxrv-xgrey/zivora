const TONES = {
  neutral: "border-charcoal/15 text-charcoal/70",
  positive: "border-charcoal/15 text-charcoal/70",
  warning: "border-clay/40 text-clay-700",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest2 ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
