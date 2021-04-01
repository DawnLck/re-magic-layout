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

interface InputGroupProps {
  name: string;
  value: number;
  onChange: (e: number) => void;
  min?: number;
  max?: number;
}

const SettingAttrs = [
  {
    name: '宽度',
    key: 'width',
  },
  {
    name: '高度',
    key: 'height',
  },
  {
    name: '边框',
    key: 'border',
  },
  {
    name: 'zIndex',
    key: 'zIndex',
  },
];

const InputGroup = (props: InputGroupProps) => {
  const { name, value, onChange, min = 0, max = 2000 } = props;
  return (
    <FormGroup name={name} isInline={true}>
      <InputNumber min={min} max={max} value={value} onChange={onChange} />
    </FormGroup>
  );
};

class CardSetting extends Component<CardSettingProps, CardSettingState> {
  constructor(props: any) {
    super(props);

    const { child } = props;
    const { ele, state, uid } = child;

    console.log('constructor');
    let initState = {
      width: 0,
      height: 0,
      border: 0,
      deltaPosition: {
        x: 0,
        y: 0,
      },
      zIndex: 0,
    };

    // if (ele) {
    //   const { width, height, border, deltaPosition, zIndex } = state;
    //   initState = {
    //     width,
    //     height,
    //     border,
    //     deltaPosition,
    //     zIndex,
    //   };
    // }

    this.state = initState;
  }

  componentDidMount() {
    console.log('didMount');
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.props !== prevProps && this.props.child?.ele) {
      this.setState(this.props.child.state);
    }
  }

  onSizeChange = (type: string, value: number) => {
    let { child } = this.props;
    const { width, height } = this.state;

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

  onAttrChange = (attr: string, value: any) => {
    let { child } = this.props;
    const newState = Object.fromEntries([[attr, value]]);
    child.ele.updateState(newState);
    this.setState(newState as any);
  };

  render() {
    const { width, height } = this.state;
    if (!this.props.child?.ele) return <></>;

    const state: any = this.state;

    return (
      <div className="setting-child">
        <h3>子元素配置</h3>
        {SettingAttrs.map((item) => {
          const { name, key } = item;
          return (
            <InputGroup
              key={name}
              name={name}
              value={state[key]}
              onChange={(e) => {
                this.onAttrChange(key, e);
              }}
            ></InputGroup>
          );
        })}
      </div>
    );
  }
}

export default CardSetting;
