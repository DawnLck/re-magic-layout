/**
 * Widgets - index.less
 */
import './index.less';
import PropTypes from 'prop-types';
import { Skeleton, Card } from 'antd';

import { DraggableEventHandler } from 'react-draggable';

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
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={'mock-card-container ' + className}
    >
      <Card
        className="mock-card"
        size={props.size}
        style={{ width: props.width, height: props.height }}
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
  width: 300,
  height: 200,
  avatar: true,
};
