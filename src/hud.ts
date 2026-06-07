import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';

export type SpeedLevel = 'slow' | 'normal' | 'fast';

export const SPEED_MULTIPLIERS: Record<SpeedLevel, number> = {
  slow: 0.5,
  normal: 1.0,
  fast: 2.0,
};

interface SpeedButton {
  container: Container;
  bg: Graphics;
  label: SpeedLevel;
}

export class HUD {
  readonly hudContainer: Container;
  private buttons: SpeedButton[] = [];
  private activeSpeed: SpeedLevel = 'normal';
  private onSpeedChange: (level: SpeedLevel, mult: number) => void;

  constructor(app: Application, parent: Container, onSpeedChange: (level: SpeedLevel, mult: number) => void) {
    this.onSpeedChange = onSpeedChange;
    this.hudContainer = new Container();
    parent.addChild(this.hudContainer);

    this.buildButtons(app);

    app.renderer.on('resize', () => this.layout(app));
  }

  private buildButtons(app: Application): void {
    const levels: SpeedLevel[] = ['slow', 'normal', 'fast'];
    const labels: Record<SpeedLevel, string> = {
      slow: '🐢 Slow',
      normal: '🐦 Normal',
      fast: '🚀 Fast',
    };

    for (const level of levels) {
      const btn = new Container();
      const bg = new Graphics();
      btn.addChild(bg);

      const style = new TextStyle({
        fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif',
        fontSize: 18,
        fontWeight: 'bold',
        fill: 0xffffff,
      });

      const text = new Text({ text: labels[level], style });
      text.anchor.set(0.5, 0.5);
      btn.addChild(text);

      btn.eventMode = 'static';
      btn.cursor = 'pointer';
      btn.on('pointertap', () => {
        this.setActive(level);
        this.onSpeedChange(level, SPEED_MULTIPLIERS[level]);
      });

      this.buttons.push({ container: btn, bg, label: level });
      this.hudContainer.addChild(btn);
    }

    this.layout(app);
    this.refreshButtonStyles();
  }

  private layout(app: Application): void {
    const btnW = 90;
    const btnH = 44;
    const gap = 10;
    const totalW = this.buttons.length * btnW + (this.buttons.length - 1) * gap;
    const startX = (app.screen.width - totalW) / 2;
    const y = app.screen.height - btnH - 16;

    this.buttons.forEach((btn, i) => {
      btn.container.x = startX + i * (btnW + gap);
      btn.container.y = y;

      // Redraw bg
      this.drawButtonBg(btn, btnW, btnH);

      // Center the text label
      const txt = btn.container.getChildAt(1) as Text;
      txt.x = btnW / 2;
      txt.y = btnH / 2;
    });
  }

  private drawButtonBg(btn: SpeedButton, w: number, h: number): void {
    const isActive = btn.label === this.activeSpeed;
    btn.bg.clear();
    btn.bg
      .roundRect(0, 0, w, h, 14)
      .fill({
        color: isActive ? 0xff8800 : 0x2980b9,
        alpha: isActive ? 1.0 : 0.75,
      });

    if (isActive) {
      btn.bg.roundRect(0, 0, w, h, 14).stroke({ color: 0xffffff, width: 3, alpha: 0.9 });
    }
  }

  private setActive(level: SpeedLevel): void {
    this.activeSpeed = level;
    this.refreshButtonStyles();
  }

  private refreshButtonStyles(): void {
    const w = 90;
    const h = 44;
    for (const btn of this.buttons) {
      this.drawButtonBg(btn, w, h);
    }
  }
}
