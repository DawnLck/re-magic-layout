/**
 * Magic Layout
 */

import React, { PureComponent } from 'react';

import './index.less';

import { classNames } from './utils';
import { withDraggable } from './hoc';
import ChildrenContainer from './ChildrenContainer';

// import { mainStore } from '@/store';
import { isFunction, isString } from './utils';

function getConfigFromChildElement(ele: any) {
  const { type, props, key } = ele;
  const { className, width: attrWidth, height: attrHeight, style } = props;
  const name = isString(type) ? type : type.name;
  const width = attrWidth || style.width || '100%';
  const height = attrHeight || style.height || '100%';
  return { key, name, width, height, className };
}

export interface MagicLayoutProps {
  layout: string;
}

export default class MagicLayout extends PureComponent<MagicLayoutProps> {
  element: HTMLDivElement | null = null;
  config: any = null;
  state = {
    activeDrags: 0,
    deltaPosition: {
      x: 0,
      y: 0,
    },
    controlledPosition: {
      x: -400,
      y: 200,
    },
  };
  onStart = () => {
    this.setState({ activeDrags: ++this.state.activeDrags });
  };

  onStop = () => {
    this.setState({ activeDrags: --this.state.activeDrags });
  };
  //   onDrop = (e) => {
  //     this.setState({ activeDrags: --this.state.activeDrags });
  //     if (e.target.classList.contains('drop-target')) {
  //       alert('Dropped!');
  //       e.target.classList.remove('hovered');
  //     }
  //   };

  updateLocalStorage(data: any) {
    window.localStorage.setItem('currConfig', JSON.stringify(data, null, 2));
  }

  buildConfig = () => {
    const { layout, children } = this.props;
    // console.log(this.element);

    const childrenConfig = (children as any).map((element: any) => {
      const childConfig = getConfigFromChildElement(element);
      console.log('MagicLayoutDidMount:', element);
      console.log('MagicLayout ChildConfig:', childConfig);
      return childConfig;
    });

    const config = {
      layout: layout,
      children: childrenConfig,
    };
    this.config = config;
    this.updateLocalStorage(config);
  };

  componentDidUpdate() {
    this.buildConfig();
  }

  componentDidMount() {
    this.buildConfig();
  }
  render() {
    const { children, layout } = this.props;
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };

    return (
      <div
        ref={(element) => {
          this.element = element;
        }}
        className={classNames(['re-magic-layout', `layout-${layout}`])}
      >
        <ChildrenContainer>{children}</ChildrenContainer>
        {/* {withDraggable(children, layout === 'grid', dragHandlers)} */}
      </div>
    );
  }
}
