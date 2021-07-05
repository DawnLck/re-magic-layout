/**
 * Guide Line
 * @description 子元素移动时渲染的参考线
 */

import React, { Component } from 'react';
import './index.less';
import { classNames, camelToLine } from '@/utils';

export interface GuideLineProps {
  start: [number, number];
  end: [number, number];
  type?: 'hLine' | 'vLine';
}

const GuideLine = (props: GuideLineProps) => {
  const { start, end, type } = props;
  const [startX, startY] = start;
  const [endX, endY] = end;

  // TOFIX: 这里可能还是会是会出现辅助线消失的问题，需要后面继续跟进修复
  const style = {
    width: type === 'hLine' ? Math.abs(startX - endX) || 0 : 1,
    height: type === 'hLine' ? 1 : Math.abs(startY - endY) || 0,
    left: Math.min(startX, endX),
    top: Math.min(startY, endY),
  };

  return (
    <span
      className={classNames(['guide-line', camelToLine(type)])}
      style={style}
    ></span>
  );
};

export default GuideLine;
