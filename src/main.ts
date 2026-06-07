import { Application } from 'pixi.js';
import { BalloonManager } from './balloon';
import { ScoreDisplay } from './score';
import { HUD } from './hud';

async function main(): Promise<void> {
  // ---- PixiJS v8 async init ----
  const app = new Application();

  await app.init({
    resizeTo: window,
    backgroundColor: 0x87ceeb,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.body.appendChild(app.canvas);

  // Make canvas fullscreen and touch-safe
  const canvas = app.canvas as HTMLCanvasElement;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';

  // ---- Layers (back → front) ----
  // Static sky-blue background (app.backgroundColor) — no scrolling pattern.
  const score = new ScoreDisplay(app.stage);

  const balloonManager = new BalloonManager(app, app.stage, () => {
    score.increment();
  });

  const hud = new HUD(app, app.stage, (_level, mult) => {
    balloonManager.setSpeedMultiplier(mult);
  });

  // Ensure HUD is on top
  app.stage.addChild(hud.hudContainer);
  score.bringToTop();

  // ---- Game loop ----
  app.ticker.add((ticker) => {
    balloonManager.update(ticker);
  });
}

main().catch(console.error);
