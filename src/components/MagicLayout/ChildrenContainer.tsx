/**
 * ChildrenContainer wrapper
 * @description 主要目的是为了预处理传入的children，但又不想把这块逻辑混在Draggbale里，所以单独抽离出来
 */
import { classNames } from './utils';
import React, {
  Component,
  isValidElement,
  cloneElement,
  Fragment,
} from 'react';

import { withDraggable } from './hoc';

interface wrapProps {
  style?: any;
  className?: string;
  width?: any;
  height?: any;
  key: number;
}

function checkElement(ele: any, key: number) {
  if (!isValidElement(ele)) return ele;

  const { className, style } = ele.props as wrapProps;

  return cloneElement<wrapProps>(ele as any, {
    style: { width: 300, height: 200, ...style },
    className: classNames([className, 'layout-child']),
    key,
  });
}

class ChildrenContainer extends Component {
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

  handleChildren(target: React.ReactNode, dragHandlers: any) {
    if (Array.isArray(target)) {
      return target.map((child, index) => {
        return withDraggable(checkElement(child, index), false, dragHandlers);
      });
    } else {
      return target;
    }
  }

  render() {
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    return (
      <Fragment>
        {this.handleChildren(this.props.children, dragHandlers)}
      </Fragment>
    );
  }
}

export default ChildrenContainer;
