/**
 * Layout Setting
 */

import React, { Component } from 'react';
import { Radio } from 'antd';

import FormGroup from '../FormGroup';
import { mainStore } from '../../store';

const optionsWithDisabled = [
  { label: 'Free', value: 'free' },
  { label: 'Float', value: 'float' },
  { label: 'Flex', value: 'flex' },
  { label: 'Grid', value: 'grid' },
];

class LayoutSetting extends Component {
  state = {
    layoutType: 'free',
  };

  onLayoutTypeChange = (e: any) => {
    const { value } = e.target;
    this.setState({
      layoutType: value,
    });
    mainStore.dispatch({
      type: `layout`,
      value,
    });
  };

  render() {
    const { layoutType } = this.state;
    return (
      <div className="setting-layout">
        <h3>画布配置</h3>
        <FormGroup name="选择布局" model={this.state.layoutType}>
          <Radio.Group
            options={optionsWithDisabled}
            onChange={this.onLayoutTypeChange}
            value={layoutType}
            optionType="button"
            buttonStyle="solid"
          />
        </FormGroup>
      </div>
    );
  }
}

export default LayoutSetting;
