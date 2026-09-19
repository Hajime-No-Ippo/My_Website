# My Website

Eric Tao's personal website — portfolio, blog, and a few side projects, all in one repo.

Live at: **https://blog.ericdesign.uk/**

## What's in here

- **`Everything_About_Eric_Tao/`** — the main site. A Next.js app with the portfolio, blog posts, and project pages (includes the flip-book deck viewer).
- **`research-eric/`** — a smaller research/writing site, kept separate from the main app.
- **`ShowCase_Content/`** — standalone project demos and experiments shown off on the site (e.g. Arknights Resource Planner, iFoodie, RustLLM).

## Running the main site locally

```bash
cd Everything_About_Eric_Tao
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Notes

- Deployment is triggered automatically on push to `master`.
- `personal-cloud/` is a separate, standalone project and not part of this repo (see [my-cloud](https://github.com/Hajime-No-Ippo/my-cloud)).
