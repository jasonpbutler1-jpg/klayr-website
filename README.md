# Klayr Website

The public marketing and legal website for **Klayr**, built as a plain static
site (HTML + CSS + a tiny bit of JavaScript). No build step, no framework — it
can be uploaded to GitHub and served with GitHub Pages as-is.

---

## Project overview

A small, accessible, responsive static site with:

- A landing page (`index.html`)
- Placeholder pages ready for real content: Privacy Policy, Terms of Use, FAQ, Support
- A custom 404 page
- Shared styling, one small script for the mobile menu, favicon, and social-share (Open Graph) tags

The Privacy, Terms, FAQ, and Support pages are **styled placeholders** on
purpose. You can drop finished content into them later without touching the
design (see “How to replace placeholder content”).

---

## Folder structure

```
klayr-website/
├── index.html          # Home / landing page
├── privacy.html        # Privacy Policy (placeholder)
├── terms.html          # Terms of Use (placeholder)
├── faq.html            # FAQ (placeholder)
├── support.html        # Support (placeholder)
├── 404.html            # "Page not found" page
├── css/
│   └── styles.css      # All site styling (commented by section)
├── js/
│   └── main.js         # Mobile navigation toggle (only script)
├── assets/
│   ├── favicon.svg     # Site icon
│   └── og-image.svg    # Social-share preview image
├── .nojekyll           # Tells GitHub Pages to serve files as-is
└── README.md           # This file
```

---

## How to edit pages

1. Open any `.html` file in a text editor.
2. Content lives inside `<main> … </main>`. The header and footer are repeated
   in each page so they stay consistent — if you change a nav link, update it
   in every page (they’re short and clearly marked).
3. Styling is **not** written inline. To change appearance, edit
   `css/styles.css`. It is organized into numbered, commented sections
   (design tokens, header, buttons, hero, etc.). Brand colors are defined once
   at the top under `:root` so you can re-theme in one place.

---

## How to publish using GitHub Pages

1. Create a new repository on GitHub (for example, `klayr-website`).
2. Upload the **contents** of this folder to the repository root (so
   `index.html` sits at the top level of the repo, not inside a subfolder).
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then **Save**.
6. Wait about a minute. Your site will be live at
   `https://YOUR-USERNAME.github.io/klayr-website/`.

The included `.nojekyll` file ensures GitHub Pages serves the files exactly as
written (no Jekyll processing), and `404.html` is served automatically for
unknown URLs.

---

## How to connect a custom domain later

1. Buy a domain from any registrar.
2. In your repository, go to **Settings → Pages → Custom domain**, enter your
   domain (e.g. `klayr.app`), and **Save**. GitHub creates a `CNAME` file for you.
3. At your domain registrar, add DNS records pointing to GitHub Pages:
   - Four `A` records for the apex domain → `185.199.108.153`,
     `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` record for `www` → `YOUR-USERNAME.github.io`
4. Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate
   is issued (can take up to an hour).
5. Update the `og:url` values in each page’s `<head>` and the
   `REPLACE-WITH-YOUR-DOMAIN` placeholders to your real domain.

---

## How to update navigation

The navigation appears in two places on every page:

- The **header** (`<nav class="primary-nav">`)
- The **footer** (`<nav class="footer-nav">`)

To add, remove, or rename a link, edit the `<li><a href="…">…</a></li>` items
in those two blocks on **each** HTML page. The active page is marked with
`aria-current="page"` on its own link — move that attribute if you add pages.

---

## How to replace placeholder content

Each placeholder page (`privacy.html`, `terms.html`, `faq.html`,
`support.html`) contains a block like this inside `<main>`:

```html
<div class="page-content">
  <div class="placeholder"> … content coming soon … </div>
</div>
```

To add real content:

1. Delete the `<div class="placeholder"> … </div>` block.
2. Write your content **inside** the surrounding `<div class="page-content">`
   using normal tags: `<h2>`, `<p>`, `<ul>`, `<ol>`, `<a>`. These are already
   styled, so the page will look finished with no CSS changes.
3. On `support.html`, replace `REPLACE-WITH-SUPPORT-EMAIL` (in both the `href`
   and the visible text) with your real support email address.
4. On `privacy.html` and `terms.html`, replace the `[date]` placeholder with
   the effective date.

> Note: this repository intentionally ships **without** the actual Privacy
> Policy, Terms, FAQ answers, or Support documentation — only styled
> placeholders. Add that content when it’s ready.

---

## Accessibility & quality notes

- Semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`)
- Logical heading order (one `<h1>` per page)
- Skip-to-content link, visible focus styles, keyboard-operable menu
- Decorative images use empty `alt`; add descriptive `alt` for meaningful images
- Responsive layout and `prefers-reduced-motion` support
- No inline CSS or inline JavaScript
