/* Page - index - tsx */

import './index.less';
import './draggable.less';

import React, { Component } from 'react';

import { ToolBar, SideBar } from '../blocks';
import { MockCard } from '../widgets';
import { MagicLayout } from '../components';
import { Row, Col } from 'antd';

import { mainStore } from '../store';

class IndexPage extends Component {
  state = {
    layout: 'free',
    activeChild: {
      uid: null,
    },
  };
  componentDidMount() {
    // const { layout: oldLayout } = this.state;

    mainStore.subscribe(() => {
      const { layout: newLayout } = mainStore.getState();
      this.setState({
        layout: newLayout,
      });
    });
  }
  hanldeStateChange = (data: any) => {
    console.log('State Change', data);
    const { activeChild } = data;
    const { layout } = this.state;

    this.setState({ layout, activeChild });
  };
  render() {
    const { layout } = this.state;
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }} className="page">
        <Col flex="300px" className="settings">
          <SideBar state={this.state}></SideBar>
        </Col>
        <Col flex="auto" className="main">
          <ToolBar></ToolBar>

          {/* 测试用例在这里 */}
          <div className="platform">
            <MagicLayout layout={layout} onStateChange={this.hanldeStateChange}>
              <div
                className="ant-card demo-card"
                data-uid="uid_test_007"
                style={{ width: 400, height: 300, display: 'inline-block' }}
              ></div>
              <MockCard width={300} height={200}></MockCard>
              <MockCard uid="uid_test_001" width={300} height={200}></MockCard>
              <MockCard width={800} height={200}></MockCard>
            </MagicLayout>
          </div>
        </Col>
      </Row>
    );
  }
}

export default IndexPage;
