import { Text } from 'pixi.js';

export default class RichText extends Text {
  constructor(text: string) {
    super(text, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xff1010
    });
  }
}
