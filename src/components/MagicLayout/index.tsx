/**
 * Magic Layout
 */

import React, { Component } from 'react';

import './index.less';

import { classNames } from '@/utils';
import { buildConfig, wrapChildren } from './handle';

import { MagicLayoutProps, MagicState, ChildNode } from './interface';

export default class MagicLayout extends Component<MagicLayoutProps> {
  static defaultProps = {
    onStateChange: (state: MagicState) => state,
  };

  element: HTMLDivElement | null = null;
  config: any = null;
  state = {
    activeChild: {
      uid: null,
      width: 0,
      height: 0,
    },
  };

  onChildrenClick = (data: ChildNode) => {
    this.setState({
      activeChild: data,
    });
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
    this.config = buildConfig(this.props);
    const { onStateChange } = this.props;
    onStateChange(this.state);
  }

  shouldComponentUpdate(newProps: MagicLayoutProps, newState: MagicState) {
    const { layout } = this.props;
    const { activeChild } = this.state;
    return layout !== newProps.layout || activeChild !== newState.activeChild;
  }

  componentDidMount() {
    this.config = buildConfig(this.props);
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
        {wrapChildren(children, activeChild.uid, this.onChildrenClick)}
      </div>
    );
  }
}
