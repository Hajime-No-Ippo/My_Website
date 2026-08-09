---
title: What markdown this blog supports
date: '2026-08-08'
summary: A reference page for the formatting available in posts.
---

A reference for what renders, kept as a real post so the styling stays honest.
Delete it once you no longer need it.

## Text

Regular paragraphs, **bold**, *italic*, `inline code`, and
[links](https://vite.dev). Long lines wrap on narrow screens rather than
pushing the page sideways.

> Blockquotes are for the sentence worth pulling out of a paragraph.
> They can run to several lines.

## Lists

Unordered:

- First item
- Second item
  - Nested item
- Third item

Ordered:

1. Do the thing
2. Check the thing
3. Ship the thing

## Code

Fenced blocks are highlighted at build time, so the browser never downloads a
syntax highlighter:

```ts
type Post = {
  slug: string
  title: string
  date: string
}

export function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date))
}
```

Another language, to check the theme holds up:

```python
def reading_time(words: int, wpm: int = 220) -> int:
    """Round up to the nearest minute."""
    return max(1, -(-words // wpm))
```

Blocks that run wide scroll inside their own box:

```bash
pnpm build && npx serve dist --single --listen 4173
```

## Tables

| Field     | Required | Notes                          |
| --------- | -------- | ------------------------------ |
| `title`   | yes      | Shown on the index and the tab |
| `date`    | yes      | `YYYY-MM-DD`, used for sorting |
| `summary` | no       | One line under the title       |

---

That is everything currently styled. Anything standard that markdown supports
will still render — it just may not have bespoke styling yet.
