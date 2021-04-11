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

class GuideLine extends Component<GuideLineProps> {
  static defaultProps = {
    type: 'hLine',
  };
  render() {
    const { start, end, type } = this.props;
    const [startX, startY] = start;
    const [endX, endY] = end;

    let style = {
      width: 1,
      height: 1,
      left: Math.min(startX, endX),
      top: Math.min(startY, endY),
    };

    if (type === 'hLine') {
      style.width = Math.abs(startX - endX);
    } else {
      style.height = Math.abs(startY - endY);
    }

    return (
      <span
        className={classNames(['guide-line', camelToLine(type)])}
        style={style}
      ></span>
    );
  }
}

export default GuideLine;
