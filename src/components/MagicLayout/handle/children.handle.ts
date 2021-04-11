/**
 * Children handle
 */

export const collectChildrenData = (childNodes: any[]) => {
  return Array.from(childNodes).map((child: any, i: number) =>
    collectChildData(child),
  );
};

export const collectChildData = (child: HTMLElement) => {
  const { x: datasetX, y: datasetY, uid } = child.dataset;
  const width = child.clientWidth;
  const height = child.clientHeight;

  const x = Number(datasetX) || 0;
  const y = Number(datasetY) || 0;

  return {
    child,
    uid,
    x,
    y,
    width,
    height,
    left: x,
    right: x + width,
    top: y,
    bottom: y + height,
    hc: x + width / 2,
    vc: y + height / 2,
  };
};
