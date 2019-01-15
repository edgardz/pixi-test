import { loader, extras, Spritesheet, Texture, Container, Sprite, BLEND_MODES, DestroyOptions } from 'pixi.js';
import { TimelineMax, Power4 } from 'gsap';
import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';

export default class Fire extends Container {
  spriteSheet: Spritesheet;
  interval: any;
  size: number;
  time: number;

  frames: Texture[] = [];
  maxParticles: number = 10;

  constructor(size: number = 100, time: number = 3) {
    super();
    this.size = size;
    this.time = time;
    this.spriteSheet = new Spritesheet(loader.resources['fire'].texture.baseTexture, require('../assets/fire.json'));
    this.spriteSheet.parse(() => {
      this.frames = Object.keys(this.spriteSheet.textures).map(key => this.spriteSheet.textures[key]);
      this.interval = setInterval(this.emitParticle, (this.time * 1000) / this.maxParticles);
    });
  }

  emitParticle = () => {
    const particle = new extras.AnimatedSprite(this.frames);
    particle.animationSpeed = 1.4 / this.time;
    particle.anchor.set(0.5, 1);
    particle.alpha = 0;
    particle.width = particle.height = this.size;
    particle.blendMode = BLEND_MODES.ADD;
    particle.gotoAndPlay(Math.random() * this.frames.length);

    const timeline = new TimelineMax({
      onComplete: () => {
        particle.parent.removeChild(particle);
        particle.destroy();
      }
    });
    timeline
      .to(particle.position, this.time, { y: -150, ease: Power4.easeIn }, 0)
      .to(particle, this.time / 2, { alpha: 0.2 + Math.random() * 0.2 }, 0)
      .to(particle, this.time / 2, { alpha: 0 }, this.time / 2)
      .to(particle.scale, this.time, { x: 0.5 + Math.random(), y: 1 + Math.random() }, 0);

    this.addChild(particle);
  };

  public destroy(options?: boolean | DestroyOptions) {
    clearInterval(this.interval);
    this.spriteSheet.destroy();
    removeAndDestroyAllChildren(this, options);
    super.destroy(options);
  }
}
