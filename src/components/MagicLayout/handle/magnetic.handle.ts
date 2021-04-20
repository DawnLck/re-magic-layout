/**
 * Magnetic
 * 磁吸的一些无状态逻辑
 */

export type DirectionData = {
  direction: 'horizontal' | 'vertical';
  related: [string, string];
  towards: 'right' | 'left' | 'top' | 'bottom';
  delta: number;
  standardDelta: number;
};

/**
 * 获取方向上的数据
 * @param deltaX 主轴偏移值
 * @param deltaY 交叉轴偏移值
 * @returns
 */
export const getDirection = (deltaX: number, deltaY: number): DirectionData => {
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    return {
      direction: 'horizontal',
      related: ['left', 'right'],
      towards: deltaX > 0 ? 'right' : 'left',
      delta: deltaX,
      standardDelta: deltaX > 0 ? 1 : -1,
    };
  } else {
    return {
      direction: 'vertical',
      related: ['top', 'bottom'],
      towards: deltaY > 0 ? 'bottom' : 'top',
      delta: deltaY,
      standardDelta: deltaY > 0 ? 1 : -1,
    };
  }
};
