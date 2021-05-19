/**
 * Widgets - toolbar
 *  */

import { Component, PureComponent } from 'react';

import { Row, Col, Button } from 'antd';

import styles from './index.module.less';

import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2553445_rk0gr30093m.js',
});

export interface ToolBarProps {
  onClick: (event: string, value?: any) => void;
}

export interface ToolBarState {}

export type ToolType = {
  name: string;
  disabled: boolean;
  event?: string;
  icon?: any;
  value?: any;
};

const Tools: ToolType[] = [
  {
    name: '撤销',
    disabled: true,
  },
  {
    name: '重置',
    disabled: true,
  },
  {
    name: '预览',
    disabled: true,
  },
  {
    name: '导出',
    disabled: true,
  },
  {
    name: '新增',
    event: 'append',
    disabled: false,
  },
  {
    name: '删除',
    disabled: true,
  },
  {
    name: '上移一层',
    event: 'zIndex',
    value: 1,
    icon: <IconFont type="icon-control-up" />,
    disabled: false,
  },
  {
    name: '下移一层',
    event: 'zIndex',
    value: -1,
    icon: <IconFont type="icon-control-down" />,
    disabled: false,
  },
];
class ToolBar extends PureComponent<ToolBarProps, ToolBarState> {
  state = { toolbar: {} };
  render() {
    const { onClick } = this.props;
    return (
      <Row className={styles.toolbar}>
        <Col>
          {Tools.map((tool) => {
            const { icon, name, disabled, event, value } = tool;
            return (
              <Button
                key={name || event}
                type={icon ? 'default' : 'primary'}
                className={styles.item}
                disabled={tool.disabled}
                onClick={(e) => {
                  onClick(event!, value);
                }}
              >
                {tool.icon || tool.name}
              </Button>
            );
          })}
        </Col>
      </Row>
    );
  }
}

export default ToolBar;
