/**
 * HOC - index
 */

import React, {
  PureComponent,
  useState,
  cloneElement,
  isValidElement,
  createRef,
} from 'react';
import Dragbble from 'react-draggable';

export interface ReactDraggableCommonProps {
  bounds: string;
  grid?: [number, number];
}

/**
 * withDraggable 调用react-draggable的API包裹子组件
 * @param children
 * @returns ReactNode
 *
 */
export const withDraggable = (
  target: React.ReactNode,
  isGrid: boolean,
  dragHandlers: {
    onStart: () => void;
    onStop: () => void;
  },
): React.ReactNode => {
  if (!target) return target;
  let commonProps: ReactDraggableCommonProps = {
    bounds: 'parent',
    grid: [20, 20],
  };

  if (!isGrid) delete commonProps.grid;

  return (
    <Dragbble {...commonProps} {...dragHandlers}>
      {target}
    </Dragbble>
  );
};
