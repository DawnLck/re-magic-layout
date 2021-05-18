/**
 * Magnetic
 * 磁吸的一些无状态逻辑
 */

import { buildBoundaries } from '@/utils';
import { MagicDraggingData } from '../../typings';

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
): MagneticData[] => {
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

const findNearstMag = (
  type: 'horizontal' | 'vertical',
  target: MagicDraggingData,
  compares: MagicDraggingData[],
) => {
  const magArray = calcAxisMagnetic(type, target, compares);
  let tem = magArray[0] || {};
  magArray.forEach((item) => {
    if (item.distance < tem.distance) tem = item;
  });
  return tem;
};

export const calcMagnetic = (
  target: MagicDraggingData,
  compares: MagicDraggingData[],
) => {
  let horizontalNearst = findNearstMag('horizontal', target, compares);
  let verticalNearst = findNearstMag('vertical', target, compares);

  // console.log({ horizontalNearst, verticalNearst });

  // // 排序，获取距离最短的边界
  // magneticArray = magneticArray.sort(
  //   (a: any, b: any) => a.distance - b.distance,
  // );
  // const _adjust = magneticArray[0];
  const { lastX, lastY, width, height } = target;
  let adjustX = lastX,
    adjustY = lastY;

  if (horizontalNearst.distance < MagneticThreshold) {
    adjustX =
      horizontalNearst.value +
      (horizontalNearst.targetDirection === 'right' ? -width : 0);
  }

  if (verticalNearst.distance < MagneticThreshold) {
    adjustY =
      verticalNearst.value +
      (verticalNearst.targetDirection === 'bottom' ? -height : 0);
  }

  return {
    ...target,
    lastX: adjustX,
    lastY: adjustY,
    ...buildBoundaries(adjustX, adjustY, target.width, target.height),
  };
};
