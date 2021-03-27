/**
 * Basic Tab 基础分页
 */

import React, { Component } from 'react';
import { LayoutSetting, ChildSetting } from '@/widgets';
import { Divider } from 'antd';

interface BasicTabProps {
  state: any;
}
class BasicTab extends Component<BasicTabProps> {
  render() {
    const { activeChild } = this.props.state;
    return (
      <div className="tab-basic">
        <LayoutSetting />
        <Divider />
        <ChildSetting child={activeChild} />
      </div>
    );
  }
}

export default BasicTab;
