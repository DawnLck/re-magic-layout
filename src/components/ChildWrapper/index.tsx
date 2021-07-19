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

import { classNames, noop, buildBoundaries, clearEvent } from '@/utils';

import './index.less';

import ResizeAnchors from '../ResizeAnchors';
import { NodeAttr, LayoutItem, DraggingProps } from '../typings';

let $cursor: null | { startX: number; startY: number } = null;
let $origin: null | { x: number; y: number } = null;
interface ChildWrapperProps {
  uid?: any;
  className?: string;
  grid?: number;
  selected?: boolean;
  border?: number;
  defaultPosition?: { x: number; y: number };
  layout?: LayoutItem;

  // 来源于开发者的响应函数
  onClick?: (data: any) => void;
  onDragStart?: (e: DraggableEvent, data: DraggableData) => any;
  onDragging?: (data: DraggingProps) => any;
  onDragEnd?: () => void;

  // 来源于MagicLayout的响应函数
  _click?: MouseEventHandler;
  _dragStart?: () => any;
  _dragging?: (data: DraggingProps) => any;
  _dragEnd?: () => any;
  _resize?: (uid: string, layout: LayoutItem) => void;

  children: ReactNode;
}

const ChildWrapper = (props: ChildWrapperProps) => {
  const {
    children,
    className,
    selected,
    uid,
    grid,
    layout = {} as LayoutItem,
    onDragEnd = noop,
    onClick = noop,
    onDragStart = noop,
    onDragging = noop,
    _click = noop,
    _dragStart = noop,
    _dragEnd = noop,
    _dragging = noop,
    _resize = noop,
  } = props;
  const { width, height, zIndex, x, y } = layout;

  const handleDragStart = (e: DraggableEvent, data: DraggableData) => {
    const {
      x: cursorX,
      y: cursorY,
      lastX: lastCursorX,
      lastY: lastCursorY,
    } = data;

    $cursor = {
      startX: lastCursorX,
      startY: lastCursorY,
    };

    $origin = {
      x: x || 0,
      y: y || 0,
    };

    onDragStart(e, data);
    _dragStart();
  };

  const handleDragging = (e: DraggableEvent, data: DraggableData) => {
    // console.log('Dragging', { $cursor, $origin }, data);
    if (!$cursor) {
      console.error('$cursor is null!', $cursor);
      return;
    }
    const {
      x: cursorX,
      y: cursorY,
      lastX: cursorLastX,
      lastY: cursorLastY,
      // deltaX,
      // deltaY,
    } = data;

    if (!$origin) {
      $origin = { x: layout.x, y: layout.y };
    }
    const { startX: cursorStartX, startY: cursorStartY } = $cursor;
    const deltaCursorX = cursorX - cursorStartX;
    const deltaCursorY = cursorY - cursorStartY;

    const { x, y } = $origin;

    const result = _dragging({
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

    // const { adjustX, adjustY } = result;

    // this.setState({ x: adjustX, y: adjustY });

    // onDragging({});

    // Drag 会触发一次Click事件，形成事件的上传，不过有个地方需要完善，用户如果拖出范围，click事件就会丢失，导致位置没有及时刷新
  };

  const handleDragEnd = () => {
    _dragEnd();
    onDragEnd();
  };

  const handleClick = (e: any) => {
    clearEvent(e);

    onClick({});
    _click(e);
  };

  const resizeChild = (data: any) => {
    const layout = props.layout;
    if (!layout) return;
    const { width, height, deltaX, deltaY } = data;
    layout.width = width;
    layout.height = height;
    layout.x = layout.x + deltaX;
    layout.y = layout.y + deltaY;

    _resize(props.uid, layout);
  };

  const gridProp: any = grid
    ? { grid: [Math.max(grid, 1), Math.max(grid, 1)] }
    : { grid: null };

  const childPosition = { x: layout?.x || x, y: layout?.y || y };

  const style = {
    transform: `translate(${childPosition.x}px, ${childPosition.y}px)`,
    width: layout.width,
    height: layout.height,
    zIndex: layout.zIndex,
  };

  return (
    <DraggableCore
      {...gridProp}
      onDrag={handleDragging}
      onStart={handleDragStart}
      onStop={handleDragEnd}
    >
      <div
        onClick={handleClick}
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
          {/* <span>{x}</span>&nbsp;~&nbsp;<span>{y}</span> */}
          index: <span>{style.zIndex}</span>
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
          width={style.width}
          height={style.height}
          show={!!selected}
          onChange={resizeChild}
        ></ResizeAnchors>
      </div>
    </DraggableCore>
  );
};

export default ChildWrapper;
