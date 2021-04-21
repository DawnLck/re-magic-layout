/**
 * ChildWrapper
 */
import React, {
  Component,
  cloneElement,
  ReactNode,
  MouseEventHandler,
} from 'react';
import Dragbble, {
  DraggableCore,
  DraggableData,
  DraggableEvent,
} from 'react-draggable';

import { classNames, noop, buildBoundaries } from '@/utils';

import './index.less';

import ResizeAnchors from '../ResizeAnchors';
import { MagicDraggingData } from '../typings';

interface ChildWrapperProps {
  uid?: any;
  className?: string;
  grid?: number;
  selected?: boolean;
  border?: number;
  defaultPosition?: { x: number; y: number };
  // 来源于开发者的响应函数
  onClick: MouseEventHandler;
  onDragStart: (e: DraggableEvent, data: DraggableData) => any;
  onDragging: (data: MagicDraggingData) => any;
  onDragEnd: () => void;
  // 来源于MagicLayout的响应函数
  _click: MouseEventHandler;
  _dragStart: () => any;
  _dragging: (data: MagicDraggingData) => any;

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
  private $cursor: {
    startX: number;
    startY: number;
  };
  private $origin: {
    x: number;
    y: number;
  };
  static defaultProps = {
    grid: 1,
    onClick: noop,
    onDragStart: noop,
    onDragging: noop,
    onDragEnd: noop,
    _click: noop,
    _dragStart: noop,
    _dragging: noop,
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

    this.$cursor = { startX: 0, startY: 0 };
    this.$origin = { x: 0, y: 0 };
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
    e.stopPropagation();
    console.log('[ChildWrapper] HandleClick: ', e);

    // const { key } = this.props;
    const { width, height, x, y } = this.state;
    const data = {
      key: this.props.uid,
      state: this.state,
      ele: e.target,
    };

    // this.props.handleClick(data);
    this.props._click(e);

    // this.setState({ x: x + 10, y: y + 10 });
  };

  /**
   * 处理子元素的Drag事件
   */

  handleDragStart = (e: DraggableEvent, data: DraggableData) => {
    const {
      x: cursorX,
      y: cursorY,
      lastX: lastCursorX,
      lastY: lastCursorY,
    } = data;
    this.$cursor = {
      startX: lastCursorX,
      startY: lastCursorY,
    };
    this.$origin = {
      x: this.state.x,
      y: this.state.y,
    };
    this.props.onDragStart(e, data);
    this.props._dragStart();
  };

  handleDragging = (e: DraggableEvent, data: DraggableData) => {
    // console.log('Hanlde Drag', { dragEvent: e, dragData: data });
    const {
      // x: cursorX,
      // y: cursorY,
      lastX: cursorLastX,
      lastY: cursorLastY,
      // deltaX,
      // deltaY,
    } = data;
    const { width, height } = this.state;
    const { startX: cursorStartX, startY: cursorStartY } = this.$cursor;
    const deltaCursorX = cursorLastX - cursorStartX;
    const deltaCursorY = cursorLastY - cursorStartY;
    const { x, y } = this.$origin;

    const result = this.props._dragging({
      node: e.target,
      width,
      height,
      x,
      y,
      deltaX: deltaCursorX,
      deltaY: deltaCursorY,
      lastX: x + deltaCursorX,
      lastY: y + deltaCursorY,
      ...buildBoundaries(x + deltaCursorX, y + deltaCursorY, width, height),
    });
    const { adjustX, adjustY } = result;
    // console.log(result);
    this.setState({ x: adjustX, y: adjustY });
    // console.log({ lastX, lastY }, data);
    // this.setState({ x: x + deltaX, y: y + deltaY });

    // Drag 会触发一次Click事件，形成事件的上传，不过有个地方需要完善，用户如果拖出范围，click事件就会丢失，导致位置没有及时刷新
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
    const { children, className, selected, uid, grid } = this.props;
    const { width, height, border, zIndex, x, y } = this.state;

    const gridProp: any = grid
      ? { grid: [Math.max(grid, 1), Math.max(grid, 1)] }
      : { grid: null };

    const style = {
      transform: `translate(${x}px, ${y}px)`,
      width,
      height,
      borderWidth: border,
      zIndex,
    };

    return (
      <DraggableCore
        {...gridProp}
        // bounds="parent"
        onDrag={this.handleDragging}
        onStart={this.handleDragStart}
        onStop={this.handleDragEnd}
        position={{ x, y }}
        // offsetParent
      >
        <div
          onClick={this.handleClick}
          className={classNames(className, {
            'layout-child': true,
            selected,
          })}
          data-uid={uid}
          data-x={x}
          data-y={y}
          style={style}
        >
          <div className="dev-tips">
            <span>{x}</span>&nbsp;~&nbsp;<span>{y}</span>
          </div>
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
      </DraggableCore>
    );
  }
}

export default ChildWrapper;
