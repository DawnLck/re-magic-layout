/**
 * Magnetic
 * 磁吸的一些无状态逻辑
 */
// TODO: 这里可能需要考虑delatX和deltaY同时有值的情况
export const getDirection = (deltaX: number, deltaY: number): string => {
  if (deltaX > 0) return 'right';
  if (deltaX < 0) return 'left';
  if (deltaY > 0) return 'bottom';
  if (deltaY < 0) return 'top';
  return 'null';
};
