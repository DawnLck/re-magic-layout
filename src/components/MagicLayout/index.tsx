/**
 * Magic Layout
 */

import './index.less';
import React, { cloneElement, createRef, PureComponent } from 'react';

import { buildBoundaries, classNames, colorLog, mathBetween } from '@/utils';
import { collectChildrenData, calcMagnetic } from './handle';

import { DraggingProps, LayoutItem, LayoutType } from '../typings';

import ChildWrapper from '../ChildWrapper';
import GuideLines from '../GuideLines';

export interface MagicLayoutState {
  selects: string[];
  selectMode: 'single' | 'multitype';
  target: any;
  compares: any;
}
export interface MagicLayoutProps {
  layout: LayoutItem[];
  layoutType: LayoutType; //切换布局类型 fixed / free / flex
  autoWrapChildren: boolean; // 是否由MagicLayout完成子元素的包裹
  onStateChange: (state: MagicLayoutState) => void;
  onLayoutChange: (layout: LayoutItem[]) => void;
}

export default class MagicLayout extends PureComponent<
  MagicLayoutProps,
  MagicLayoutState,
  any
> {
  public $ref: any;
  public $compares: {
    nodes: any;
    data: any[];
  };

  static defaultProps = {
    layout: [],
    layoutType: 'free',
    autoWrapChildren: false, // 默认需要用户自己包裹元素
    onStateChange: (state: MagicLayoutState) => state,
  };

  constructor(props: MagicLayoutProps) {
    super(props);
    this.$ref = createRef();
    this.state = {
      selects: [],
      selectMode: 'single',
      target: null,
      compares: [],
    };
    this.$compares = {
      nodes: null,
      data: [],
    };
  }

  element: HTMLDivElement | null = null;

  config: any = {
    layout: '',
    mode: '',
    children: {},
  };

  onChildrenClick = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();

    const layout = this.props.layout.slice(0);
    const targetIndex = layout.findIndex((item) => item.uid === key);
    layout[targetIndex].selected = !layout[targetIndex].selected;
    this.props.onLayoutChange(layout);
  };

  unsetLayout = () => {
    const layout = this.props.layout.slice(0);
    layout.forEach((item) => {
      item.selected = false;
    });
    this.props.onLayoutChange(layout);
  };

  componentDidMount() {
    // this.config = buildConfig(this.props);
    // this.config.layout = this.props.layout;
  }

  // onDragStart 拖拽初始时 计算出所有元素的坐标信息，存储于this.$children
  onChildDragStart = (uid: string) => {
    return () => {
      // colorLog('yellow', `[MagicLayout]`, `onDragStart`);
      const { childNodes } = this.$ref.current;

      // 获取并缓存对比节点的数据
      const nodesArray = Array.from(childNodes);
      const _compareNodes = nodesArray.filter(
        (node: any) => node.dataset.uid !== uid,
      );
      this.$compares = {
        nodes: _compareNodes,
        data: collectChildrenData(_compareNodes),
      };
    };
  };

  onChildDragEnd = () => {
    this.setState({ target: null });
  };

  // 把范围限制在画布以内
  limitDragRange = (x: number, y: number, width: number, height: number) => {
    const { scrollHeight: boundBottom, scrollWidth: boundRight } = this.$ref
      .current as HTMLElement;
    return {
      lastX: mathBetween(x, 0, boundRight - width),
      lastY: mathBetween(y, 0, boundBottom - height),
      ...buildBoundaries(x, y, width, height),
    };
  };

  // onChildDragging 拖拽时计算辅助参考线和吸附
  onChildDragging = (uid: string) => {
    return (data: DraggingProps) => {
      const childLayout = this.props.layout.find((item) => item.uid === uid);
      const { width, height } = childLayout as LayoutItem;
      const { lastX, lastY } = data;

      // const targetData = { ...data, width, height };

      // 处理吸附逻辑
      const result = calcMagnetic(
        { ...data, width, height },
        this.$compares.data,
      );

      // 限制移动范围至画布边界
      const boundRange = this.limitDragRange(
        result?.lastX || lastX,
        result?.lastY || lastY,
        width,
        height,
      );

      // 基于吸附后的状态刷新辅助线
      this.setState({ target: result });

      let layout = this.props.layout;
      let index = layout.findIndex((item) => item.uid === uid);
      layout[index].x = boundRange.lastX;
      layout[index].y = boundRange.lastY;

      this.props.onLayoutChange(layout);

      return {
        adjustX: boundRange.lastX,
        adjustY: boundRange.lastY,
      };
    };
  };

  onChildResize = (uid: string, childLayout: LayoutItem) => {
    const layout = this.props.layout;
    layout.forEach((item) => {
      if (item.uid === uid) item = childLayout;
    });
    this.props.onLayoutChange(layout);
  };

  // wrapChildren 为子元素包裹一层
  wrapChildren = (child: any, uid: any) => {
    const { selects } = this.state;

    return (
      <ChildWrapper
        key={uid}
        uid={uid}
        selected={selects.includes(uid)}
        _click={(e) => {
          this.onChildrenClick(e, uid);
        }}
        _dragStart={this.onChildDragStart(uid)}
        _dragging={this.onChildDragging(uid)}
        // handleClick={this.onChildrenClick}
      >
        {child}
      </ChildWrapper>
    );
  };

  // renderChildren 渲染子元素
  renderChildren = () => {
    const { children, autoWrapChildren } = this.props;
    const { selects } = this.state;
    const { layout } = this.props;

    const childrenNodes = Array.isArray(children) ? children : [children];

    return childrenNodes.map((child: any, index) => {
      if (autoWrapChildren) {
      }
      const { uid, 'data-uid': dataUID } = child.props;
      const uniqueKey = uid || dataUID || `child_${index}`;
      const childLayout = layout.find(
        (item: LayoutItem) => item.uid === uniqueKey,
      );

      // 这里需要判断是不是需要包裹子元素
      if (!autoWrapChildren) {
        return cloneElement(child, {
          uid: uniqueKey,
          key: uniqueKey,
          layout: childLayout,
          _click: (e: any) => {
            this.onChildrenClick(e, uniqueKey);
          },
          _dragStart: this.onChildDragStart(uniqueKey),
          _dragging: this.onChildDragging(uniqueKey),
          _dragEnd: this.onChildDragEnd,
          _resize: this.onChildResize,
          selected: childLayout?.selected,
          handleStateUpdate: () => {},
        });
      } else {
        return this.wrapChildren(child, uniqueKey);
      }
    });
  };

  render() {
    const { target } = this.state;

    return (
      <div className={classNames(['re-magic-layout'])}>
        <div
          className={'re-magic-layout-children'}
          ref={this.$ref}
          onClick={this.unsetLayout}
        >
          {this.renderChildren()}
        </div>
        <div className={'re-magic-layout-tools'}>
          <GuideLines
            target={target}
            compares={this.$compares.data}
          ></GuideLines>
        </div>
      </div>
    );
  }
}
