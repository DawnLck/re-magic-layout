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
}
export interface MagicLayoutProps {
  layout: string;
  onStateChange: (state: MagicState) => void;
  onConfigChange: (config: any) => void;
}
