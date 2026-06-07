import { Application, Container, Graphics, Ticker } from 'pixi.js';

// Fixed balloon body radius (px). Total visible height ≈ 2.3 × radius.
const BALLOON_RADIUS = 76;

const BALLOON_COLORS = [
  0xff4444, // red
  0xff8800, // orange
  0xffdd00, // yellow
  0x44cc44, // green
  0x4488ff, // blue
  0xcc44ff, // purple
  0xff66aa, // pink
  0x00cccc, // teal
];

export interface BalloonOptions {
  app: Application;
  onPop: (balloon: Balloon) => void;
  speedMultiplier: number;
}

export class Balloon {
  readonly container: Container;
  private riseSpeed: number;
  private popping = false;
  private app: Application;
  private onPop: (b: Balloon) => void;

  constructor(opts: BalloonOptions) {
    this.app = opts.app;
    this.onPop = opts.onPop;

    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const radius = BALLOON_RADIUS;

    // Fixed base rise speed (px/frame), scaled by multiplier.
    this.riseSpeed = 1.2 * opts.speedMultiplier;

    this.container = new Container();

    // Draw balloon body
    const g = new Graphics();

    // Main balloon ellipse (slightly taller than wide)
    g.ellipse(0, 0, radius, radius * 1.15).fill({ color });

    // Highlight sheen
    g.ellipse(-radius * 0.3, -radius * 0.35, radius * 0.25, radius * 0.3)
      .fill({ color: 0xffffff, alpha: 0.35 });

    // Knot at bottom
    g.ellipse(0, radius * 1.15 + 4, 5, 5).fill({ color });

    // String — draw as a tiny line approximated with a thin rect
    g.rect(-1, radius * 1.15 + 8, 2, 24).fill({ color: 0x888888, alpha: 0.7 });

    this.container.addChild(g);

    // Interaction
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    // Hit area matches the visible balloon body (an ellipse taller than wide),
    // with generous padding so it's easy to tap.
    const hitRx = radius + 22;
    const hitRy = radius * 1.15 + 22;
    this.container.hitArea = {
      contains: (x: number, y: number) => {
        return (x * x) / (hitRx * hitRx) + (y * y) / (hitRy * hitRy) <= 1;
      },
    } as import('pixi.js').IHitArea;

    this.container.on('pointertap', () => this.pop());

    // Always spawn horizontally centered, just below the bottom edge.
    this.container.x = opts.app.screen.width / 2;
    this.container.y = opts.app.screen.height + radius + 40;
  }

  /** Returns true when the balloon should be removed */
  update(_ticker: Ticker): boolean {
    if (this.popping) return false; // pop animation handled separately

    // Fly straight up — no horizontal movement.
    this.container.y -= this.riseSpeed;

    // Off the top of screen
    return this.container.y < -100;
  }

  pop(): void {
    if (this.popping) return;
    this.popping = true;
    this.container.eventMode = 'none';

    // Pop animation: scale up + fade out over ~20 frames
    const startScale = 1.0;
    let frame = 0;
    const totalFrames = 18;

    const animate = () => {
      frame++;
      const t = frame / totalFrames;
      this.container.scale.set(startScale + t * 0.8);
      this.container.alpha = 1 - t;

      if (frame >= totalFrames) {
        this.app.ticker.remove(animate);
        this.onPop(this);
      }
    };

    this.app.ticker.add(animate);
  }

  get isDone(): boolean {
    return this.popping && this.container.alpha <= 0;
  }

  get y(): number {
    return this.container.y;
  }
}

export class BalloonManager {
  private balloons: Balloon[] = [];
  private container: Container;
  private app: Application;
  // Vertical gap (px) between consecutive balloons, centre-to-centre.
  // Body height ≈ 2.3 × radius; ×3 leaves roughly two balloons of space between them.
  private balloonSpacing = BALLOON_RADIUS * 2.3 * 3;
  private speedMultiplier = 1;
  private onScoreIncrement: () => void;

  constructor(app: Application, parent: Container, onScore: () => void) {
    this.app = app;
    this.onScoreIncrement = onScore;
    this.container = new Container();
    parent.addChild(this.container);
  }

  setSpeedMultiplier(mult: number): void {
    this.speedMultiplier = mult;
  }

  private spawnBalloon(): void {
    const b = new Balloon({
      app: this.app,
      speedMultiplier: this.speedMultiplier,
      onPop: (_balloon) => {
        this.onScoreIncrement();
        // removal handled in update
      },
    });
    this.balloons.push(b);
    this.container.addChild(b.container);
  }

  update(ticker: Ticker): void {
    // Advance the current balloon and drop it once it pops or leaves the top.
    const toRemove: Balloon[] = [];
    for (const b of this.balloons) {
      if (b.isDone) {
        toRemove.push(b);
        continue;
      }
      const offTop = b.update(ticker);
      if (offTop) toRemove.push(b);
    }

    for (const b of toRemove) {
      this.container.removeChild(b.container);
      b.container.destroy({ children: true });
      this.balloons.splice(this.balloons.indexOf(b), 1);
    }

    // Spawn the next balloon once the most recent one has risen far enough,
    // so several share the screen in sequence with a fixed gap between them.
    const spawnY = this.app.screen.height + BALLOON_RADIUS + 40;
    const newest = this.balloons[this.balloons.length - 1];
    if (!newest || spawnY - newest.y >= this.balloonSpacing) {
      this.spawnBalloon();
    }
  }
}
