import { loader, extras, Spritesheet, Texture, Container, Sprite, BLEND_MODES, DestroyOptions } from 'pixi.js';
import { Power4, TimelineLite } from 'gsap';
import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';

export default class Fire extends Container {
  spriteSheet: Spritesheet;
  timelines: TimelineLite[] = [];
  duration: number;
  timer: any;
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
      setTimeout(this.emitParticle);
      document.addEventListener('visibilitychange', this.onVisibility);
    });
  }

  onVisibility = () => {
    clearTimeout(this.timer);
    this.timelines.map(tl => tl.kill());
    if (document.visibilityState !== 'hidden') {
      setTimeout(this.emitParticle);
    }
  };

  emitParticle = () => {
    // during tests, destroying particles turned out to be more efficient
    // than reusing them, specially when using canvas renderer
    if (document.visibilityState !== 'hidden' && this.children.length < 10) {
      const particle = new extras.AnimatedSprite(this.frames);
      particle.animationSpeed = 1.4 / this.duration;
      particle.anchor.set(0.5, 1);
      particle.position.set(0, 0);
      particle.alpha = 0;
      particle.width = this.size * 1.5;
      particle.height = this.size;
      particle.blendMode = BLEND_MODES.ADD;
      particle.gotoAndPlay(Math.random() * this.frames.length);

      const scale = particle.scale.y;

      const timeline = new TimelineLite({
        onComplete: () => {
          this.removeChild(particle);
          particle.destroy(false);
          timeline.kill();
          this.timelines = this.timelines.filter(tl => tl != timeline);
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
      this.timelines.push(timeline);
      this.addChild(particle);
    }

    clearTimeout(this.timer);
    this.timer = setTimeout(this.emitParticle, (this.duration * 1000) / this.maxParticles);
  };

  public destroy(options?: boolean | DestroyOptions) {
    this.timelines.map(tl => tl.kill());
    this.spriteSheet.destroy();
    clearTimeout(this.timer);
    removeAndDestroyAllChildren(this, options);
    document.removeEventListener('visibilitychange', this.onVisibility);
    super.destroy(options);
  }
}
