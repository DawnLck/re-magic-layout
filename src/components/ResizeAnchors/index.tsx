/**
 * Resize Anchors
 * @description 渲染可以改变组件大小的控制锚点
 * @more 分成两类，一个是保留原来组件大小的resize（优先），一个是跟随变化的scale（后面再做），都是信息传出
 */

import React, { Component } from 'react';

import { classNames, camelToLine } from '@/utils';

import { DraggableCore, DraggableEvent, DraggableData } from 'react-draggable';

import './index.less';

interface ResizeAnchorsProps {
  show?: boolean;
  width: number;
  height: number;
  onChange: (width: number, height: number) => void;
}

const Anchors = [
  'top',
  'right',
  'bottom',
  'left',
  'topLeft',
  'topRight',
  'bottomRight',
  'bottomLeft',
];

class ResizeAnchors extends Component<ResizeAnchorsProps> {
  static defaultProps = {
    show: true,
  };

  handleAnchorDrag = (e: DraggableEvent, data: DraggableData, type: string) => {
    // e.stopPropagation();
    (e as MouseEvent).stopImmediatePropagation();
    e.preventDefault();

    const { width, height } = this.props;
    const { deltaX, deltaY } = data;
    let _width = width,
      _height = height;

    if (['top', 'bottom'].includes(type)) _height += deltaY;
    else if (['right', 'left'].includes(type)) _width += deltaX;
    else if (
      ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'].includes(type)
    ) {
      _width += deltaX;
      _height += deltaY;
    } else {
      console.warn(
        `Type ${type} is not belong default types like [top, ...., bottomRight]`,
      );
    }

    this.props.onChange(_width, _height);
  };

  render() {
    const { show, onChange } = this.props;
    const hidden = !this.props.show;
    return (
      <div className={classNames({ 'layout-child-resize': true, hidden })}>
        {Anchors.map((item) => {
          return (
            <DraggableCore
              onDrag={(e, v) => {
                this.handleAnchorDrag(e, v, item);
              }}
              key={item}
            >
              <div className={classNames(['resize-item', camelToLine(item)])}>
                {item}
              </div>
            </DraggableCore>
          );
        })}
      </div>
    );
  }
}

export default ResizeAnchors;
