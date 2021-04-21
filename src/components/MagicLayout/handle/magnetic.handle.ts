/**
 * Magnetic
 * 磁吸的一些无状态逻辑
 */

const MagneticThreshold = 10.1;

export type DirectionData = {
  direction: 'horizontal' | 'vertical';
  related: [string, string];
  towards: 'right' | 'left' | 'top' | 'bottom';
  delta: number;
  standardDelta: number;
};

import { buildBoundaries } from '@/utils';
import { MagicDraggingData } from '../../typings';

/**
 * 获取方向的数据
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

export const calcMagnetic = (
  directionData: DirectionData,
  target: MagicDraggingData,
  compares: MagicDraggingData[],
) => {
  const {
    related: relatedBounds,
    delta: directionDelta,
    standardDelta,
    towards,
  } = directionData;
  let magneticArray: any = [];

  const _target = target[towards];

  // 获取移动方向上与各个自元素边界的距离
  compares.forEach((item: any) => {
    relatedBounds.forEach((bound) => {
      const _compare = item[bound];
      const _distance = Math.abs(_compare - _target);
      magneticArray.push({ distance: _distance, bound, value: _compare });
    });
  });

  // 排序，获取距离最短的边界
  magneticArray = magneticArray.sort(
    (a: any, b: any) => a.distance - b.distance,
  );
  const _adjust = magneticArray[0];

  const { width, height } = target;

  // 获取调整后的值
  if (_adjust && _adjust.distance < MagneticThreshold) {
    // debugger;
    const { bound, value } = _adjust;
    switch (towards) {
      case 'right':
        target.x = value - width;
        break;
      case 'left':
        target.x = value;
        break;
      case 'top':
        target.y = value;
        break;
      case 'bottom':
        target.y = value - height;
        break;
    }
    return {
      ...target,
      x: target.x,
      y: target.y,
      ...buildBoundaries(target.x, target.y, target.width, target.height),
    };
  }

  return null;
};
