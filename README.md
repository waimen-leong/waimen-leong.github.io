# My Portfolio

A static portfolio site, ready for GitHub Pages.

## What each file does

| File | Job | Do you edit it? |
|---|---|---|
| `data.js` | **All your content**: name, links, projects, skills, timeline | **Yes, this is the main one** |
| `index.html` | The page skeleton: empty boxes with ids | Rarely |
| `main.js` | Reads `data.js` and fills those boxes with HTML; draws the spinning wireframe | No |
| `style.css` | Colours, fonts, layout | Only to restyle |
| `assets/` | Your resume PDF, screenshots | Add files here |

The flow is:

```
data.js (your content)  →  main.js (builds HTML)  →  index.html (shown in browser)
                                                      styled by style.css
```

## Editing

1. Open `data.js`.
2. Change the text inside quotes.
3. To add a project, copy one `{ ... }` block inside `projects: [ ... ]` and paste it after the last one. Put a comma between blocks.
4. Save the file and refresh the browser to check.

Project categories are `"engine"`, `"gameplay"` or `"graphics"`. They set the colour (red, green or blue, like an X/Y/Z gizmo) and the filter buttons.

To add a video, set `media: { type: "youtube", id: "abc123XYZ" }`. The id is the part after `watch?v=` in the YouTube URL.

To add a screenshot, put the image in `assets/` and set `media: { type: "image", src: "assets/my-shot.png" }`.

**If the page goes blank**, there's a typo in `data.js`, usually a missing comma or quote. Press F12, open the Console tab, and it will tell you the line number.

## Preview locally

Double-clicking `index.html` works. For a closer match to the real site, run this in the folder:

```bash
python -m http.server
```

Then open http://localhost:8000.

## Deploy to GitHub Pages

1. Create a public repo named `yourusername.github.io`.
2. Put these files at the root of it and push:
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push
   ```
3. Go to Settings → Pages. Choose "Deploy from a branch", then select `main` and `/ (root)`.
4. After a minute, your site is live at `https://yourusername.github.io`.

Every later push updates the site automatically.
