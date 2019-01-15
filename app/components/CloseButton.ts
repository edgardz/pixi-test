import { Graphics, Rectangle, Sprite, Container } from 'pixi.js';

import { colors } from '../utils/constants';

export default class CloseButton extends Container {
  graphics: Graphics;

  constructor(size = 20) {
    super();

    this.buttonMode = true;
    this.interactive = true;

    this.graphics = new Graphics();
    this.graphics.lineStyle(4, colors.gray, 1);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(size, size);
    this.graphics.moveTo(size, 0);
    this.graphics.lineTo(0, size);

    this.hitArea = new Rectangle(0, 0, this.graphics.width, this.graphics.height);

    this.addChild(this.graphics);
  }
}
