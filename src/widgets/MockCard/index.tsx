/**
 * Widgets - index.less
 */
import './index.less';
import PropTypes from 'prop-types';
import { Skeleton, Card } from 'antd';

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
      className={'mock-card-container ' + className}
      style={{ minWidth: props.width, minHeight: props.height, ...style }}
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
};

MockCard.defaultProps = {
  width: '100%',
  height: '100%',
  avatar: true,
};
