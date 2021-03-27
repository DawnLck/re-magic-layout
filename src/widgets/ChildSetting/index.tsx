/**
 * Card Setting
 */

import React, { Component } from 'react';
import FormGroup from '../FormGroup';
import { InputNumber } from 'antd';

// import { debounce } from '@/utils';

interface CardSettingProps {
  child: any;
}

interface CardSettingState {
  width: number;
  height: number;
}

class CardSetting extends Component<CardSettingProps, CardSettingState> {
  constructor(props: any) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {}
  componentDidUpdate(prevProps: any, prevState: any) {
    if (!this.props.child?.ele) return;
    const ele = this.props.child.ele;

    const { width, height } = ele.state;
    if (prevState.width !== width || prevState.height !== height) {
      this.setState({
        width,
        height,
      });
    }
  }
  onSizeChange = (type: string, value: number) => {
    let { child } = this.props;
    const { width, height } = child.node;

    if (type === 'width') {
      child.ele.changeSize(value, height);
      this.setState({ width: value });
    } else if (type === 'height') {
      child.ele.changeSize(width, value);
      this.setState({ height: value });
    } else {
      console.error(`ChildSetting OnSizeChange 存在异常：type-${type}`);
    }
  };
  // onStepChange = (value: any) => {
  //   console.log(value);
  // };

  render() {
    const { child } = this.props;
    if (!child?.ele) return null;
    const { width, height } = this.state;
    return (
      child && (
        <div className="setting-child">
          <h3>子元素配置</h3>
          <FormGroup name="宽度" isInline={true}>
            <InputNumber
              min={1}
              max={2000}
              value={width}
              onChange={(e) => {
                this.onSizeChange('width', e);
              }}
            />
            {/* <Input value={child.node.width} /> */}
          </FormGroup>
          <FormGroup name="高度" isInline={true}>
            <InputNumber
              min={1}
              max={2000}
              value={height}
              onChange={(e) => {
                this.onSizeChange('height', e);
              }}
            />
          </FormGroup>
        </div>
      )
    );
  }
}

export default CardSetting;
