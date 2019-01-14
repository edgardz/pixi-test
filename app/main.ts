import { Application, Container } from 'pixi.js';

import BaseScene from './scenes/BaseScene';
import MenuScene from './scenes/MenuScene';
import CardsScene from './scenes/CardsScene';
import RichTextScene from './scenes/RichTextScene';
import ParticlesScene from './scenes/ParticlesScene';

import { colors } from './utils/constants';
import usePassiveEvent from './utils/use-passive-event';

export default class MainApplication extends Application {
  activeScene: BaseScene;
  sceneContainer: Container;

  scenes = {
    menu: MenuScene,
    cards: CardsScene,
    richText: RichTextScene,
    particles: ParticlesScene
  };

  constructor() {
    super(window.innerWidth, window.innerHeight, {
      backgroundColor: colors.white,
      autoResize: true,
      antialias: true,
      resolution: window.devicePixelRatio
    });

    document.querySelector('#app').appendChild(this.view);
    window.addEventListener('resize', this.onResize, usePassiveEvent());

    this.sceneContainer = new Container();
    this.stage.addChild(this.sceneContainer);

    this.setActiveScene(this.scenes.menu);
  }

  setActiveScene = Scene => {
    if (this.activeScene) {
      this.sceneContainer.removeChild(this.activeScene);
      this.activeScene.destroy(true);
    }
    this.activeScene = new Scene(this);
    this.sceneContainer.addChild(this.activeScene);
    this.onResize();
  };

  onResize = () => {
    this.renderer.resize(window.innerWidth, window.innerHeight);

    if (this.activeScene) {
      this.activeScene.resize();
    }
  };
}

new MainApplication();
