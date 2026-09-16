# Product advertising portfolio

A dark, cinematic single-page portfolio for a creative advertising creator
working across food, pet, home, household and consumer products.

Plain HTML, CSS and JavaScript. No build step, no framework, no database, and
no npm dependencies — the server is ~180 lines of Node standard library.

---

## Quick start

```bash
npm start
```

Then open <http://localhost:3000>. You need Node 18 or newer.

For text-only edits you can also just double-click `public/index.html`.

---

## Where things live

| I want to change… | Open this |
|---|---|
| My name, email, WhatsApp, Instagram | `public/index.html` |
| My projects, thumbnails, video links | `public/js/data.js` |
| Any of the page copy | `public/index.html` |
| Colours and type | top of `public/css/style.css` |
| My photo, thumbnails, share image | `public/assets/images/` |
| Self-hosted video files | `public/assets/videos/` |

Adding a project is a copy-paste of one block in `data.js`. You never have to
touch the HTML to add work.

**Full instructions, including deploying to Railway, are in [SETUP.md](SETUP.md).**

---

## What's in the box

- Thirteen sections: hero, intro, filtered work grid, featured case study,
  categories, services, about, process, positioning, brand pitch, CTA,
  contact, footer.
- A video lightbox that takes YouTube links, Vimeo links, or your own MP4s —
  it works out which is which on its own.
- Optional silent hover previews on cards, disabled automatically on touch
  devices and for anyone who has asked for reduced motion.
- Scroll reveals, nav scrollspy, mobile menu, keyboard-accessible everywhere.
- SEO: semantic headings, Open Graph and Twitter cards, JSON-LD `Person`,
  canonical URL, per-image alt text.
- Byte-range support so self-hosted video scrubs properly, gzip for text,
  ETag revalidation, and tiered cache headers.

Nothing in the site is fabricated. There are no invented clients, brand logos,
testimonials, awards or statistics anywhere — every project slot is a
placeholder waiting for your real work.

---

## Deploying

Push to GitHub, then point Railway at the repository. Railway reads
`package.json`, sees Node, and runs `npm start`. There are no environment
variables to set and no build command to enter.

Step-by-step in [SETUP.md § 11](SETUP.md).

---

## Structure

```
product-ad-portfolio/
├── server.js          Static file server. Don't edit.
├── package.json       Start script and Node version.
├── railway.json       Railway build and healthcheck settings.
├── SETUP.md           The guide you actually want.
└── public/
    ├── index.html     All page copy and contact links.
    ├── favicon.svg
    ├── robots.txt
    ├── css/style.css
    ├── js/data.js     ← your projects
    ├── js/main.js     site behaviour
    └── assets/images/ + assets/videos/
```
