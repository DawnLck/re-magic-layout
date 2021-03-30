/**
 * Children handle
 * @description 一些处理children子元素的纯函数
 */

import { isValidElement, ReactNode } from 'react';

import ChildWrapper from '../../ChildWrapper';

export interface wrapProps {
  key: number;
  style?: any;
  className?: string;
  width?: any;
  height?: any;
  uid?: number | string;
  'data-uid'?: number | string;
}

/**
 * checkElement
 * @description 对单个元素进行操作，完成元素包裹
 */
export const checkElement = (
  ele: any,
  key: number,
  selectedKey: any,
  handleChildrenClick: any,
) => {
  if (!isValidElement(ele)) return ele;

  const {
    className,
    style,
    uid,
    width: propWidth,
    height: propHeight,
    'data-uid': dataUID,
  } = ele.props as wrapProps;

  const uniqueKey = uid || dataUID || key;
  // const width = (style && style.width) || propWidth;
  // const height = (style && style.height) || propHeight;

  const wrappedChild = (
    <ChildWrapper
      className={className}
      key={key}
      uid={uniqueKey}
      selected={selectedKey === uniqueKey}
      handleClick={handleChildrenClick}
    >
      {ele}
    </ChildWrapper>
  );
  return wrappedChild;
};

/**
 * wrapChildren
 * @description 区分children的类型，主要是区分数组还是单个元素
 */
export const wrapChildren = (
  children: ReactNode,
  selectedKey: any,
  handleChildrenClick: any,
) => {
  if (Array.isArray(children)) {
    return children.map((child, index) => {
      return checkElement(child, index, selectedKey, handleChildrenClick);
    });
  } else {
    return checkElement(children, 1, selectedKey, handleChildrenClick);
  }
};
