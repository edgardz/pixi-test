import { loader, extras, Spritesheet, Texture, Container, Sprite, BLEND_MODES } from 'pixi.js';
import { TweenMax, TimelineMax, Power4 } from 'gsap';

import BaseScene from './BaseScene';

import { colors } from '../utils/constants';
import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';

export default class ParticlesScene extends BaseScene {
  bg: Sprite;
  spriteSheet: Spritesheet;
  particleContainer: Container;

  interval: any;

  animationFrames: Texture[] = [];
  maxParticles: number = 10;
  time: number = 3;

  constructor(app) {
    super(app);

    this.bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.bg.tint = colors.black;
    this.addChild(this.bg);

    this.particleContainer = new Container();
    this.addChild(this.particleContainer);

    this.spriteSheet = new Spritesheet(loader.resources['fire'].texture.baseTexture, require('../assets/fire.json'));
    this.spriteSheet.parse(() => {
      this.animationFrames = Object.keys(this.spriteSheet.textures).map(key => this.spriteSheet.textures[key]);
      this.interval = setInterval(this.emitParticle, (this.time * 1000) / this.maxParticles);
    });
  }

  emitParticle = () => {
    const x = this.rendererSize.width / 2;
    const y = this.rendererSize.height / 2;

    const particle = new extras.AnimatedSprite(this.animationFrames);
    particle.animationSpeed = 1.4 / this.time;
    particle.anchor.set(0.5, 1);
    particle.alpha = 0;
    particle.width = particle.height = Math.min(this.rendererSize.width, this.rendererSize.height);
    particle.position.set(x, y + particle.height / 2);
    particle.blendMode = BLEND_MODES.ADD;
    particle.gotoAndPlay(Math.random() * this.animationFrames.length);

    const timeline = new TimelineMax({
      onComplete: () => {
        particle.parent.removeChild(particle);
        particle.destroy();
      }
    });
    timeline
      .to(particle.position, this.time, { x: x, y: y - 150, ease: Power4.easeIn }, 0)
      .to(particle, this.time / 2, { alpha: 0.2 + Math.random() * 0.2 }, 0)
      .to(particle, this.time / 2, { alpha: 0 }, this.time / 2)
      .to(particle.scale, this.time, { x: 0.5 + Math.random(), y: 1 + Math.random() }, 0);

    this.particleContainer.addChild(particle);
  };

  public resize() {
    super.resize();
    this.bg.width = this.rendererSize.width;
    this.bg.height = this.rendererSize.height;
  }

  public destroy(options) {
    TweenMax.killAll();
    clearInterval(this.interval);
    this.spriteSheet.destroy();
    removeAndDestroyAllChildren(this.particleContainer, options);
    super.destroy(options);
  }
}
