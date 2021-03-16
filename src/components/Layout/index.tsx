import React, { Component } from 'react';

import Dragbble from 'react-draggable';

import './index.less';

export default class Layout extends Component {
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
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        return (
          <Dragbble bounds="parent" key={index} {...dragHandlers}>
            {child}
          </Dragbble>
        );
      });
    } else {
      return (
        <Dragbble bounds="parent" {...dragHandlers}>
          {children}
        </Dragbble>
      );
    }
  };
  render() {
    const { children } = this.props;
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };

    return (
      <div className="layout">{this.withDraggable(children, dragHandlers)}</div>
    );
  }
}
