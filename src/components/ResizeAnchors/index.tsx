/**
 * Resize Anchors
 * @description 渲染可以改变组件大小的控制锚点
 * @more 分成两类，一个是保留原来组件大小的resize（优先），一个是跟随变化的scale（后面再做），都是信息传出
 */

import React, { Component } from 'react';

import { classNames, camelToLine, clearEvent } from '@/utils';

import { DraggableCore, DraggableEvent, DraggableData } from 'react-draggable';

import './index.less';

interface ResizeAnchorsProps {
  show?: boolean;
  width: number;
  height: number;
  onChange: (data: {
    width: number;
    height: number;
    deltaX: number;
    deltaY: number;
  }) => void;
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

type AnchorsStruct = {
  [key: string]: {
    relative?: [number, number];
    matrix: [number, number];
  };
};

const Anchors: AnchorsStruct = {
  top: {
    relative: [0, 1],
    matrix: [0, -1],
  },
  bottom: {
    matrix: [0, 1],
  },
  right: {
    matrix: [1, 0],
  },
  left: {
    relative: [1, 0],
    matrix: [-1, 0],
  },
  topRight: {
    relative: [0, 1],
    matrix: [1, -1],
  },
  bottomRight: {
    matrix: [1, 1],
  },
  topLeft: {
    matrix: [-1, -1],
    relative: [1, 1],
  },
  bottomLeft: {
    relative: [1, 0],
    matrix: [-1, 1],
  },
};

class ResizeAnchors extends Component<ResizeAnchorsProps> {
  static defaultProps = {
    show: true,
  };

  private $cursorX: number = 0;
  private $cursorY: number = 0;

  handleAnchorDrag = (e: any, data: DraggableData, type: AnchorsTypes) => {
    // e.stopPropagation();
    (e as MouseEvent).stopImmediatePropagation();
    e.preventDefault();

    const { width, height } = this.props;

    const { deltaX, deltaY, lastX, lastY } = data;
    const { matrix, relative } = Anchors[type];

    const cursorDeltaX = e.clientX - this.$cursorX;
    const cursorDeltaY = e.clientY - this.$cursorY;

    const _width = width + matrix[0] * cursorDeltaX;
    const _height = height + matrix[1] * cursorDeltaY;

    // 把拖拽的改动传回上层，让ChildWrapper自己调整自己的宽高，这里只负责计算
    this.props.onChange({
      width: _width,
      height: _height,
      deltaX: relative && relative[0] ? e.clientX - this.$cursorX : 0,
      deltaY: relative && relative[1] ? e.clientY - this.$cursorY : 0,
    });
    this.$cursorX = e.clientX;
    this.$cursorY = e.clientY;
  };

  handleDragStart = (e: any, data: DraggableData) => {
    this.$cursorX = e.clientX || e.pageX;
    this.$cursorY = e.clientY || e.pageY;
  };
  handleDragStop = () => {};

  render() {
    const hidden = !this.props.show;
    return (
      <div className={classNames({ 'layout-child-resize': true, hidden })}>
        {Object.keys(Anchors).map((item: any) => {
          return (
            <DraggableCore
              onStart={this.handleDragStart}
              onDrag={(e, v) => {
                this.handleAnchorDrag(e, v, item);
              }}
              onStop={this.handleDragStop}
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
