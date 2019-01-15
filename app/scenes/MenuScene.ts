import { Container } from 'pixi.js';

import BaseScene from './BaseScene';

import CtaButton from '../components/CtaButton';
import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';

export default class MenuScene extends BaseScene {
  buttonContainer: Container;
  cardsButton: CtaButton;
  richTextButton: CtaButton;
  particlesButton: CtaButton;

  constructor(app) {
    super(app, false);

    this.cardsButton = new CtaButton('Pile of Cards');
    this.richTextButton = new CtaButton('Decorated Text');
    this.particlesButton = new CtaButton('Fire Effect');

    this.buttonContainer = new Container();
    this.buttonContainer.addChild(this.cardsButton);
    this.buttonContainer.addChild(this.richTextButton);
    this.buttonContainer.addChild(this.particlesButton);

    this.cardsButton.on('pointerup', () => this.app.setActiveScene(this.app.scenes.cards));
    this.richTextButton.on('pointerup', () => this.app.setActiveScene(this.app.scenes.decoratedText));
    this.particlesButton.on('pointerup', () => this.app.setActiveScene(this.app.scenes.fire));

    this.addChild(this.buttonContainer);
  }

  public resize() {
    super.resize();

    this.buttonContainer.children.map((button, i) => {
      const prevButton = this.buttonContainer.children[i - 1] as CtaButton;
      const prevPosY = prevButton ? prevButton.position.y : 0;
      const prevHeight = prevButton ? prevButton.height : 0;
      const margin = prevButton ? 20 : 0;
      button.position.y = prevPosY + prevHeight + margin;
    });

    this.buttonContainer.position.set(
      this.rendererSize.width / 2 - this.buttonContainer.width / 2,
      this.rendererSize.height / 2 - this.buttonContainer.height / 2
    );
  }

  public destroy(options) {
    removeAndDestroyAllChildren(this.buttonContainer);
    super.destroy(options);
  }
}
