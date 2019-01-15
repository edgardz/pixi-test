import { loader, particles, Sprite, Texture, Container, Spritesheet } from 'pixi.js';
import { TweenMax, Power1, Linear } from 'gsap';

import BaseScene from './BaseScene';

import Stats from '../components/Stats';

import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';

export default class CardsScene extends BaseScene {
  leftPile: particles.ParticleContainer;
  rightPile: particles.ParticleContainer;
  pileContainer: Container;
  spriteSheet: Spritesheet;

  timer: any;
  stats: Stats;

  totalSprites: number = 144;
  toRight: boolean = true;
  offset: number = 3;
  speed: number = 2;
  cardWidth: number = 70;
  cardHeight: number = 95;

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

    this.spriteSheet = new Spritesheet(loader.resources['cards'].texture.baseTexture, require('../assets/cards.json'));
    this.spriteSheet.parse(() => {
      const textures = Object.keys(this.spriteSheet.textures).map(key => this.spriteSheet.textures[key]);
      for (var i = 0; i < this.totalSprites; i++) {
        const card = new Sprite(textures[i % textures.length]);
        card.width = this.cardWidth;
        card.height = this.cardHeight;
        card.position.set(0, this.offset * i);
        card['moving'] = false;
        this.leftPile.addChild(card);
      }

      this.pileContainer.addChild(this.leftPile);
      this.pileContainer.addChild(this.rightPile);

      this.addChild(this.pileContainer);

      this.stats = new Stats(this.app);

      this.timer = setTimeout(this.moveTopCard, 500);

      document.addEventListener('visibilitychange', this.onVisibility);
    });
  }

  onVisibility = () => {
    clearTimeout(this.timer);
    if (document.visibilityState !== 'hidden') {
      this.timer = setTimeout(this.moveTopCard, 500);
    }
  };

  moveTopCard = () => {
    if (document.visibilityState === 'hidden') {
      return;
    }

    const containerA = this.toRight ? this.leftPile : this.rightPile;
    const containerB = this.toRight ? this.rightPile : this.leftPile;

    const baseStack = containerA.children.filter(child => !child['moving']);

    const i = this.totalSprites - baseStack.length;
    const card = baseStack[baseStack.length - 1];
    const lastCard = baseStack.length === 1;
    const containerOffset = this.toRight ? this.cardWidth * 2.5 : 0;

    card['moving'] = true;
    TweenMax.to(card.position, this.speed, {
      x: containerOffset,
      y: this.offset * i,
      ease: Linear.easeNone /* Easy to enable easing. Is it out of scope? */
    });
    TweenMax.delayedCall(this.speed * 0.5, () => {
      containerB.addChild(card);
      card['moving'] = false;
    });

    clearTimeout(this.timer);

    if (lastCard) {
      // reverse direction
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
    const pileContainerMaxWidth = this.cardWidth * 3.5;
    const pileContainerMaxHeight = this.totalSprites * this.offset + this.cardHeight;
    this.pileContainer.position.set(
      this.rendererSize.width / 2 - pileContainerMaxWidth / 2,
      this.rendererSize.height / 2 - pileContainerMaxHeight / 2
    );
  }

  public destroy(options) {
    TweenMax.killAll();
    this.stats.destroy();
    this.spriteSheet.destroy();
    clearTimeout(this.timer);
    removeAndDestroyAllChildren(this.leftPile, options);
    removeAndDestroyAllChildren(this.rightPile, options);
    removeAndDestroyAllChildren(this.pileContainer, options);
    document.removeEventListener('visibilitychange', this.onVisibility);
    super.destroy(options);
  }
}
