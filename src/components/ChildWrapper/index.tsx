/**
 * ChildWrapper
 */
import React, { Component, cloneElement, ReactNode } from 'react';
import Dragbble, { DraggableData } from 'react-draggable';
import { classNames } from '@/utils';

import './index.less';

interface ChildWrapperProps {
  className: string | undefined;
  width?: number;
  height?: number;

  selected: boolean;
  uid: any;
  border?: number;
  handleClick: (data: ChildData) => any;
}

interface ChildWrapperState {
  width?: number;
  height?: number;
  deltaPosition?: {
    x: number;
    y: number;
  };
  border?: number | string;
  zIndex: number;
}

type ChildData = {
  uid: string | number | null;
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
      border: 1,
      zIndex: 1,
    };
  }

  updateState = (state: any) => {
    this.setState(state);
  };

  handleClick = (e: any) => {
    const { uid } = this.props;
    // const { width, height } = this.state;
    const data = {
      uid,
      state: this.state,
      ele: this,
    };

    // console.log('Child Click: ', e);

    this.props.handleClick(data);

    e.stopPropagation();
  };

  handleDrag = (e: any, data: DraggableData) => {
    // console.log({ handledragData: data });
    this.setState({
      deltaPosition: {
        x: data.x,
        y: data.y,
      },
    });

    // Drag 会触发一次Click事件，形成事件的上传，不过有个地方需要完善，用户如果拖出范围，click事件就会丢失，导致位置没有及时刷新
  };

  componentDidMount() {}

  render() {
    const { children, className, selected } = this.props;
    const { width, height, border, zIndex } = this.state;
    return (
      <Dragbble bounds="parent" onDrag={this.handleDrag}>
        <div
          onClick={this.handleClick}
          className={classNames(className, {
            'layout-child': true,
            selected: selected,
          })}
          style={{ width, height, borderWidth: border, zIndex }}
        >
          {cloneElement(children as any, {
            style: {
              width: '100%',
              height: '100%',
            },
          })}
        </div>
      </Dragbble>
    );
  }
}

export default ChildWrapper;
