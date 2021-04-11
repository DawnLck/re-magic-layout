/**
 * GuideLines
 */
import React from 'react';
import GuideLine from './GuideLine';

type LineType = {
  type: 'hLine' | 'vLine';
  start: [number, number];
  end: [number, number];
};

export const buildLines = (target: any, compares: any[]): LineType[] => {
  // console.log(target, compares);
  return [...analyzeHorizontal(target, compares)];
};

/**
 * initLine 初始化参考线的坐标
 * @param map
 * @param target
 * @param key
 * @returns
 */
const initLine = (
  map: any,
  target: any,
  key: 'top' | 'bottom' | 'right' | 'left',
) => {
  const value = target[key];
  if (map[value]) return;
  const { top, bottom, left, right } = target;
  if (Boundary.vertical.includes(key)) {
    map[value] = {
      top,
      bottom,
      right: value,
      left: value,
      type: 'vLine',
    };
  } else if (Boundary.horizontal.includes(key)) {
    map[value] = {
      left,
      right,
      top: value,
      bottom: value,
      type: 'hLine',
    };
  } else {
    window.alert('Guildline need a type between hLine or vLine');
  }
};

/**
 * 水平辅助线分析
 * @param target 目标元素
 * @param compares 对照元素组
 * @description 对比元素的上边界和下边界即可
 */

const adjustLine = (origin: any, item: any) => {
  let { left, right, top, bottom, type } = origin;
  const { top: _top, bottom: _bottom, left: _left, right: _right } = item;
  if (type === 'hLine') {
    origin.left = Math.min(left, _left);
    origin.right = Math.max(right, _right);
  } else {
    origin.top = Math.min(top, _top);
    origin.bottom = Math.max(bottom, _bottom);
  }
};

const Boundary = {
  horizontal: ['top', 'bottom'],
  vertical: ['right', 'left'],
  all: ['top', 'bottom', 'right', 'left'],
};

const HorizontalProperties = ['top', 'bottom'];
const VerticalProperties = ['right', 'left'];

const analyzeHorizontal = (target: any, compares: any[]) => {
  // TODO: 获取上边界的辅助线
  const { top, bottom, left, right } = target;
  let horizontalLines: any = {};

  compares.forEach((item) => {
    const { top: _top, bottom: _bottom, left: _left, right: _right } = item;

    if (top === _top || top === _bottom) {
      initLine(horizontalLines, target, 'top');
      adjustLine(horizontalLines[top], item);
    }
    if (bottom === _bottom || bottom === _top) {
      initLine(horizontalLines, target, 'bottom');
      adjustLine(horizontalLines[bottom], item);
    }
  });

  console.log({ horizontalLines });
  // console.log(topLine);

  const result = Object.entries(horizontalLines).map((line: any) => {
    const { left, right, top, bottom, type } = line[1];
    return {
      type,
      start: [left, top],
      end: [right, bottom],
    } as LineType;
  });
  return result;
};

const GuideLines = (props: any) => {
  const { target, compares } = props;
  if (!target || !compares) return <></>;
  const lines = buildLines(target, compares);
  return (
    <div className="guide-lines">
      {lines.map((line) => {
        return (
          <GuideLine
            type={line.type}
            start={line.start}
            end={line.end}
          ></GuideLine>
        );
      })}
    </div>
  );
};

export default GuideLines;
