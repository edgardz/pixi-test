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

    this.cardsButton = new CtaButton('Cards Scene');
    this.richTextButton = new CtaButton('Rich Text Scene');
    this.particlesButton = new CtaButton('Particles Scene');

    this.buttonContainer = new Container();
    this.buttonContainer.addChild(this.cardsButton);
    this.buttonContainer.addChild(this.richTextButton);
    this.buttonContainer.addChild(this.particlesButton);

    this.cardsButton.on('pointerup', () => this.app.setActiveScene(this.app.scenes.cards));
    this.richTextButton.on('pointerup', () => this.app.setActiveScene(this.app.scenes.richText));
    this.particlesButton.on('pointerup', () => this.app.setActiveScene(this.app.scenes.particles));

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
      this.rendererSize.x / 2 - this.buttonContainer.width / 2,
      this.rendererSize.y / 2 - this.buttonContainer.height / 2
    );
  }

  public destroy(options) {
    removeAndDestroyAllChildren(this.buttonContainer);
    super.destroy(options);
  }
}
