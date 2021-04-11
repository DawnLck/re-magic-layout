/**
 * Interface index.d.ts
 */
export interface ChildNode {
  uid: string | null;
  state: any;
  ele?: any;
}
export interface MagicState {
  activeChild: ChildNode;
  selects: string[];
  selectMode: 'single' | 'multitype';
  target: any;
  compares: any;
}
export interface MagicLayoutProps {
  layout: string;
  autoWrapChildren: boolean; // 是否由MagicLayout完成子元素的包裹
  onStateChange: (state: MagicState) => void;
  onConfigChange: (config: any) => void;
}
