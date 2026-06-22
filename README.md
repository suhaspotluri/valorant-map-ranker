# valorant-map-ranker

Simple static web app for ranking Valorant maps by dragging cards and sharing
the result with a URL.

## Features

- Drag-and-drop ordering for the map list
- Built-in move up/down controls for quick reordering
- Shareable links that store the full ranking in the URL hash
- Automatic local persistence between visits
- GitHub Pages deployment workflow

## Local preview

```bash
python3 -m http.server 8000 --directory docs
```

Then open `http://localhost:8000`.

## GitHub Pages

The site lives in `/docs` and the workflow at
`/.github/workflows/deploy.yml` deploys it to GitHub Pages on pushes to
`main` or `master`.