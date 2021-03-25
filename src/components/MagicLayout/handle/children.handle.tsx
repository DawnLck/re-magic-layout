/**
 * Children handle
 * @description 一些处理children子元素的纯函数
 */

import { isValidElement, ReactNode } from 'react';

import ChildWrapper from '../../ChildWrapper';

export interface wrapProps {
  style?: any;
  className?: string;
  width?: any;
  height?: any;
  key: number;
}

/**
 * checkElement
 * @description 对单个元素进行操作，完成元素包裹
 */
export const checkElement = (ele: any, key: number) => {
  if (!isValidElement(ele)) return ele;

  const {
    className,
    style,
    width: propWidth,
    height: propHeight,
  } = ele.props as wrapProps;

  const width = (style && style.width) || propWidth;
  const height = (style && style.height) || propHeight;

  const wrappedChild = (
    <ChildWrapper className={className} width={width} height={height} key={key}>
      {ele}
    </ChildWrapper>
  );
  return wrappedChild;
};

/**
 * wrapChildren
 * @description 区分children的类型，主要是区分数组还是单个元素
 */
export const wrapChildren = (children: ReactNode) => {
  if (Array.isArray(children)) {
    return children.map((child, index) => {
      return checkElement(child, index);
    });
  } else {
    return checkElement(children, 1);
  }
};
