export default (container, options = true) => {
  while (container.children.length) {
    const child = container.getChildAt(0);
    container.removeChild(child);
    child.removeAllListeners();
    child.destroy(options);
  }
};
