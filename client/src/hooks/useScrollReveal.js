import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref and adds the
 * `is-visible` class (see the `.reveal` utility in index.css) the first
 * time the element scrolls into view. Kept deliberately tiny — this is a
 * one-shot reveal, not an animation library.
 */
export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
