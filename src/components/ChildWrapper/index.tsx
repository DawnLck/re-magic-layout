/**
 * ChildWrapper
 */
import React, {
  Component,
  cloneElement,
  ReactNode,
  MouseEventHandler,
} from 'react';
import Dragbble, { DraggableData, DraggableEvent } from 'react-draggable';

import { classNames, noop } from '@/utils';

import './index.less';

import ResizeAnchors from '../ResizeAnchors';

interface ChildWrapperProps {
  uid?: any;
  className?: string;
  moveGrid?: [number, number] | null;
  selected?: boolean;
  border?: number;
  defaultPosition?: { x: number; y: number };
  onClick: MouseEventHandler;
  onDragStart: () => void;
  onDragging: () => void;
  onDragEnd: () => void;

  // handleClick: (data: ChildData) => void;
  handleStateUpdate: (data: ChildData) => void;
}

export interface ChildWrapperState {
  width: number;
  height: number;
  x: number;
  y: number;
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
    moveGrid: [1, 1],
    onClick: noop,
    onDragStart: noop,
    onDragging: noop,
    onDragEnd: noop,
    handleStateUpdate: noop,
  };
  constructor(props: any) {
    super(props);

    const { children, defaultPosition } = this.props;

    const {
      style,
      width: propWidth,
      height: propHeight,
    } = (children as any).props;

    const width = (style && style.width) || propWidth;
    const height = (style && style.height) || propHeight;

    this.state = {
      x: defaultPosition?.x || 0,
      y: defaultPosition?.y || 0,
      width,
      height,
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

  createChildData = (e: MouseEvent): ChildData => {
    return { key: this.props.uid, state: this.state, ele: e.target };
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

    // this.props.handleClick(data);

    e.stopPropagation();
  };

  /**
   * 处理子元素的Drag事件
   */
  handleDragging = (e: DraggableEvent, data: DraggableData) => {
    // console.log('Hanlde Drag', { handledragData: data });
    this.setState({ x: data.x, y: data.y });

    this.props.onDragging();

    // Drag 会触发一次Click事件，形成事件的上传，不过有个地方需要完善，用户如果拖出范围，click事件就会丢失，导致位置没有及时刷新
  };

  handleDragStart = (e: DraggableEvent, data: DraggableData) => {
    this.props.onDragStart();
  };

  handleDragEnd = () => {};

  componentDidMount() {
    // 传递子元素实例
    this.props.handleStateUpdate({
      key: this.props.uid,
      state: this.state,
      ele: this,
    });
  }

  render() {
    const { children, className, selected, uid, defaultPosition } = this.props;
    const { width, height, border, zIndex, x, y } = this.state;
    return (
      <Dragbble
        grid={[10, 10]}
        bounds="parent"
        // defaultPosition={defaultPosition}
        onDrag={this.handleDragging}
        onStart={this.handleDragStart}
        onStop={this.handleDragEnd}
        position={{ x, y }}
      >
        <div
          onClick={this.props.onClick}
          className={classNames(className, {
            'layout-child': true,
            selected,
          })}
          data-uid={uid}
          data-x={x}
          data-y={y}
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
