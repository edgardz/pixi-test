import { DestroyOptions } from 'pixi.js';

export default (container, options: boolean | DestroyOptions = true) => {
  while (container.children.length) {
    const child = container.getChildAt(0);
    container.removeChild(child);
    child.removeAllListeners();
    child.destroy(options);
  }
};
