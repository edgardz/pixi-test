import { Sprite, Texture } from 'pixi.js';
import { TweenMax } from 'gsap';

import BaseScene from './BaseScene';

import Fire from '../components/Fire';
import Stats from '../components/Stats';

import { colors } from '../utils/constants';

export default class ParticlesScene extends BaseScene {
  bg: Sprite;
  fire: Fire;
  stats: Stats;

  constructor(app) {
    super(app);

    this.bg = new PIXI.Sprite(Texture.WHITE);
    this.bg.tint = colors.black;
    this.addChild(this.bg);

    this.fire = new Fire();
    this.addChild(this.fire);

    this.stats = new Stats(this.app);
  }

  public resize() {
    super.resize();
    this.bg.width = this.rendererSize.width;
    this.bg.height = this.rendererSize.height;
    this.fire.size = Math.min(this.rendererSize.width, this.rendererSize.height);
    this.fire.position.set(this.rendererSize.width / 2, this.rendererSize.height / 2 + this.fire.size / 2);
  }

  public destroy(options) {
    TweenMax.killAll();
    this.stats.destroy();
    this.fire.destroy(options);
    super.destroy(options);
  }
}
