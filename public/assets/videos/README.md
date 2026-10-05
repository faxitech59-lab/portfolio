# Videos

Two ways to add a video to a project. Both work — set them in `public/js/data.js`.

## Option 1 — YouTube or Vimeo (recommended)

No files go in this folder. Just paste the normal link into the project's `video` field:

```js
video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
video: "https://youtu.be/dQw4w9WgXcQ"
video: "https://vimeo.com/76979871"
```

The site detects the platform and builds the correct privacy-friendly embed itself.

## Option 2 — Your own MP4

Drop the file in this folder and point at it:

```js
video: "assets/videos/pet-food-commercial.mp4"
```

Use H.264 / AAC in an `.mp4` container so every browser can play it. Keep each
file under about 20 MB — Railway serves these directly, so large files slow the
page down for everyone.

A quick way to compress with ffmpeg:

```
ffmpeg -i input.mov -vcodec libx264 -crf 24 -preset slow -acodec aac -b:a 128k output.mp4
```

## Silent hover previews (optional)

A card can play a short muted clip when someone hovers it. Add a `preview` field
pointing at a 3 to 6 second MP4 with no audio:

```js
preview: "assets/videos/pet-food-preview.mp4"
```

Leave `preview` out and the card simply holds on its thumbnail, which is a fine
look and loads faster. Previews never load on touch devices or when the visitor
has reduced motion turned on.
