# Balloon Pop – Vertical Gaze Training Prototype

A touch-first web app for children that trains **upward vertical gaze** via optokinetic nystagmus (OKN). Balloons rise upward against a scrolling sky background, drawing the eyes up. Tap/click to pop them!

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

## Notes
- Built with Vite + TypeScript + PixiJS v8 (WebGL rendering, 60fps).
- Zero external asset dependencies — all graphics are drawn procedurally.
- Use the speed buttons at the bottom (Slow / Normal / Fast) to adjust stimulus speed.
- Therapeutic concept inspired by optosense.app (OKN + smooth pursuit + saccades).
