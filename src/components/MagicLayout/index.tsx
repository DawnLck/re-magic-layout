/**
 * Magic Layout
 */

import React, { Component, createRef } from 'react';

import './index.less';

import { classNames, colorLog } from '@/utils';
import { buildConfig } from './handle';

import { MagicLayoutProps, MagicState, ChildNode } from './interface';

import ChildWrapper, { ChildData } from '../ChildWrapper';

export default class MagicLayout extends Component<MagicLayoutProps, any, any> {
  public $ref: any;
  static defaultProps = {
    onStateChange: (state: MagicState) => state,
  };

  constructor(props: MagicLayoutProps) {
    super(props);
    this.$ref = createRef();
    this.state = {
      // TODOs: 废弃的状态，=》 selects
      activeChild: {
        uid: null,
        ele: null,
        state: null,
      },
      selects: [],
    };
  }

  element: HTMLDivElement | null = null;

  config: any = {
    layout: '',
    mode: '',
    children: {},
  };

  $children: any[] = [];

  onChildrenClick = (data: ChildData) => {
    colorLog('green', `[MagicLayout]`, `OnChildrenClick`);

    const { selects } = this.state;
    const { key, ele, state: childState } = data;

    if (selects.includes(key)) return;
    this.setState({
      selects: [...selects, key],
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
      activeChild: {
        uid: null,
        width: 0,
        height: 0,
      },
    });
  };

  /** LifeCycle Hooks */
  componentDidUpdate() {
    colorLog('red', `[MagicLayout]`, `Did Update`);
    // this.config = buildConfig(this.props);
    // const { onStateChange } = this.props;
    // onStateChange(this.state);
  }

  shouldComponentUpdate(newProps: MagicLayoutProps, newState: MagicState) {
    const { layout } = this.props;
    const { selects } = this.state;
    console.log({ selects, new: newState.selects });

    return layout !== newProps.layout || selects !== newState.selects;
  }

  componentDidMount() {
    // this.config = buildConfig(this.props);
    this.config.layout = this.props.layout;
  }

  // 拖拽初始时 计算出所有元素的坐标信息，存储于this.$children
  onDragStart = () => {
    const { children } = this.props;
    this.$children = (this.props.children as any[]).map((child, i) => {
      const $ = this.$ref.childNodes[i];
      const x = Number($.getAttribute('data-x'));
      const y = Number($.getAttribute('data-y'));
      const w = $.clientWidth;
      const h = $.clientHeight;

      return {
        $,
        i,
        x,
        y,
        w,
        h,
        l: x,
        r: x + w,
        t: y,
        b: y + h,
        lr: x + w / 2,
        tb: y + h / 2,
      };
    });
  };

  // renderChildren 渲染子元素
  renderChildren() {
    const { children } = this.props;
    const { selects } = this.state;

    colorLog('green', `[MagicLayout]`, `renderChildren`);
    console.log(selects);

    if (Array.isArray(children)) {
      return children.map((child: any, index) => {
        const { uid, 'data-uid': dataUID } = child.props;
        const uniqueKey = `child_${uid || dataUID || index}`;
        return (
          <ChildWrapper
            key={uniqueKey}
            uid={uniqueKey}
            selected={selects.includes(uniqueKey)}
            handleClick={this.onChildrenClick}
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

    return (
      <div
        ref={this.$ref}
        className={classNames(['re-magic-layout', `layout-${layout}`])}
        onClick={this.unsetLayout}
      >
        {/* {wrapChildren(
          children,
          activeChild.uid,
          this.onChildrenClick,
          this.onChildStateUpdate,
        )} */}
        {this.renderChildren()}
      </div>
    );
  }
}
