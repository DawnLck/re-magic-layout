/**
 * Widgets - index.less
 */
import './index.less';
import PropTypes from 'prop-types';
import { Skeleton, Card } from 'antd';

import { classNames } from '@/utils';

export default function MockCard(props: any) {
  const {
    className,
    style,
    onMouseDown,
    onMouseUp,
    onTouchStart,
    onTouchEnd,
  } = props;
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={classNames(['mock-card-container', className])}
      style={{ width: props.width, height: props.height, ...style }}
    >
      <Card
        className="mock-card"
        size={props.size}
        style={{ height: '100%', width: '100%' }}
      >
        <Skeleton avatar={props.avatar} paragraph={{ rows: 3 }} />
      </Card>
    </div>
  );
}

MockCard.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  avatar: PropTypes.bool,
  uid: PropTypes.string,
};

MockCard.defaultProps = {
  width: '100%',
  height: '100%',
  avatar: true,
};
