/**
 * GuideLines
 */
// import React from 'react';
import GuideLine from './GuideLine';

type LineType = {
  type: 'hLine' | 'vLine';
  start: [number, number];
  end: [number, number];
};

const Boundary: any = {
  horizontal: ['top', 'bottom'],
  vertical: ['right', 'left'],
  top: ['top', 'bottom'],
  bottom: ['top', 'bottom'],
  left: ['left', 'right'],
  right: ['left', 'right'],
  all: ['top', 'bottom', 'right', 'left'],
};

export const buildLines = (target: any, compares: any[]): LineType[] => {
  // console.log(target, compares);
  let linesMap: any = {};

  // 循环遍历四个方位，看是不是有对齐的 ♻️
  compares.forEach((item) => {
    Boundary.all.forEach((key: any) => {
      const _target = target[key];
      const _compares = Boundary[key].map((v: any) => item[v]);
      if (_compares.includes(_target)) {
        initLine(linesMap, target, key);
        adjustLine(linesMap[_target], item);
      }
    });
  });

  // 取出最后的Lines数据，生成坐标
  const result = Object.entries(linesMap).map((line: any) => {
    const { left, right, top, bottom, type } = line[1];
    return {
      type,
      start: [left, top],
      end: [right, bottom],
    } as LineType;
  });
  return result;
};

/**
 * initLine 初始化参考线的坐标
 * @returns void
 */
const initLine = (
  map: any,
  target: any,
  key: 'top' | 'bottom' | 'right' | 'left',
) => {
  const value = target[key];
  if (map[value]) return; // 如果已经存在值的映射了，不需要初始化，直接调整辅助线数据
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
 * 辅助线调整
 * @param target 目标元素
 * @param compares 对照元素组
 * @description 调整辅助线的长度
 */
const adjustLine = (origin: any, item: any) => {
  let { left, right, top, bottom, type } = origin;
  const { top: _top, bottom: _bottom, left: _left, right: _right } = item;
  if (type === 'hLine') {
    origin.left = Math.min(left, _left);
    origin.right = Math.max(right, _right);
  } else {
    // vLine
    origin.top = Math.min(top, _top);
    origin.bottom = Math.max(bottom, _bottom);
  }
};

/**
 * GuideLines
 * @param props
 * @returns
 */
const GuideLines = (props: any) => {
  const { target, compares } = props;
  console.log('GuideLines', { target, compares });
  if (!target || !compares) return <></>;
  const lines = buildLines(target, compares);
  return (
    <div className="guide-lines">
      {lines.map((line, index) => {
        return (
          <GuideLine
            key={index}
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
