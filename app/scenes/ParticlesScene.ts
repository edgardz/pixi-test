import BaseScene from './BaseScene';

import RichText from '../components/RichText';

export default class ParticlesScene extends BaseScene {
  constructor(app) {
    super(app);

    this.addChild(new RichText('Particles Scene'));
  }
}
