# Setup guide

Everything you need to make this site yours, then put it online.

---

## 1. Project structure

```
product-ad-portfolio/
├── server.js               Tiny web server. You never need to edit this.
├── package.json            Tells Railway how to start the site.
├── railway.json            Railway deployment settings.
├── .gitignore
├── README.md
├── SETUP.md                This file.
└── public/                 Everything the browser sees.
    ├── index.html          All page text, your name, your contact links.
    ├── favicon.svg         The little icon in the browser tab.
    ├── robots.txt
    ├── css/
    │   └── style.css       All styling. Colours live at the very top.
    ├── js/
    │   ├── data.js         ← YOUR PROJECTS. This is the file you'll use most.
    │   └── main.js         Site behaviour. No need to edit.
    └── assets/
        ├── images/         Thumbnails, your portrait, social share image.
        └── videos/         Your .mp4 files, if you self-host them.
```

---

## 2. Your name, email, WhatsApp and Instagram

These live in **`public/index.html`**. Open it in any text editor and use
find-and-replace. There are four things to replace, and each appears several
times on purpose, so replace *all* occurrences of each.

| Find this exactly | Replace with | Example |
|---|---|---|
| `[YOUR NAME]` | Your name as you want it shown | `Ayaan Malik` |
| `[YOUR EMAIL]` | Your email address | `hello@ayaanmalik.com` |
| `[YOUR INSTAGRAM]` | Your handle, **without** the `@` | `ayaan.creates` |
| `[YOUR WHATSAPP NUMBER]` | Digits only, country code first, no `+`, no spaces | `923001234567` |
| `[YOUR WHATSAPP]` | How the number should *look* on screen | `+92 300 1234567` |

A note on the WhatsApp ones: there are two, and they're different on purpose.
`[YOUR WHATSAPP NUMBER]` goes inside the link and must be digits only or the
link won't open. `[YOUR WHATSAPP]` is just the text visitors read.

While you're in `index.html`, also update the `https://example.com/` lines near
the top once you know your final web address. There are four: `canonical`,
`og:url`, `og:image` and `twitter:image`.

---

## 3. Your profile photo

Save your portrait as **`public/assets/images/portrait.jpg`**.

Then in `index.html` find this line and change `.svg` to `.jpg`:

```html
<img src="assets/images/portrait.svg" alt="Portrait of [YOUR NAME]" ...>
```

A vertical shot works best. Anything around 800 × 1000 pixels is plenty, and
keeping it under 300 KB keeps the page fast.

---

## 4. Your projects

Open **`public/js/data.js`**. This is the only file you need for adding work.

Each project is one block between `{ }`. To add a project, copy an existing
block, paste it into the list, and change the values. To remove one, delete
its block. The order in the file is the order on the page.

```js
{
  title: "Premium Pet Food Commercial",
  category: "Pet · Food · Commercial",
  tags: ["pet", "food"],
  description: "A cinematic product advertisement created to showcase the product.",
  thumbnail: "assets/images/thumb-01-pet-food.svg",
  alt: "Pet food bowl lit as a product still on a dark set",
  video: "",
  preview: "",
  duration: "0:30",
  format: "16:9",
  size: "lg"
},
```

**`tags`** decides which filter buttons the project shows under. Use any of
`"food"`, `"pet"`, `"home"`, `"cleaning"`, `"consumer"`. A project can have
more than one.

**`size`** controls how wide the card is on desktop. `"lg"` is wide, `"sm"` is
narrow, `"md"` is half width. Alternating `lg` and `sm` down the list is what
gives the grid its rhythm, so try to keep them paired.

**`format`** is shown in the video window. Set it to `"9:16"` for a vertical
ad and the video player switches to a vertical frame automatically.

Two things to watch: every block needs a comma after its closing `}` except
the very last one, and every piece of text needs to stay inside its quote
marks. If the site ever goes blank, it's almost always one of those two.

---

## 5. Your thumbnails

Put your images in `public/assets/images/` and point the `thumbnail` field at
them. Paths are written from inside the `public` folder, so a file at
`public/assets/images/my-ad.jpg` is written as `assets/images/my-ad.jpg`.

Export at 1600 × 900 (16:9). JPG at around 80% quality, or WebP if you can.
Aim for under 400 KB each. The placeholder SVGs currently in that folder can
be deleted once you've replaced them all.

Always fill in `alt` too. It's what screen readers announce and what Google
reads, and it's one short sentence describing what's in the frame.

---

## 6. Your videos

You can mix and match. Each project takes whichever you prefer.

**YouTube or Vimeo** — paste the normal link, nothing else needed:

```js
video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
video: "https://youtu.be/dQw4w9WgXcQ"
video: "https://vimeo.com/76979871"
```

