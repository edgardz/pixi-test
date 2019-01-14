import { Application, ApplicationOptions } from 'pixi.js';
import Test from './components/Test';

new class Main {
  app: Application;

  settings: ApplicationOptions = {
    backgroundColor: 0xffffff,
    antialias: true
  };

  constructor() {
    this.app = new Application(window.innerWidth, window.innerHeight, this.settings);
    document.querySelector('#app').appendChild(this.app.view);

    // test
    const test: Test = new Test();
    this.app.stage.addChild(test);
    console.log('verify source map.');
  }
}();
