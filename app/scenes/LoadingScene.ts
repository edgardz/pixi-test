import { loader, Text } from 'pixi.js';

import BaseScene from './BaseScene';

import { colors } from '../utils/constants';

export default class LoadingScene extends BaseScene {
  copy: Text;

  constructor(app) {
    super(app);

    loader
      .add('cards', require('../assets/cards.png'))
      .add('fire', require('../assets/fire.png'))
      .on('progress', this.onProgress)
      .load(this.onComplete);

    this.copy = new Text('', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: colors.black
    });

    this.addChild(this.copy);
  }

  onProgress = loader => {
    this.copy.text = `${loader.progress}%`;
    this.resize();
  };

  onComplete = () => {
    this.app.setActiveScene(this.app.scenes.menu);
  };

  public resize() {
    super.resize();

    this.copy.position.set(
      this.rendererSize.width / 2 - this.copy.width / 2,
      this.rendererSize.height / 2 - this.copy.height / 2
    );
  }
}
