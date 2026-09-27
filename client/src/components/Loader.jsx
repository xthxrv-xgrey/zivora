export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="h-px w-10 animate-pulse bg-charcoal/30" />
      <p className="eyebrow text-stone-400">{label}</p>
    </div>
  );
}
