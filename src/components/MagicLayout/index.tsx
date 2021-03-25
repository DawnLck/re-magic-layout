/**
 * Magic Layout
 */

import React, { PureComponent } from 'react';

import './index.less';

import { classNames } from '@/utils';
import { buildConfig, wrapChildren } from './handle';

export interface MagicLayoutProps {
  layout: string;
}

export default class MagicLayout extends PureComponent<MagicLayoutProps> {
  element: HTMLDivElement | null = null;
  config: any = null;
  state = {
    activeDrags: 0,
    activeChild: null,
    layout: 'free',
  };

  onChildrenClick = (key: string | number | null) => {
    this.setState({
      activeChild: key,
    });
    console.log('activeKey: ', key);
  };

  /** LifeCycle Hooks */
  componentDidUpdate() {
    this.config = buildConfig(this.props);
  }

  componentDidMount() {
    const { layout } = this.props;
    this.setState({ layout });
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
      >
        {wrapChildren(children, activeChild, this.onChildrenClick)}
      </div>
    );
  }
}
