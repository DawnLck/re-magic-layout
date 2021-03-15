/* Page - index - tsx */

import './index.less';

import { MockCard, ToolBar } from '../widgets';

import { Row, Col } from 'antd';

export default function IndexPage() {
  return (
    <Row className="page" gutter={{ xs: 8, sm: 16, md: 24 }}>
      <Col flex="300px" className="settings"></Col>
      <Col flex="auto" className="main">
        <ToolBar></ToolBar>

        <div className="container">
          <MockCard></MockCard>
        </div>
      </Col>
    </Row>
  );
}
