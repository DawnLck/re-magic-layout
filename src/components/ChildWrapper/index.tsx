/**
 * ChildWrapper
 */
import React, { Component, cloneElement, ReactNode } from 'react';
import Dragbble, {
  DraggableData,
  DraggableCore,
  DraggableEvent,
} from 'react-draggable';
import { classNames, camelToLine } from '@/utils';

import './index.less';

interface ChildWrapperProps {
  className: string | undefined;
  width?: number;
  height?: number;

  selected: boolean;
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
  uid: string | number | null;
  state: ChildWrapperState;
  ele: ReactNode;
};

const ResizeTypes = ['top', 'right', 'bottom', 'left'];

const ScaleTypes = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];

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
      uid: this.props.uid,
      state: state,
      ele: this,
    });
  };

  handleClick = (e: any) => {
    console.log('[ChildWrapper] HandleClick: ', e);

    const { uid } = this.props;
    // const { width, height } = this.state;
    const data = {
      uid,
      state: this.state,
      ele: this,
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

  /**
   * 处理resize控制元素点的Drag事件
   */
  handleResizeDrag = (e: DraggableEvent, data: DraggableData, type: string) => {
    // e.stopPropagation();
    (e as MouseEvent).stopImmediatePropagation();
    e.preventDefault();

    const { width, height } = this.state;
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

    this.setState({ width: _width, height: _height });
  };

  componentDidMount() {
    this.props.handleStateUpdate({
      uid: this.props.uid,
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
            style: {
              width: '100%',
              height: '100%',
            },
          })}
          <div
            className={classNames({ 'layout-child-resize': true, selected })}
          >
            {[...ResizeTypes, ...ScaleTypes].map((item) => {
              return (
                <DraggableCore
                  onDrag={(e, v) => {
                    this.handleResizeDrag(e, v, item);
                  }}
                  key={item}
                >
                  <div
                    className={classNames(['resize-item', camelToLine(item)])}
                  >
                    {item}
                  </div>
                </DraggableCore>
              );
            })}
          </div>
        </div>
      </Dragbble>
    );
  }
}

export default ChildWrapper;
