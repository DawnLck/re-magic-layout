/* Page - index - tsx */

import './index.less';

import { MockCard } from '../widgets';

export default function IndexPage() {
  return (
    <div className="page">
      <div className="control"></div>
      <div className="container">
        <MockCard width={400} height={250}></MockCard>
      </div>
    </div>
  );
}
