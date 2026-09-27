export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse bg-charcoal/[0.06] ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonBlock className="aspect-[4/5] w-full" />
      <div className="space-y-2">
        <SkeletonBlock className="h-2.5 w-16" />
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
      <SkeletonBlock className="aspect-[4/5] w-full" />
      <div className="space-y-5 pt-4">
        <SkeletonBlock className="h-2.5 w-24" />
        <SkeletonBlock className="h-10 w-3/4" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-8 w-32" />
      </div>
    </div>
  );
}
