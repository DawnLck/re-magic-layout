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
  };

  /** LifeCycle Hooks */
  componentDidUpdate() {
    buildConfig(this.props);
  }

  componentDidMount() {
    buildConfig(this.props);
  }

  render() {
    const { children, layout } = this.props;

    return (
      <div
        ref={(element) => {
          this.element = element;
        }}
        className={classNames(['re-magic-layout', `layout-${layout}`])}
      >
        {wrapChildren(children)}
      </div>
    );
  }
}
