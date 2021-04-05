/**
 * ChildWrapper
 */
import React, { Component, cloneElement, ReactNode } from 'react';
import Dragbble, { DraggableData, DraggableEvent } from 'react-draggable';

import { classNames } from '@/utils';

import './index.less';

import ResizeAnchors from '../ResizeAnchors';

interface ChildWrapperProps {
  className?: string;
  width?: number;
  height?: number;

  selected?: boolean;
  uid: any;
  border?: number;
  handleClick: (data: ChildData) => void;
  handleStateUpdate: (data: ChildData) => void;
}

export interface ChildWrapperState {
  width: number;
  height: number;
  deltaPosition?: {
    x: number;
    y: number;
  };
  border?: number | string;
  zIndex: number;
}

export type ChildData = {
  key: string | number | null;
  state: ChildWrapperState;
  ele: ReactNode;
};

class ChildWrapper extends Component<ChildWrapperProps, ChildWrapperState> {
  static defaultProps = {
    width: 300,
    height: 200,
  };
  constructor(props: any) {
    super(props);

    const { children } = this.props;

    const {
      style,
      width: propWidth,
      height: propHeight,
    } = (children as any).props;

    const width = (style && style.width) || propWidth;
    const height = (style && style.height) || propHeight;

    this.state = {
      width,
      height,
      deltaPosition: {
        x: 0,
        y: 0,
      },
      border: 0,
      zIndex: 1,
    };
  }

  updateState = (state: ChildWrapperState) => {
    this.setState(state);
    this.props.handleStateUpdate({
      key: this.props.uid,
      state: state,
      ele: this,
    });
  };

  handleClick = (e: any) => {
    console.log('[ChildWrapper] HandleClick: ', e);

    // const { key } = this.props;
    // const { width, height } = this.state;
    const data = {
      key: this.props.uid,
      state: this.state,
      ele: e.target,
    };

    this.props.handleClick(data);

    e.stopPropagation();
  };

  /**
   * 处理子元素的Drag事件
   */
  handleDrag = (e: DraggableEvent, data: DraggableData) => {
    // console.log('Hanlde Drag', { handledragData: data });
    this.setState({
      deltaPosition: {
        x: data.x,
        y: data.y,
      },
    });

    // Drag 会触发一次Click事件，形成事件的上传，不过有个地方需要完善，用户如果拖出范围，click事件就会丢失，导致位置没有及时刷新
  };

  componentDidMount() {
    this.props.handleStateUpdate({
      key: this.props.uid,
      state: this.state,
      ele: this,
    });
  }

  render() {
    const { children, className, selected } = this.props;
    const { width, height, border, zIndex } = this.state;
    return (
      <Dragbble bounds="parent" onDrag={this.handleDrag}>
        <div
          onClick={this.handleClick}
          className={classNames(className, {
            'layout-child': true,
            selected,
          })}
          style={{ width, height, borderWidth: border, zIndex }}
        >
          {cloneElement(children as any, {
            props: {
              width: width,
              height: height,
            },
            style: {
              width: '100%',
              height: '100%',
            },
          })}
          <ResizeAnchors
            width={width}
            height={height}
            show={selected}
            onChange={(width, height) => {
              this.setState({ width, height });
            }}
          ></ResizeAnchors>
        </div>
      </Dragbble>
    );
  }
}

export default ChildWrapper;
