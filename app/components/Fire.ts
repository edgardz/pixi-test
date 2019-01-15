import { loader, extras, Spritesheet, Texture, Container, Sprite, BLEND_MODES, DestroyOptions } from 'pixi.js';
import { TimelineMax, Power4 } from 'gsap';
import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';

export default class Fire extends Container {
  spriteSheet: Spritesheet;
  duration: number;
  interval: any;
  size: number;

  frames: Texture[] = [];
  maxParticles: number = 10;

  constructor(size: number = 100, duration: number = 4) {
    super();
    this.size = size;
    this.duration = duration;
    this.interactiveChildren = false;
    this.spriteSheet = new Spritesheet(loader.resources['fire'].texture.baseTexture, require('../assets/fire.json'));
    this.spriteSheet.parse(() => {
      this.frames = Object.keys(this.spriteSheet.textures).map(key => this.spriteSheet.textures[key]);
      // this.frames = [Texture.WHITE]; //debug
      this.interval = setInterval(this.emitParticle, (this.duration * 1000) / this.maxParticles + 1);
    });
  }

  emitParticle = () => {
    // note: somehow destroying particles turned out to be more efficient than reusing them
    const particle = new extras.AnimatedSprite(this.frames);
    particle.animationSpeed = 1.4 / this.duration;
    particle.anchor.set(0.5, 1);
    particle.blendMode = BLEND_MODES.ADD;
    particle.gotoAndPlay(Math.random() * this.frames.length);

    particle.alpha = 0;
    particle.position.set(0, 0);
    particle.width = this.size * 1.5;
    particle.height = this.size;

    const scale = particle.scale.y;

    const timeline = new TimelineMax({
      onComplete: () => {
        this.removeChild(particle);
        particle.destroy(false);
      }
    });
    timeline
      .to(particle.position, this.duration, { y: -this.size * 0.5, ease: Power4.easeIn }, 0)
      .to(particle, this.duration / 2, { alpha: 0.1 + Math.random() * 0.3 }, 0)
      .to(particle, this.duration / 3, { alpha: 0, ease: Power4.easeIn }, this.duration / 2)
      .to(
        particle.scale,
        this.duration,
        {
          x: scale * (0.3 + Math.random() * 0.5),
          y: scale * (1.0 + Math.random() * 0.5)
        },
        0
      );

    this.addChild(particle);
  };

  public destroy(options?: boolean | DestroyOptions) {
    clearInterval(this.interval);
    this.spriteSheet.destroy();
    removeAndDestroyAllChildren(this, options);
    super.destroy(options);
  }
}
