import { Container, Application, Point } from 'pixi.js';

import MainApplication from '../main';

import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';
import CloseButton from '../components/CloseButton';

export default class BaseScene extends Container {
  app: MainApplication;
  closeButton: CloseButton;
  rendererSize: Point;

  constructor(app, showCloseButton = true) {
    super();
    this.app = app;

    if (showCloseButton) {
      this.closeButton = new CloseButton();
      this.closeButton.on('pointerup', this.close);

      this.addChild(this.closeButton);
    }
  }

  close = () => {
    this.app.setActiveScene(this.app.scenes.menu);
  };

  public resize() {
    const { renderer } = this.app;
    this.rendererSize = new Point(renderer.width / renderer.resolution, renderer.height / renderer.resolution);

    if (this.closeButton) {
      this.closeButton.x = this.rendererSize.x - this.closeButton.width - 10;
      this.closeButton.y = 10;
    }
  }

  public destroy(options = true) {
    removeAndDestroyAllChildren(this, options);
    super.destroy(options);
  }
}
