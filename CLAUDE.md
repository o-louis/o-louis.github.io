# Portfolio — o-louis.github.io

Personal portfolio. Astro 6 (static) + Tailwind CSS 4, deployed to GitHub Pages on
every push to `main` (`.github/workflows/deploy.yml`).

## Commands

- `npm run dev` — dev server
- `npm run build` — production build. There are no tests; this is the verification step.

## Architecture

- Prose content lives in content collections (`src/content/<collection>/*.md`), declared
  with a Zod schema in `src/content.config.ts`. Publishing = adding a Markdown file,
  never a new `.astro` page.
- Each collection is routed by a pair: `src/pages/<name>/index.astro` (list) and
  `[...slug].astro` (`getStaticPaths` over the collection + `render(entry)`).
- The `posts` collection is served at `/posts` but labelled "Blog" in the nav and page
  titles. Keep the code on `posts` and the copy on "Blog".
- `src/layouts/Layout.astro` wraps every page (nav, footer, `<ClientRouter />`) and owns
  the `<head>`.

## Styling

- Colors are custom `@theme` tokens in `src/styles/global.css`, not the Tailwind palette:
  `text-fg`, `text-muted`, `text-subtle`, `text-accent`, `border-line`, `bg-bg`.
  Never `text-gray-500` and friends.
- Dark mode is `prefers-color-scheme` only — the tokens swap themselves. Never write a
  `dark:` variant.
- Markdown bodies use the shared `Prose` component, not a `prose prose-*` chain repeated
  per page.
- Icons: `astro-icon`, `carbon` and `ph` sets — `<Icon name="carbon:email" />`.

## Constraints

- Fully static: no SSR, no server endpoints, no runtime env vars. Everything resolves at
  build time.
- Node >= 22.12.
