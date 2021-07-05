/**
 *  涉及跨组件如 ChildWrapper 和 MagicLayout 交互的数据类型
 */

// 布局中子元素的布局数据类型
export type LayoutItem = {
  uid: string;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex?: number; //层级
  minWidth?: number;
  minHeight?: number;
  static?: boolean; // 是否固定
  selected?: boolean; // 是否被选择
};

// NodeAttr
export type NodeAttr = {
  node?: EventTarget | null; // Target HTMLElement

  // 基础属性
  x: number; // Origin x
  y: number; // Origin y
  width: number;
  height: number;

  // 边界属性
  left: number;
  right: number;
  top: number;
  bottom: number;

  // 添加字符串索引签名
  [propName: string]: any;
};

export interface DraggingProps extends NodeAttr {
  deltaX: number; // Cursor deltaX 鼠标在X主轴上偏移的距离
  deltaY: number; // Cursor deltaY 鼠标在Y交叉轴上偏移的距离
  lastX: number; // x+deltaX 如果符合鼠标预期，target的x位置
  lastY: number; // y+deltaY 如果符合鼠标预期，target的y位置
}

export type LayoutType = 'free' | 'flex' | 'float';
