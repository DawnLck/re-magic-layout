/**
 * Magnetic
 * 磁吸的一些无状态逻辑
 */

import { buildBoundaries } from '@/utils';
import { MagicDraggingData } from '../../typings';

const MagneticThreshold = 10.1;

type Direction = 'left' | 'right' | 'top' | 'bottom';
type Axis = 'horizontal' | 'vertical';

export type DirectionData = {
  direction: Axis;
  related: [string, string];
  towards: Direction;
  delta: number;
  standardDelta: number;
};

export type MagneticData = {
  distance: number;
  targetDirection: Direction;
  compareDirection: Direction;
  value: number;
};

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
 */
export const getMoveDirection = (deltaX: number, deltaY: number) => {
  let hDirection, vDirection;

  if (deltaX !== 0) {
    hDirection = deltaX > 0 ? 'right' : 'left';
  }
  if (deltaY !== 0) {
    vDirection = deltaY > 0 ? 'bottom' : 'top';
  }
  return {
    hDirection,
    vDirection,
  };
};

/**
 * 获取每个对照元素和目标元素的边界距离
 */
export const calcAxisMagnetic = (
  axis: 'horizontal' | 'vertical',
  target: MagicDraggingData,
  compares: MagicDraggingData[],
): MagneticData[] => {
  let collects: MagneticData[] = [];
  const directions = AsixMap[axis].directions;

  // 对对照组中的每一个元素进行遍历
  compares.forEach((item: any) => {
    // 第一层遍历：目标元素的两个边界
    directions.forEach((direction) => {
      const _targetValue = target[direction as Direction];

      // 第二层遍历：对照元素的两个边界
      directions.forEach((bound) => {
        const _compareValue = item[bound];
        const _distance = _compareValue - _targetValue;
        // 我们只考虑当前方向上，取正的情况
        collects.push({
          distance: _distance,
          targetDirection: direction as Direction,
          compareDirection: bound as Direction,
          value: _compareValue,
        });
      });
    });
  });

  return collects;
};

export const horizontalX = (
  target: MagicDraggingData,
  compares: MagicDraggingData[],
  moveDirection: Direction,
): number => {
  const { lastX = 0 } = target;
  if (!moveDirection) return lastX;

  let magArray = calcAxisMagnetic('horizontal', target, compares);

  magArray =
    moveDirection === 'left'
      ? magArray.filter((item) => item.distance < 0)
      : magArray.filter((item) => item.distance > 0);

  let nearst = magArray[0] || {};

  magArray.forEach((item) => {
    if (Math.abs(item.distance) < Math.abs(nearst.distance)) nearst = item;
  });

  console.log({ magArray, nearst });

  // 如果最短的距离仍旧比阈值大，则放弃
  if (!nearst || Math.abs(nearst.distance) > MagneticThreshold) return lastX;

  return nearst.targetDirection === 'right'
    ? nearst.value - target.width
    : nearst.value;
};

export const horizontalY = (
  target: MagicDraggingData,
  compares: MagicDraggingData[],
  moveDirection: Direction,
) => {
  const { lastY = 0 } = target;

  if (!moveDirection) return lastY;

  let magArray = calcAxisMagnetic('vertical', target, compares);

  magArray =
    moveDirection === 'top'
      ? magArray.filter((item) => item.distance < 0)
      : magArray.filter((item) => item.distance > 0);

  let nearst = magArray[0] || {};

  magArray.forEach((item) => {
    if (Math.abs(item.distance) < Math.abs(nearst.distance)) nearst = item;
  });

  // 如果最短的距离仍旧比阈值大，则放弃
  if (!nearst || Math.abs(nearst.distance) > MagneticThreshold) return lastY;

  return nearst.targetDirection === 'bottom'
    ? nearst.value - target.height
    : nearst.value;
};

export const calcMagnetic = (
  target: MagicDraggingData,
  compares: MagicDraggingData[],
) => {
  if (target.deltaX || target.deltaY) {
    console.log(target, compares);
  }

  const { deltaX = 0, deltaY = 0 } = target;
  // 获取移动方向
  const { hDirection, vDirection } = getMoveDirection(deltaX, deltaY);

  // 分别从水平方向和垂直方向上探索吸附的可能性
  const adjustX = horizontalX(target, compares, hDirection as Direction);
  const adjustY = horizontalY(target, compares, vDirection as Direction);

  return {
    ...target,
    lastX: adjustX,
    lastY: adjustY,
    ...buildBoundaries(adjustX, adjustY, target.width, target.height),
  };
};
