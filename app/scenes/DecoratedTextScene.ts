import { loader, Spritesheet, Texture } from 'pixi.js';

import BaseScene from './BaseScene';

import DecoratedText from '../components/DecoratedText';
import shuffleArray from '../utils/shuffle-array';
import { colors } from '../utils/constants';

export default class DecoratedTextScene extends BaseScene {
  spriteSheet: Spritesheet;
  richText: DecoratedText;
  interval: any;
  icons: Texture[];
  copies: string[] = [
    'あなたは勝ちます',
    'Lorem Ipsum',
    'Ranking: 1',
    "Time's Up!",
    '2018/01/15',
    'Wednesday',
    'Good Job!',
    'Try Again.',
    'Super!!!',
    'победил',
    '180.25',
    'فزت',
    '42'
  ];

  constructor(app) {
    super(app);

    this.spriteSheet = new Spritesheet(loader.resources['icons'].texture.baseTexture, require('../assets/icons.json'));
    this.spriteSheet.parse(() => {
      this.icons = Object.keys(this.spriteSheet.textures).map(key => this.spriteSheet.textures[key]);
      this.richText = new DecoratedText();
      this.interval = setInterval(this.randomize, 2000);
      this.randomize();
      this.addChild(this.richText);
    });
  }

  randomize = () => {
    const elements = shuffleArray([...this.icons, ...this.copies]).slice(0, 3);
    const options = {
      fontSize: 12 + Math.floor(Math.random() * 20),
      fill: shuffleArray([colors.black, colors.blue, colors.green])[0]
    };
    this.richText.update(elements.slice(0, 3), options);
    this.resize();
  };

  public resize() {
    super.resize();
    this.richText.position.set(
      this.rendererSize.width / 2 - this.richText.width / 2,
      this.rendererSize.height / 2 - this.richText.height / 2
    );
  }

  public destroy(options) {
    clearInterval(this.interval);
    this.spriteSheet.destroy();
    super.destroy(options);
  }
}
