/**
 * Magic Layout
 */

import React, { cloneElement, Component, createRef, ReactNode } from 'react';

import './index.less';

import { classNames, colorLog } from '@/utils';
import { collectChildrenData, collectChildData } from './handle';

import { MagicLayoutProps, MagicState, ChildNode } from './interface';

import ChildWrapper, { ChildData } from '../ChildWrapper';
import GuideLines from '../GuideLines';

export default class MagicLayout extends Component<
  MagicLayoutProps,
  MagicState,
  any
> {
  public $ref: any;
  static defaultProps = {
    autoWrapChildren: false, // 默认需要用户自己包裹元素
    onStateChange: (state: MagicState) => state,
  };

  constructor(props: MagicLayoutProps) {
    super(props);
    this.$ref = createRef();
    this.state = {
      // TODOs: 废弃的状态，activeChild =》 selects
      activeChild: {
        uid: null,
        ele: null,
        state: null,
      },
      // 新版本在用的状态
      selects: [],
      selectMode: 'single',
      target: null,
      compares: [],
    };
  }

  element: HTMLDivElement | null = null;

  config: any = {
    layout: '',
    mode: '',
    children: {},
  };

  $children: any[] = [];

  onChildrenClick = (e: React.MouseEvent, key: string) => {
    colorLog('green', `[MagicLayout]`, `OnChildrenClick`);

    e.preventDefault();
    e.stopPropagation();

    const { selects, selectMode } = this.state;

    if (selects.includes(key)) return;

    this.setState({
      selects: selectMode === 'single' ? [key] : [...selects, key],
    });
  };

  configUpdate = () => {
    this.props.onConfigChange(this.config);
  };

  onChildStateUpdate = (data: ChildData) => {
    const { key, ele, state } = data;
    const { children } = this.config;
    if (key) {
      children[key] = state;
    } else {
      console.error('该子元素缺少key或者uid', ele);
      return;
    }
    console.log('[MagicLayout]: Child State Update', this.config);
  };

  unsetLayout = () => {
    this.setState({
      selects: [],
    });
  };

  /** LifeCycle Hooks */
  componentDidUpdate() {
    colorLog('red', `[MagicLayout]`, `Did Update`);
    // this.config = buildConfig(this.props);
    // const { onStateChange } = this.props;
    // onStateChange(this.state);
  }

  // shouldComponentUpdate(newProps: MagicLayoutProps, newState: MagicState) {
  //   const { layout } = this.props;
  //   const { selects } = this.state;
  //   console.log({ selects, new: newState.selects });

  //   return layout !== newProps.layout || selects !== newState.selects;
  // }

  componentDidMount() {
    // this.config = buildConfig(this.props);
    this.config.layout = this.props.layout;
  }

  // onDragStart 拖拽初始时 计算出所有元素的坐标信息，存储于this.$children
  onChildDragStart = () => {
    colorLog('yellow', `[MagicLayout]`, `onDragStart`);
    const { childNodes } = this.$ref.current;
    this.$children = collectChildrenData(childNodes);
  };

  onChildDragging = (uid: string) => {
    return () => {
      colorLog('yellow', `[MagicLayout]`, `onDragging ${uid}`);

      // GuideLines
      const { childNodes } = this.$ref.current;
      const nodesArray = Array.from(childNodes);
      const target = nodesArray.find((child: any) => {
        return child.dataset.uid === uid;
      });
      const compares = nodesArray.filter(
        (node: any) => node.dataset.uid !== uid,
      );
      const targetData = collectChildData(target as HTMLElement);
      const comparesData = collectChildrenData(compares);
      this.setState({ target: targetData, compares: comparesData });
    };
  };

  // wrapChildren 为子元素包裹一层
  wrapChildren = (child: any, uid: any) => {
    const { selects } = this.state;

    return (
      <ChildWrapper
        key={uid}
        uid={uid}
        selected={selects.includes(uid)}
        onClick={(e) => {
          this.onChildrenClick(e, uid);
        }}
        onDragStart={this.onChildDragStart}
        onDragging={this.onChildDragging(uid)}
        // handleClick={this.onChildrenClick}
        handleStateUpdate={() => {}}
      >
        {child}
      </ChildWrapper>
    );
  };

  // renderChildren 渲染子元素
  renderChildren = () => {
    colorLog('green', `[MagicLayout]`, `renderChildren`);
    const { children, autoWrapChildren } = this.props;
    const { selects } = this.state;

    if (Array.isArray(children)) {
      return children.map((child: any, index) => {
        const { uid, 'data-uid': dataUID } = child.props;
        const uniqueKey = uid || dataUID || `child_${index}`;

        if (!autoWrapChildren) {
          return cloneElement(child, {
            uid: uniqueKey,
            key: uniqueKey,
            onClick: (e) => {
              this.onChildrenClick(e, uniqueKey);
            },
            onDragStart: this.onChildDragStart,
            onDragging: this.onChildDragging(uniqueKey),
            selected: selects.includes(uniqueKey),
            handleStateUpdate: () => {},
          });
        } else {
          return this.wrapChildren(child, uniqueKey);
        }
      });
    } else {
      return children;
    }
  };

  render() {
    const { layout } = this.props;
    const { target, compares } = this.state;

    return (
      <div className={classNames(['re-magic-layout', `layout-${layout}`])}>
        <div
          className={'re-magic-layout-children'}
          ref={this.$ref}
          onClick={this.unsetLayout}
        >
          {this.renderChildren()}
        </div>
        <div className={'re-magic-layout-tools'}>
          <GuideLines target={target} compares={compares}></GuideLines>
        </div>
      </div>
    );
  }
}
