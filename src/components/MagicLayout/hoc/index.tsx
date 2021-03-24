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
 */
interface wrapProps {
  style: any;
  className: string;
}

function checkElement(ele: any) {
  if (!isValidElement(ele)) return ele;

  const { className, style } = ele.props as wrapProps;
  console.log(ele);

  return cloneElement<wrapProps>(ele as any, {
    style: { width: '100%', height: '100%', ...style },
    className: `${className} layout-child`,
  });
}

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
