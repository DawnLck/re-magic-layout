/**
 * Setting Panel 配置面板
 */
import React, { Component } from 'react';
import './index.less';
import { Divider, Tabs } from 'antd';
import { BasicTab, ConfigTab } from './tabs';

const { TabPane } = Tabs;

function onTabsChange(key: string) {
  console.log(key);
}

class SideBar extends Component {
  state = {
    layoutType: 'free',
  };

  render() {
    return (
      <div className="settings-panel">
        <Tabs
          defaultActiveKey="1"
          onChange={onTabsChange}
          // type="card"
          size="small"
          centered
        >
          <TabPane tab="基础" key="1">
            <BasicTab></BasicTab>
          </TabPane>
          <TabPane tab="状态" key="2">
            <ConfigTab></ConfigTab>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default SideBar;
