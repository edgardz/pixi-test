import { particles, Sprite, Texture, Container } from 'pixi.js';
import { TweenMax, Power1, Linear } from 'gsap';

import BaseScene from './BaseScene';

import Stats from '../components/Stats';

import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';

export default class CardsScene extends BaseScene {
  leftPile: particles.ParticleContainer;
  rightPile: particles.ParticleContainer;
  pileContainer: Container;

  timer: number;
  stats: Stats;

  totalSprites: number = 144;
  toRight: boolean = true;
  offset: number = 3;
  speed: number = 2;
  size: number = 80;

  constructor(app) {
    super(app);

    const containerOptions = {
      scale: false,
      position: true,
      rotation: false,
      uvs: false,
      alpha: false
    };

    this.leftPile = new particles.ParticleContainer(this.totalSprites, containerOptions);
    this.rightPile = new particles.ParticleContainer(this.totalSprites, containerOptions);
    this.pileContainer = new Container();
    this.pileContainer.interactiveChildren = false;

    for (var i = 0; i < this.totalSprites; i++) {
      const card = new Sprite(Texture.WHITE);
      card.tint = Math.floor(Math.random() * 0xffffff);
      card.width = this.size;
      card.height = this.size * 1.4;
      card.position.set(0, this.offset * i);
      card['moving'] = false;
      this.leftPile.addChild(card);
    }

    this.pileContainer.addChild(this.leftPile);
    this.pileContainer.addChild(this.rightPile);

    this.addChild(this.pileContainer);

    this.moveTopCard();

    this.stats = new Stats(this.app);
  }

  moveTopCard = () => {
    const containerA = this.toRight ? this.leftPile : this.rightPile;
    const containerB = this.toRight ? this.rightPile : this.leftPile;

    const baseStack = containerA.children.filter(child => !child['moving']);

    const i = this.totalSprites - baseStack.length;
    const card = baseStack[baseStack.length - 1];
    const lastCard = baseStack.length === 1;
    const containerOffset = this.toRight ? this.size * 2.5 : 0;

    card['moving'] = true;
    TweenMax.to(card.position, this.speed, {
      x: containerOffset,
      y: this.offset * i,
      ease: Linear.easeNone /* Easy to enable easing. Out of scope? */
    });
    TweenMax.delayedCall(this.speed * 0.5, () => {
      containerB.addChild(card);
      card['moving'] = false;
    });

    if (lastCard) {
      this.toRight = !this.toRight;
      this.timer = setTimeout(() => {
        this.pileContainer.swapChildren(containerA, containerB);
        this.moveTopCard();
      }, this.speed * 1000);
    } else {
      this.timer = setTimeout(this.moveTopCard, (this.speed / 2) * 1000);
    }
  };

  public resize() {
    super.resize();

    const pileContainerMaxWidth = this.size * 3.5;
    const pileContainerMaxHeight = this.totalSprites * this.offset + this.size;
    this.pileContainer.position.set(
      this.rendererSize.x / 2 - pileContainerMaxWidth / 2,
      this.rendererSize.y / 2 - pileContainerMaxHeight / 2
    );
  }

  public destroy(options) {
    TweenMax.killAll();
    this.stats.destroy();
    clearTimeout(this.timer);
    removeAndDestroyAllChildren(this.leftPile, options);
    removeAndDestroyAllChildren(this.rightPile, options);
    removeAndDestroyAllChildren(this.pileContainer, options);
    super.destroy(options);
  }
}
