import { Application } from 'pixi.js';

import StatsJS = require('stats.js');

export default class Stats {
  app: Application;
  stats: StatsJS;

  constructor(app: Application) {
    this.app = app;
    this.stats = new StatsJS();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.app.ticker.add(this.onTick);
    document.body.appendChild(this.stats.dom);
  }

  onTick = () => this.stats.update();

  public destroy() {
    this.app.ticker.remove(this.onTick);
    document.body.removeChild(this.stats.dom);
  }
}
