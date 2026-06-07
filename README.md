# Liftoff

A touch-first web app for children that trains **upward vertical gaze**. A single object rises straight up from the center of the screen, drawing the eyes upward; tap/click it to pop it and score. Built for phones and tablets.

## How to run

```bash
npm install
npm run dev
```

Then open the URL shown (e.g. `http://localhost:5173`) on a phone, tablet, or desktop browser.

## Build for production

```bash
npm run build
```

## Deploy (Cloudflare Pages)

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Production branch:** `main`
- If the build fails on Node version, set env `NODE_VERSION = 22`.

## Notes
- Built with Vite + TypeScript + PixiJS v8 (WebGL rendering, 60fps).
- Zero external asset dependencies — all graphics are drawn procedurally.
- One object rises at a time, in a sequence; tap to pop. The balloon is a placeholder skin — selectable skins are planned for later.
- Use the speed buttons at the bottom (Slow / Normal / Fast) to adjust speed.
- Therapeutic concept inspired by optosense.app (vertical-gaze / OKN training).
