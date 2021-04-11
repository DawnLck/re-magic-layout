/* Page - index - tsx */

import './index.less';
import './draggable.less';

import React, { Component, createRef } from 'react';

import { ToolBar, SideBar } from '../blocks';
import { Row, Col } from 'antd';
import { MockCard } from '../widgets';

// import { mainStore } from '../store';

import { MagicLayout, ChildWrapper } from '../components';

class IndexPage extends Component<any, any> {
  public magicLayoutRef: any;
  constructor(props: any) {
    super(props);
    this.state = {
      layout: 'free',
      activeChild: {
        uid: null,
      },
    };
    this.magicLayoutRef = createRef();
  }

  config = null;
  componentDidMount() {
    // const { layout: oldLayout } = this.state;
    // mainStore.subscribe(() => {
    //   const { layout: newLayout } = mainStore.getState();
    //   this.setState({
    //     layout: newLayout,
    //   });
    // });
  }
  hanldeStateChange = (data: any) => {
    console.log('[Pages]: State Change', data);
    const { activeChild } = data;
    const { layout } = this.state;

    this.setState({ layout, activeChild });
  };
  handleConfigChange = (config: any) => {
    this.setState({ config });
  };
  render() {
    const { layout } = this.state;
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }} className="page">
        <Col flex="300px" className="settings">
          <SideBar state={this.state} config={this.magicLayoutRef}></SideBar>
        </Col>
        <Col flex="auto" className="main">
          <ToolBar></ToolBar>

          {/* 测试用例在这里 */}
          <div className="platform">
            <MagicLayout
              ref={this.magicLayoutRef}
              layout={layout}
              autoWrapChildren={false}
              onStateChange={this.hanldeStateChange}
              onConfigChange={this.handleConfigChange}
            >
              <ChildWrapper>
                <div
                  className="ant-card demo-card"
                  data-uid="uid_test_008"
                  style={{ width: 80, height: 60, display: 'inline-block' }}
                >
                  uid_test_008
                </div>
              </ChildWrapper>
              <ChildWrapper>
                <div
                  className="ant-card demo-card"
                  data-uid="uid_test_007"
                  style={{ width: 80, height: 60, display: 'inline-block' }}
                >
                  uid_test_007
                </div>
              </ChildWrapper>

              <ChildWrapper>
                <div
                  className="ant-card demo-card"
                  data-uid="uid_test_001"
                  style={{ width: 100, height: 120, display: 'inline-block' }}
                >
                  uid_test_001
                </div>
              </ChildWrapper>

              {/* <MockCard width={80} height={40}></MockCard> */}
              {/* <MockCard uid="uid_test_001" width={300} height={200}></MockCard> */}
              {/* <MockCard width={800} height={200}></MockCard> */}
            </MagicLayout>
          </div>
        </Col>
      </Row>
    );
  }
}

export default IndexPage;
