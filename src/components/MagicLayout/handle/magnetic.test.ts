import { horizontalY } from './magnetic.handle';

const magnetic = require('./magnetic.handle');
const {
  calcAxisMagnetic,
  calcMagnetic,
  getMoveDirection,
  horizontalX,
} = magnetic;
const target = {
  // 基础属性
  width: 80,
  height: 80,
  x: 300,
  y: 80,

  // 拖拽属性
  deltaX: 0,
  deltaY: -1, // 向上移动一个像素的距离
  lastX: 300,
  lastY: 79,

  // 当前盒子边界
  top: 79,
  right: 380,
  bottom: 159,
  left: 300,
};

const targetToBottom = {
  // 基础属性
  width: 80,
  height: 80,
  x: 300,
  y: 80,

  // 拖拽属性
  deltaX: 0,
  deltaY: 1, // 向下移动一个像素的距离
  lastX: 300,
  lastY: 79,

  // 当前盒子边界
  top: 79,
  right: 380,
  bottom: 159,
  left: 300,
};
const compares = [
  {
    top: 20,
    bottom: 80,

    hc: 80,
    height: 60,
    left: 20,
    right: 140,

    uid: 'uid_test_008',
    vc: 50,
    width: 120,
    x: 20,
    y: 20,
  },
];

test('getMoveDirection', () => {
  expect(getMoveDirection(0, -1)).toEqual({
    hDirection: undefined,
    vDirection: 'top',
  });
});

test('calcAxisMagnetic', () => {
  expect(calcAxisMagnetic('vertical', target, compares)).toEqual([
    {
      compareDirection: 'top',
      distance: -59,
      targetDirection: 'top',
      value: 20,
    },
    {
      compareDirection: 'bottom',
      distance: 1,
      targetDirection: 'top',
      value: 80,
    },
    {
      compareDirection: 'top',
      distance: -139,
      targetDirection: 'bottom',
      value: 20,
    },
    {
      compareDirection: 'bottom',
      distance: -79,
      targetDirection: 'bottom',
      value: 80,
    },
  ]);
});

test('horzontalY', () => {
  expect(horizontalY(targetToBottom, compares, 'bottom')).toBe(79);
});
