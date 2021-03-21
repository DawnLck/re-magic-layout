/**
 * Basic Tab 基础分页
 */

import React, { Component } from 'react';
import { LayoutSetting, CardSetting } from '@/widgets';
import { Divider } from 'antd';

class BasicTab extends Component {
  render() {
    return (
      <div className="tab-basic">
        <LayoutSetting />
        <Divider />
        <CardSetting />
      </div>
    );
  }
}

export default BasicTab;
