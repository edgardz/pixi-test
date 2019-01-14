import { Graphics, Rectangle, Container, Text } from 'pixi.js';

import { colors } from '../utils/constants';

export default class CtaButton extends Container {
  text: Text;
  bg: Graphics;

  w: number = 220;
  p: number = 10;

  constructor(text: string) {
    super();

    this.buttonMode = true;
    this.interactive = true;

    this.text = new Text(text, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: colors.white,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.w - this.p * 2
    });

    this.bg = new Graphics();
    this.bg.beginFill(colors.blue);
    this.bg.drawRoundedRect(0, 0, this.w, this.text.height + this.p * 2, 10);
    this.bg.endFill();

    this.addChild(this.bg);
    this.addChild(this.text);

    this.text.position.set(this.width / 2 - this.text.width / 2, this.p);
  }
}
