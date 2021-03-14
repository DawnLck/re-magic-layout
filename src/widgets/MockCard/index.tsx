/**
 * Widgets - index.less
 */
import './index.less';
import PropTypes from 'prop-types';
import { Skeleton, Card } from 'antd';
export default function MockCard(props: any) {
  return (
    <Card
      className="mock-card"
      size={props.size}
      style={{ width: props.width, height: props.height }}
    >
      <Skeleton avatar={props.avatar} paragraph={{ rows: 4 }} />
    </Card>
  );
}

MockCard.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  avatar: PropTypes.bool,
};

MockCard.defaultProps = {
  width: 400,
  height: 250,
  avatar: true,
};
