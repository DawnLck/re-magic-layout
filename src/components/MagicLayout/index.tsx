/**
 * Magic Layout
 */

import React, { Component } from 'react';

import './index.less';

import { classNames, colorLog } from '@/utils';
import { buildConfig, wrapChildren } from './handle';

import { MagicLayoutProps, MagicState, ChildNode } from './interface';

import { ChildData } from '../ChildWrapper';

export default class MagicLayout extends Component<MagicLayoutProps> {
  static defaultProps = {
    onStateChange: (state: MagicState) => state,
  };

  element: HTMLDivElement | null = null;
  config: any = {
    layout: '',
    mode: '',
    children: {},
  };
  childrenNodes = [];
  state = {
    activeChild: {
      uid: null,
      ele: null,
      state: null,
    },
  };

  onChildrenClick = (data: ChildData) => {
    this.setState({
      activeChild: data,
    });
  };

  configUpdate = () => {
    this.props.onConfigChange(this.config);
  };

  onChildStateUpdate = (data: ChildData) => {
    const { uid, ele, state } = data;
    const { children } = this.config;
    if (uid) {
      children[uid] = state;
    } else {
      console.error('该子元素缺少uid', ele);
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
    const { onStateChange } = this.props;
    onStateChange(this.state);
  }

  shouldComponentUpdate(newProps: MagicLayoutProps, newState: MagicState) {
    const { layout } = this.props;
    const { activeChild } = this.state;
    return layout !== newProps.layout || activeChild !== newState.activeChild;
  }

  componentDidMount() {
    // this.config = buildConfig(this.props);
    this.config.layout = this.props.layout;
  }

  render() {
    const { children, layout } = this.props;
    const { activeChild } = this.state;

    return (
      <div
        ref={(element) => {
          this.element = element;
        }}
        className={classNames(['re-magic-layout', `layout-${layout}`])}
        onClick={this.unsetLayout}
      >
        {wrapChildren(
          children,
          activeChild.uid,
          this.onChildrenClick,
          this.onChildStateUpdate,
        )}
      </div>
    );
  }
}
