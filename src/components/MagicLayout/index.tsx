/**
 * Magic Layout
 */

import React, { PureComponent } from 'react';

import Dragbble from 'react-draggable';

import './index.less';

import { classNames } from './utils';

interface ReactDraggableCommonProps {
  bounds: string;
  grid?: [number, number];
}
interface MagicLayoutProps {
  layout: string;
}

export default class MagicLayout extends PureComponent<MagicLayoutProps> {
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

  /**
   * withDraggable 调用react-draggable的API包裹子组件
   * @param children
   * @returns ReactNode
   */
  withDraggable = (
    children: React.ReactNode,
    dragHandlers: {
      onStart: () => void;
      onStop: () => void;
    },
  ): React.ReactNode => {
    if (!children) return children;
    let commonProps: ReactDraggableCommonProps = {
      bounds: 'parent',
    };
    if (this.props.layout === 'grid') {
      commonProps.grid = [20, 20];
    }

    if (Array.isArray(children)) {
      return children.map((child, index) => {
        return (
          <Dragbble key={index} {...commonProps} {...dragHandlers}>
            {child}
          </Dragbble>
        );
      });
    } else {
      return (
        <Dragbble {...commonProps} {...dragHandlers}>
          {children}
        </Dragbble>
      );
    }
  };

  render() {
    const { children, layout } = this.props;
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };

    return (
      <div className={classNames(['re-magic-layout', `layout-${layout}`])}>
        {this.withDraggable(children, dragHandlers)}
      </div>
    );
  }
}
