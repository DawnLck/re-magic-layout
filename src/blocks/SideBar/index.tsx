/**
 * Setting Panel 配置面板
 */
import React, { Component } from 'react';
import './index.less';
import { Divider, Tabs } from 'antd';
import { BasicTab, ConfigTab } from './tabs';
import { MagicLayoutState } from '../../components/MagicLayout';

const { TabPane } = Tabs;

interface SideBarProps {
  layout: any[];
  config: MagicLayoutState;
}
class SideBar extends Component<SideBarProps> {
  state = {
    layoutType: 'free',
    config: '',
  };

  onTabsChange = (key: string) => {
    // console.log(this.props.config);
    if (key === '2') {
      const { config } = this.props;
      // if (config?.current?.config) {
      //   // this.setState({ config: config.current.config });
      // }
      // this.setState({ config: window.localStorage.getItem('currConfig') });
    }
  };

  render() {
    const { config } = this.state;
    const { layout } = this.props;
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
            {/* <BasicTab state={state}></BasicTab> */}
          </TabPane>
          <TabPane tab="状态" key="2">
            <ConfigTab data={layout}></ConfigTab>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default SideBar;
