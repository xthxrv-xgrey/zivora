export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="h-display text-4xl md:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-stone-500">{description}</p>
      )}
    </div>
  );
}
