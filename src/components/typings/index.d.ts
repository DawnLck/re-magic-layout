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

// 拖拽时的交互数据类型
export type MagicDraggingData = {
  node: EventTarget | null; // Target HTMLElement
  x: number; // Origin x
  y: number; // Origin y
  deltaX: number; // Cursor deltaX 鼠标在X主轴上偏移的距离
  deltaY: number; // Cursor deltaY 鼠标在Y交叉轴上偏移的距离
  lastX: number; // x+deltaX 如果符合鼠标预期，target的x位置
  lastY: number; // y+deltaY 如果符合鼠标预期，target的y位置
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type LayoutType = 'free' | 'flex' | 'float';
