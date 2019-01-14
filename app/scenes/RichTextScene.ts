import BaseScene from './BaseScene';

import RichText from '../components/RichText';

export default class RichTextScene extends BaseScene {
  constructor(app) {
    super(app);

    this.addChild(new RichText('RichText Scene'));
  }
}
