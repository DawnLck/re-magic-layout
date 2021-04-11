/**
 * Magic Layout
 */

import React, { Component, createRef, ReactNode } from 'react';

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

  onChildDragging = (index: number, uid: string) => {
    return () => {
      colorLog('yellow', `[MagicLayout]`, `onDragging`);

      // GuideLines
      const { childNodes } = this.$ref.current;
      const target = childNodes[index];
      const compares = Array.from(childNodes).filter(
        (node: any) => node.dataset.uid !== uid,
      );
      const targetData = collectChildData(target);
      const comparesData = collectChildrenData(compares);
      this.setState({ target: targetData, compares: comparesData });
    };
  };

  // renderChildren 渲染子元素
  renderChildren() {
    const { children } = this.props;
    const { selects } = this.state;

    colorLog('green', `[MagicLayout]`, `renderChildren`);

    if (Array.isArray(children)) {
      return children.map((child: any, index) => {
        const { uid, 'data-uid': dataUID } = child.props;
        const uniqueKey = `child_${uid || dataUID || index}`;
        return (
          <ChildWrapper
            key={uniqueKey}
            uid={uniqueKey}
            selected={selects.includes(uniqueKey)}
            onClick={(e) => {
              this.onChildrenClick(e, uniqueKey);
            }}
            onDragStart={this.onChildDragStart}
            onDragging={this.onChildDragging(index, uniqueKey)}
            // handleClick={this.onChildrenClick}
            handleStateUpdate={() => {}}
          >
            {child}
          </ChildWrapper>
        );
      });
    } else {
      return children;
    }
  }

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
