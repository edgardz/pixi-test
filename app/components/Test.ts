import { Text } from 'pixi.js';

export default class Test extends Text {
  constructor() {
    super('This is a test.', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xff1010,
      align: 'center'
    });
  }
}
