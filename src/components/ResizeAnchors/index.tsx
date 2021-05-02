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

type AnchorsTypes =
  | 'top'
  | 'bottom'
  | 'right'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'topLeft'
  | 'bottomLeft';

const Anchors: { [key: string]: [number, number] } = {
  top: [0, 1],
  bottom: [0, 1],
  right: [1, 0],
  left: [1, 0],
  topRight: [1, 1],
  bottomRight: [1, 1],
  topLeft: [1, 1],
  bottomLeft: [1, 1],
};

class ResizeAnchors extends Component<ResizeAnchorsProps> {
  static defaultProps = {
    show: true,
  };

  handleAnchorDrag = (
    e: DraggableEvent,
    data: DraggableData,
    type: AnchorsTypes,
  ) => {
    // e.stopPropagation();
    (e as MouseEvent).stopImmediatePropagation();
    e.preventDefault();

    const { width, height } = this.props;
    const { deltaX, deltaY } = data;
    const _width = width + Anchors[type][0] * deltaX;
    const _height = height + Anchors[type][1] * deltaY;

    // 把拖拽的改动传回上层，让ChildWrapper自己调整自己的宽高，这里只负责计算
    this.props.onChange(_width, _height);
  };

  render() {
    const hidden = !this.props.show;
    return (
      <div className={classNames({ 'layout-child-resize': true, hidden })}>
        {Object.keys(Anchors).map((item: any) => {
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
