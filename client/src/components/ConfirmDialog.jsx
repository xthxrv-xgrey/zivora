import { X } from "lucide-react";
import Button from "./ui/Button";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm border border-charcoal/10 bg-ivory p-8 shadow-[0_30px_80px_-20px_rgba(21,19,17,0.35)]">
        <button
          type="button"
          onClick={onCancel}
          className="focus-ring absolute right-5 top-5 text-stone-400 transition-colors hover:text-charcoal"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <h3 className="h-display pr-6 text-2xl">{title}</h3>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-stone-500">{description}</p>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
