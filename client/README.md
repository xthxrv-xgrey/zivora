# Zivora

A premium, editorial frontend for the Product Management API — rebranded
and redesigned from the ground up while keeping all existing functionality
and API integration intact.

## Stack

- React 18 + Vite
- React Router v6
- Axios (cookie-based refresh-token flow — unchanged from the original build)
- Tailwind CSS, driven by a small set of Zivora design tokens
- `react-hot-toast` for notifications
- `lucide-react` for a single, consistent icon system (added for this
  redesign — previously the project had no icon library, and mixing ad-hoc
  SVGs or emoji would have undercut the "considered" visual language)

## Setup

```bash
npm install
cp .env.example .env
# point VITE_API_URL at your backend, e.g. http://localhost:5000/api
npm run dev
```

## What changed in this pass

This was a **visual and interaction redesign only** — no backend calls,
routes, auth flow, or validation rules were altered.

- **Brand**: renamed to Zivora throughout (wordmark, page title, copy).
- **Design tokens** (`tailwind.config.js`, `src/index.css`): an ivory /
  charcoal / stone palette with a single clay accent, plus a Fraunces
  (display) + Inter (body) type pairing, tracked-out eyebrow labels, and a
  shared spacing/easing system (`--ease-expensive`).
- **New primitives** in `src/components/ui/`: `Button`, `Field` /
  `TextAreaField`, `Badge`, `SectionHeading`, and skeleton loaders — used
  across every page so styling stays consistent and easy to change in one
  place.
- **Home page**: a full-height editorial hero replaces the old "Products"
  header bar, followed by the existing product data rendered through the
  new `ProductGrid` / `ProductCard`.
- **Product cards**: large image-led cards with a hover reveal, replacing
  the old stacked image → title → description → button layout.
- **Product detail**: a two-column editorial layout with the image and
  copy given equal weight.
- **Auth pages**: a split-panel layout (dark brand panel + form), replacing
  the plain centered card.
- **Loading / empty / error states**: skeleton loaders and a quiet empty
  state replace the spinner and default browser styling.
- **Footer**: a new component reflecting Zivora's actual navigation
  (collection, add-a-piece when signed in, account links) — no invented
  pages or links.
- **Motion**: a small `useScrollReveal` hook (plain `IntersectionObserver`,
  no new animation dependency) fades product cards in on scroll; everything
  else is CSS transitions on hover/focus.

There is no cart or checkout in the original project, so none was added —
per the brief, this pass focused entirely on redesigning what already
exists.

## Project structure

```
src/
├── api/           # Axios instance + auth/product API calls (unchanged)
├── context/       # AuthContext (unchanged)
├── components/
│   ├── ui/        # Button, Input fields, Badge, SectionHeading, Skeleton
│   ├── Navbar.jsx, Footer.jsx, ProductCard.jsx, ProductGrid.jsx, ...
├── hooks/         # useScrollReveal
├── pages/         # Route-level pages
└── utils/         # Client-side validation (unchanged)
```

## Notes

- Creating a product still uploads `multipart/form-data` with the image
  under the field name `image` (JPEG/PNG/WebP, max 5 MB).
- Editing a product still has no image field, since the backend only
  accepts image uploads on creation.
- Deleting a product still shows a confirmation dialog first.
