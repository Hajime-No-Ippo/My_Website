---
title: Hello, world
date: '2026-08-09'
summary: Why this blog exists and what I plan to put here.
---

This is a starter post — replace it with your own writing.

I wanted somewhere to keep notes that are longer than a commit message and
shorter than a paper. Most of what I learn while building something never makes
it anywhere durable, and a month later I have to work it out again from scratch.

## What goes here

Roughly three kinds of things:

- **Build notes.** What I was trying to do, what broke, and what actually fixed it.
- **Reading notes.** Papers and posts worth remembering, in my own words.
- **Half-formed ideas.** Things I have not finished thinking about yet.

## How to add a post

Drop a markdown file into `src/posts/`. The filename becomes the URL, so
`src/posts/my-post.md` is served at `/blog/my-post`. Every file needs three
fields of frontmatter:

```yaml
---
title: My post
date: '2026-08-09'
summary: One sentence that shows up on the index page.
---
```

Posts are sorted by `date`, newest first. Nothing else is wired to the
filesystem, so renaming a file is enough to change its URL.
