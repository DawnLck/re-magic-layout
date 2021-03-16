/* Page - index - tsx */

import './index.less';
import './draggable.less';

import { MockCard, ToolBar } from '../widgets';

import { Layout } from '../components';

import { Row, Col } from 'antd';

export default function IndexPage() {
  return (
    <Row className="page" gutter={{ xs: 8, sm: 16, md: 24 }}>
      <Col flex="300px" className="settings"></Col>
      <Col flex="auto" className="main">
        <ToolBar></ToolBar>

        <div className="platform">
          <Layout>
            <MockCard></MockCard>
            <MockCard></MockCard>
          </Layout>
        </div>
      </Col>
    </Row>
  );
}
