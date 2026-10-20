# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

---

## Blog Post Workflow

**Live site:** `blog.ericdesign.uk`
**Repo:** `https://github.com/Hajime-No-Ippo/My_Website.git` (Cloudflare Pages auto-deploys on push)

### Adding a new post

1. Create a markdown file in `src/posts/` with a kebab-case filename:
   ```
   src/posts/my-new-post.md
   ```

2. Add frontmatter (`title`, `date`, `summary` are required):
   ```markdown
   ---
   title: "My Post Title"
   date: "2026-09-27"
   summary: "A short description of the post."
   ---

   Your content here...
   ```

3. Commit and push — Cloudflare Pages auto-deploys:
   ```bash
   git add src/posts/my-new-post.md
   git commit -m "Add blog post: My Post Title"
   git push
   ```

Posts are auto-discovered by filename via `import.meta.glob('./posts/*.md')` in `src/posts.ts`. Newest posts appear first. The URL slug is derived from the filename (e.g., `my-new-post.md` → `/blog/my-new-post`).
