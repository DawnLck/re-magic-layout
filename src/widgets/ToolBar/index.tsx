/**
 * Widgets - toolbar
 *  */

import { Component, PureComponent } from 'react';

import { Row, Col, Button } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import './index.less';

export interface ToolBarProps {}

export interface ToolBarState {}

class ToolBar extends PureComponent<ToolBarProps, ToolBarState> {
  state = { toolbar: {} };
  render() {
    return (
      <Row className="toolbar">
        <Col>
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            size="middle"
          >
            Add new mock card
          </Button>
        </Col>
      </Row>
    );
  }
}

export default ToolBar;
