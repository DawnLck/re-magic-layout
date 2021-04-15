/**
 *  涉及跨组件如 ChildWrapper 和 MagicLayout 交互的数据类型
 */
export type MagicDraggingData = {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
  width: number;
  height: number;
};
