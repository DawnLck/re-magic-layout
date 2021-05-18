/* Page - index - tsx */

import './index.less';
import './draggable.less';

import React, { Component, createRef } from 'react';

import { ToolBar, SideBar } from '../blocks';
import { Row, Col, message } from 'antd';
import { MockCard } from '../widgets';

// import { mainStore } from '../store';

import { MagicLayout, ChildWrapper } from '../components';
import { LayoutItem } from '@/components/typings';

class IndexPage extends Component<any, any> {
  public magicLayoutRef: any;
  constructor(props: any) {
    super(props);
    this.state = {
      layout: [
        {
          uid: 'uid_test_008',
          width: 120,
          height: 60,
          x: 20,
          y: 20,
          zIndex: 100,
        },
        {
          uid: 'uid_test_007',
          width: 80,
          height: 80,
          x: 300,
          y: 20,
          zIndex: 100,
        },
        {
          uid: 'uid_test_001',
          width: 200,
          height: 150,
          x: 200,
          y: 150,
          zIndex: 100,
        },
      ],
      layoutType: 'free',
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

  handleConfigChange = (config: any) => {
    this.setState({ config });
  };

  handleToolbar = (event: any) => {
    message.info(event);
  };

  handleLayoutChange = (layout: LayoutItem[]) => {
    console.log(layout[0].x, layout[0].y);
    this.setState({ layout: [...layout] });
  };

  render() {
    const layoutType = 'free';
    const { layout } = this.state;

    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }} className="page">
        <Col flex="300px" className="settings">
          <SideBar config={this.state.config} layout={layout}></SideBar>
        </Col>
        <Col flex="auto" className="main">
          <ToolBar onClick={this.handleToolbar}></ToolBar>

          {/* 测试用例在这里 */}
          <div className="platform">
            <MagicLayout
              ref={this.magicLayoutRef}
              layout={layout}
              layoutType={layoutType}
              autoWrapChildren={false}
              onStateChange={this.handleConfigChange}
              onLayoutChange={this.handleLayoutChange}
            >
              <ChildWrapper uid="uid_test_008">
                <div
                  className="ant-card demo-card"
                  data-uid="uid_test_008"
                ></div>
              </ChildWrapper>
              <ChildWrapper uid="uid_test_007">
                <div className="ant-card demo-card"></div>
              </ChildWrapper>

              <ChildWrapper
                defaultPosition={{ x: 350, y: 200 }}
                uid="uid_test_001"
              >
                <div className="ant-card demo-card"></div>
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
