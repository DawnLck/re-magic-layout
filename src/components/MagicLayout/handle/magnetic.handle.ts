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

type Direction = 'left' | 'right' | 'top' | 'bottom';

export type MagneticData = {
  distance: number;
  targetDirection: Direction;
  compareDirection: Direction;
  value: number;
};
import { buildBoundaries } from '@/utils';
import { MagicDraggingData } from '../../typings';

const AsixMap = {
  horizontal: {
    directions: ['left', 'right'],
  },
  vertical: {
    directions: ['top', 'bottom'],
  },
};

/**
 * 获取方向的数据
 * @param deltaX 主轴偏移值
 * @param deltaY 交叉轴偏移值
 * @deprecated 废弃了，最终发现吸附不会只考虑一个方向，而是多个方向都要考虑
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

const calcAxisMagnetic = (
  axis: 'horizontal' | 'vertical',
  target: MagicDraggingData,
  compares: MagicDraggingData[],
): any[] => {
  let collects: MagneticData[] = [];
  const directions = AsixMap[axis].directions;

  directions.forEach((direction) => {
    const _target = target[direction as Direction];

    // 获取移动方向上与各个自元素边界的距离
    compares.forEach((item: any) => {
      directions.forEach((bound) => {
        const _compare = item[bound];
        const _distance = Math.abs(_compare - _target);
        collects.push({
          distance: _distance,
          targetDirection: direction as Direction,
          compareDirection: bound as Direction,
          value: _compare,
        });
      });
    });
  });

  return collects;
};

export const calcMagnetic = (
  directionData: DirectionData,
  target: MagicDraggingData,
  compares: MagicDraggingData[],
) => {
  let magneticArray: any = [
    ...calcAxisMagnetic('horizontal', target, compares),
    ...calcAxisMagnetic('vertical', target, compares),
  ];

  // 排序，获取距离最短的边界
  magneticArray = magneticArray.sort(
    (a: any, b: any) => a.distance - b.distance,
  );
  const _adjust = magneticArray[0];

  const { width, height } = target;

  // 获取调整后的值
  if (_adjust && _adjust.distance < MagneticThreshold) {
    // debugger;
    target.x = target.lastX;
    target.y = target.lastY;
    const { targetDirection, value } = _adjust;
    switch (targetDirection) {
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
