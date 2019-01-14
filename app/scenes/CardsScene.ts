import BaseScene from './BaseScene';

import RichText from '../components/RichText';

export default class CardsScene extends BaseScene {
  constructor(app) {
    super(app);

    this.addChild(new RichText('Cards Scene'));
  }
}
