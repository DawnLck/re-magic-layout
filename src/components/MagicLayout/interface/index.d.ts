/**
 * Interface index.d.ts
 */
export interface ChildNode {
  uid: string | null;
  width: number;
  height: number;
  ele?: any;
}
export interface MagicState {
  activeChild: ChildNode;
}
export interface MagicLayoutProps {
  layout: string;
  onStateChange: (state: MagicState) => void;
}
