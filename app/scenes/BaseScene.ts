import { Container, Application, Point, Rectangle } from 'pixi.js';

import MainApplication from '../main';

import removeAndDestroyAllChildren from '../utils/remove-and-destroy-all-children';
import CloseButton from '../components/CloseButton';

export default class BaseScene extends Container {
  app: MainApplication;
  closeButton: CloseButton;
  rendererSize: Rectangle;

  constructor(app, showCloseButton = true) {
    super();
    this.app = app;

    if (showCloseButton) {
      this.closeButton = new CloseButton();
      this.closeButton.on('pointerup', this.close);

      this.addChild(this.closeButton);
    }

    this.setRendererSize();
  }

  close = () => {
    this.app.setActiveScene(this.app.scenes.menu);
  };

  setRendererSize = () => {
    const { renderer } = this.app;
    this.rendererSize = new Rectangle(
      0,
      0,
      renderer.width / renderer.resolution,
      renderer.height / renderer.resolution
    );
  };

  public resize() {
    this.setRendererSize();

    if (this.closeButton) {
      this.removeChild(this.closeButton);
      this.closeButton.x = this.rendererSize.width - this.closeButton.width - 10;
      this.closeButton.y = 10;
      this.addChild(this.closeButton);
    }
  }

  public destroy(options = true) {
    removeAndDestroyAllChildren(this, options);
    super.destroy(options);
  }
}
