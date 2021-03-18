/**
 * Setting Panel 配置面板
 */
import React, { Component } from 'react';
import { Radio } from 'antd';
import './index.less';
import FormGroup from '../FormGroup';
import { layoutTypeStore } from '../../store';

const optionsWithDisabled = [
  { label: 'Free', value: 'free' },
  { label: 'Float', value: 'float' },
  { label: 'Flex', value: 'flex' },
  { label: 'Grid', value: 'grid' },
];
class SettingPanel extends Component {
  state = {
    layoutType: 'free',
  };

  onLayoutTypeChange = (e: any) => {
    const { value } = e.target;
    this.setState({
      layoutType: value,
    });
    layoutTypeStore.dispatch({
      type: `layout/${value}`,
    });
  };

  render() {
    const { layoutType } = this.state;
    return (
      <div className="settings-panel">
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

export default SettingPanel;
