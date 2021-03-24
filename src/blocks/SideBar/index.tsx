/**
 * Setting Panel 配置面板
 */
import React, { Component } from 'react';
import './index.less';
import { Divider, Tabs } from 'antd';
import { BasicTab, ConfigTab } from './tabs';

const { TabPane } = Tabs;

class SideBar extends Component {
  state = {
    layoutType: 'free',
    config: '',
  };

  onTabsChange = (key: string) => {
    console.log(key);
    if (key === '2') {
      this.setState({ config: window.localStorage.getItem('currConfig') });
    }
  };

  render() {
    const { config } = this.state;
    return (
      <div className="settings-panel">
        <Tabs
          defaultActiveKey="1"
          onChange={this.onTabsChange}
          // type="card"
          size="small"
          centered
        >
          <TabPane tab="基础" key="1">
            <BasicTab></BasicTab>
          </TabPane>
          <TabPane tab="状态" key="2">
            <ConfigTab data={config}></ConfigTab>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default SideBar;
