/**
 * ChildWrapper
 */
import React, { Component, cloneElement } from 'react';
import { classNames } from '@/utils';
import './index.less';
import Dragbble from 'react-draggable';

interface ChildWrapperProps {
  className: string | undefined;
  width?: number;
  height?: number;
  handleClick: any;
  selected: boolean;
}
interface ChildWrapperState {
  width?: number;
  height?: number;
}

class ChildWrapper extends Component<ChildWrapperProps, ChildWrapperState> {
  static defaultProps = {
    width: 300,
    height: 200,
  };
  constructor(props: any) {
    super(props);
    this.state = {
      width: 300,
      height: 200,
    };
  }

  initSize = () => {
    const { width, height } = this.props;
    this.setState({
      width,
      height,
    });
  };

  componentDidMount() {
    this.initSize();
  }

  render() {
    const { children, className, handleClick, selected } = this.props;
    const { width, height } = this.state;
    return (
      <Dragbble bounds="parent">
        <div
          onClick={handleClick}
          className={classNames(className, {
            'layout-child': true,
            selected: selected,
          })}
          style={{ width, height }}
        >
          {cloneElement(children as any, {
            style: {
              width: '100%',
              height: '100%',
            },
          })}
        </div>
      </Dragbble>
    );
  }
}

export default ChildWrapper;
