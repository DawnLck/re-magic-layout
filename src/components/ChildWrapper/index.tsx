/**
 * ChildWrapper
 */
import React, { Component, cloneElement } from 'react';
import Dragbble from 'react-draggable';
import { classNames } from '@/utils';

import './index.less';

interface ChildWrapperProps {
  className: string | undefined;
  width?: number;
  height?: number;
  handleClick: any;
  selected: boolean;
  uid: any;
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

    const { children } = this.props;

    const { style, width: propWidth, height: propHeight } = children as any;

    const width = (style && style.width) || propWidth;
    const height = (style && style.height) || propHeight;

    this.state = {
      width,
      height,
    };
  }

  initSize = () => {
    const { width, height } = this.props;
    this.setState({
      width,
      height,
    });
  };

  changeSize = (width: any, height: any) => {
    // console.log('ChangeSize: ', { width, height });
    this.setState({
      width,
      height,
    });
  };

  handleClick = () => {
    const { uid } = this.props;
    const { width, height } = this.state;
    const data = {
      uid,
      node: {
        width,
        height,
      },
      ele: this,
    };

    // console.log('Child Click: ', data);

    this.props.handleClick(data);
  };

  componentDidMount() {
    this.initSize();
  }

  render() {
    const { children, className, selected } = this.props;
    const { width, height } = this.state;
    return (
      <Dragbble bounds="parent">
        <div
          onClick={this.handleClick}
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
