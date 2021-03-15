/* Page - index - tsx */

import './index.less';

import { MockCard } from '../widgets';

import { Row, Col } from 'antd';

export default function IndexPage() {
  return (
    <Row className="page" gutter={{ xs: 8, sm: 16, md: 24 }}>
      <Col flex="300px" className="settings"></Col>
      <Col flex="auto" className="main">
        <div className="control"></div>
        <div className="container">
          <MockCard width={400} height={250}></MockCard>
        </div>
      </Col>
    </Row>
  );
}
