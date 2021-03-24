/* Page - index - tsx */

import './index.less';
import './draggable.less';

import React, { Component } from 'react';

import { ToolBar, SideBar } from '../blocks';
import { MockCard } from '../widgets';
import { MagicLayout } from '../components';
import { Row, Col } from 'antd';

import { mainStore } from '../store';
import store from '@/store/mainStore';

class IndexPage extends Component {
  state = {
    layout: 'free',
  };
  componentDidMount() {
    mainStore.subscribe(() => {
      const { layout } = mainStore.getState();
      this.setState({
        layout,
      });
    });
  }
  render() {
    const { layout } = this.state;
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }} className="page">
        <Col flex="300px" className="settings">
          <SideBar></SideBar>
        </Col>
        <Col flex="auto" className="main">
          <ToolBar></ToolBar>

          {/* 测试用例在这里 */}
          <div className="platform">
            <MagicLayout layout={layout}>
              <div
                className="ant-card demo-card"
                style={{ width: 400, height: 300, display: 'inline-block' }}
              ></div>
              <MockCard width={300} height={200}></MockCard>
              <MockCard width={300} height={200}></MockCard>
              <MockCard width={1200} height={200}></MockCard>
            </MagicLayout>
          </div>
        </Col>
      </Row>
    );
  }
}

export default IndexPage;