**Your own file** — put the `.mp4` in `public/assets/videos/` and point at it:

```js
video: "assets/videos/pet-food-commercial.mp4"
```

Use H.264 video with AAC audio in an `.mp4` container so every browser can
play it, and try to stay under about 20 MB per file. Railway serves these
directly, so big files slow the page down for every visitor.

Leave `video: ""` and the project still displays. Clicking it opens a small
note reminding you where to paste the link.

**Silent hover previews** are optional. Add a 3 to 6 second muted clip and the
card plays it when someone hovers:

```js
preview: "assets/videos/pet-food-preview.mp4"
```

Previews never load on phones or for visitors who've asked for reduced motion,
so they cost nothing on mobile.

---

## 7. The featured project

Below the project list in `data.js` there's a `FEATURED` block. Same fields,
plus the four case-study lines under `breakdown`. Change the `label` and `text`
of each to describe whichever campaign you want to lead with.

---

## 8. The social share image

This is the picture people see when someone pastes your link into WhatsApp,
Instagram or LinkedIn. Two rules trip everyone up: it has to be a **full web
address**, not a relative path, and it can't be an SVG, because the social
platforms don't render those.

So export a **1200 × 630 JPG**, save it as
`public/assets/images/og-cover.jpg`, and in `index.html` change both of these
to your real domain:

```html
<meta property="og:image" content="https://example.com/assets/images/og-cover.jpg">
<meta name="twitter:image" content="https://example.com/assets/images/og-cover.jpg">
```

There's an `og-cover.svg` in that folder you can open and use as a layout
reference. A strong frame from your best ad with your name on it works well.

After you deploy, paste your URL into
[opengraph.xyz](https://www.opengraph.xyz) to check it renders.

---

## 9. Changing the colours

Everything is set in one place at the top of `public/css/style.css`:

```css
--bg:     #121110;   /* page background */
--ivory:  #F2EEE7;   /* main text */
--mute:   #98918A;   /* secondary text */
--brass:  #C4A06A;   /* the single accent */
```

Change `--brass` and the accent updates everywhere at once. Keep it reasonably
light so it stays readable on the dark background.

There's also a commented line in the `.hero__title` rule. Uncomment it if you
want the main headline in full capitals instead of sentence case.

---

## 10. Running it on your own computer

You need Node.js 18 or newer from [nodejs.org](https://nodejs.org).

```bash
cd product-ad-portfolio
npm start
```

Then open `http://localhost:3000`.

For quick text edits you can also just double-click `public/index.html` and it
will open in your browser without the server. Self-hosted video files won't
scrub properly that way, but everything else works.

---

## 11. Deploying to Railway from GitHub

**Put the code on GitHub first.**

1. Create a new empty repository at [github.com/new](https://github.com/new).
   Don't add a README or a `.gitignore`, this project already has both.
2. In a terminal, inside the `product-ad-portfolio` folder:

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

**Then deploy it.**

3. Go to [railway.app](https://railway.app) and sign in with GitHub.
4. Click **New Project**, then **Deploy from GitHub repo**.
5. Authorise Railway to see your repositories if it asks, then pick the one
   you just pushed.
6. Railway reads `package.json`, sees Node, and runs `npm start` on its own.
   There are no environment variables to set and no build command to enter.
   The first deploy takes about a minute.
7. Open the deployment, go to **Settings → Networking**, and click
   **Generate Domain**. You'll get a URL like
   `your-project.up.railway.app`. That's your live site.

**Your own domain.** In the same Networking panel choose **Custom Domain**,
type your domain, and Railway shows you a `CNAME` record. Add that record at
your domain registrar. HTTPS is issued automatically once it resolves, usually
within the hour.

**Updating the site later.** Edit your files, then:

```bash
git add .
git commit -m "Added two new projects"
git push
```

Railway redeploys automatically every time you push. Nothing else to do.

---

## 12. If something goes wrong

**The page loads but no projects appear.** There's a typo in `data.js`. Open
the site, press F12, and look at the Console tab. It will name the line. Nine
times out of ten it's a missing comma or a missing quote mark.

**A thumbnail is a blank box.** The path in `data.js` doesn't match the real
filename. Check the spelling and the extension, and remember it's
case-sensitive once it's on Railway even if it worked on Windows.

**A video won't play.** If it's a YouTube link, confirm the video isn't set to
private. If it's your own file, confirm it's really H.264 in an `.mp4` and
that the path starts with `assets/videos/`.

**Railway says the build failed.** Open the deploy logs. If it mentions the
Node version, add an `engines` field check in `package.json` — it's already
set to Node 18 or newer, so this is rare.

**The site deployed but the URL 404s.** You probably haven't clicked
**Generate Domain** under Settings → Networking yet.
