import { TextStyleOptions, Texture, Container, Text, Sprite, DisplayObject } from 'pixi.js';

import { colors } from '../utils/constants';
import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';

export default class DecoratedText extends Container {
  currentOptions: TextStyleOptions;
  defaultOptions: TextStyleOptions = {
    fontFamily: 'Arial',
    fontSize: 18,
    fill: colors.black
  };

  marginFactor: number = 0.2; // percentage of fontSize

  constructor(elements: Array<string | Texture> = [], options: TextStyleOptions = {}) {
    super();
    if (elements.length) {
      this.update(elements, options);
    }
  }

  update = (elements: Array<string | Texture>, options: TextStyleOptions = {}) => {
    this.currentOptions = Object.assign(this.defaultOptions, options);

    removeAndDestroyAllChildren(this, false);

    elements.map(element => {
      if (element instanceof Texture) {
        const sprite = new Sprite(element);
        sprite.height = +this.currentOptions.fontSize;
        sprite.scale.x = sprite.scale.y;
        this.addChild(sprite);
      } else {
        const text = new Text(element, this.currentOptions);
        this.addChild(text);
      }
    });

    this.children.map((child: Sprite, i) => {
      if (i > 0) {
        const prev = this.children[i - 1] as Sprite;
        const margin = +this.currentOptions.fontSize * this.marginFactor;
        child.position.x = prev.position.x + prev.width + margin;
      }
      if (this.currentOptions.wordWrap) {
        child.position.y = +this.currentOptions.fontSize / 2 - child.height / 2;
      }
    });
  };
}
