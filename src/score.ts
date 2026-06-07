import { Container, Text, TextStyle } from 'pixi.js';

export class ScoreDisplay {
  private text: Text;
  private score = 0;

  constructor(parent: Container) {
    const style = new TextStyle({
      fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif',
      fontSize: 36,
      fontWeight: 'bold',
      fill: 0xffffff,
      stroke: { color: 0x1a5276, width: 4 },
      dropShadow: {
        color: 0x000000,
        alpha: 0.3,
        blur: 4,
        distance: 2,
        angle: Math.PI / 4,
      },
    });

    this.text = new Text({ text: '⭐ 0', style });
    this.text.x = 16;
    this.text.y = 12;
    parent.addChild(this.text);
  }

  increment(): void {
    this.score++;
    this.text.text = `⭐ ${this.score}`;
  }

  /** Re-add the score text to the top of its parent's draw order. */
  bringToTop(): void {
    this.text.parent?.addChild(this.text);
  }

  get value(): number {
    return this.score;
  }
}
