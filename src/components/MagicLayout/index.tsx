/**
 * Magic Layout
 */

import React, { cloneElement, Component, createRef, ReactNode } from 'react';

import './index.less';

import { classNames, colorLog, mathBetween } from '@/utils';
import { collectChildrenData, collectChildData, getDirection } from './handle';

import { MagicLayoutProps, MagicState, ChildNode } from './interface';
import { MagicDraggingData } from '../interface';

import ChildWrapper, { ChildData } from '../ChildWrapper';
import GuideLines from '../GuideLines';

const MagneticThreshold = 10.1;

export default class MagicLayout extends Component<
  MagicLayoutProps,
  MagicState,
  any
> {
  public $ref: any;
  static defaultProps = {
    autoWrapChildren: false, // 默认需要用户自己包裹元素
    onStateChange: (state: MagicState) => state,
  };

  constructor(props: MagicLayoutProps) {
    super(props);
    this.$ref = createRef();
    this.state = {
      // TODOs: 废弃的状态，activeChild =》 selects
      activeChild: {
        uid: null,
        ele: null,
        state: null,
      },
      // 新版本在用的状态
      selects: [],
      selectMode: 'single',
      target: null,
      compares: [],
    };
  }

  element: HTMLDivElement | null = null;

  config: any = {
    layout: '',
    mode: '',
    children: {},
  };

  $children: any[] = [];

  onChildrenClick = (e: React.MouseEvent, key: string) => {
    colorLog('green', `[MagicLayout]`, `OnChildrenClick`);

    e.preventDefault();
    e.stopPropagation();

    const { selects, selectMode } = this.state;

    if (selects.includes(key)) return;

    this.setState({
      selects: selectMode === 'single' ? [key] : [...selects, key],
    });
  };

  configUpdate = () => {
    this.props.onConfigChange(this.config);
  };

  onChildStateUpdate = (data: ChildData) => {
    const { key, ele, state } = data;
    const { children } = this.config;
    if (key) {
      children[key] = state;
    } else {
      console.error('该子元素缺少key或者uid', ele);
      return;
    }
    console.log('[MagicLayout]: Child State Update', this.config);
  };

  unsetLayout = () => {
    this.setState({
      selects: [],
    });
  };

  /** LifeCycle Hooks */
  componentDidUpdate() {
    colorLog('red', `[MagicLayout]`, `Did Update`);
    // this.config = buildConfig(this.props);
    // const { onStateChange } = this.props;
    // onStateChange(this.state);
  }

  // shouldComponentUpdate(newProps: MagicLayoutProps, newState: MagicState) {
  //   const { layout } = this.props;
  //   const { selects } = this.state;
  //   console.log({ selects, new: newState.selects });

  //   return layout !== newProps.layout || selects !== newState.selects;
  // }

  componentDidMount() {
    // this.config = buildConfig(this.props);
    this.config.layout = this.props.layout;
  }

  // onDragStart 拖拽初始时 计算出所有元素的坐标信息，存储于this.$children
  onChildDragStart = () => {
    colorLog('yellow', `[MagicLayout]`, `onDragStart`);
    const { childNodes } = this.$ref.current;
    this.$children = collectChildrenData(childNodes);
  };

  onChildDragging = (uid: string) => {
    return (data: MagicDraggingData) => {
      colorLog('yellow', `[MagicLayout]`, `onDragging ${uid}`);
      const { x, y, deltaX, deltaY, lastX, lastY, width, height } = data;
      const direction = getDirection(deltaX, deltaY);
      let adjustX = lastX,
        adjustY = lastY;

      // console.log('Direction: ', direction, deltaX, deltaY);

      // GuideLines
      const {
        childNodes,
        scrollHeight: boundBottom,
        scrollWidth: boundRight,
      } = this.$ref.current as HTMLElement;

      adjustX = mathBetween(adjustX, 0, boundRight - width);
      adjustY = mathBetween(adjustY, 0, boundBottom - height);

      // console.log({ adjustX, adjustY });

      const nodesArray = Array.from(childNodes);
      const target = nodesArray.find((child: any) => {
        return child.dataset.uid === uid;
      });
      const compares = nodesArray.filter(
        (node: any) => node.dataset.uid !== uid,
      );

      // TODO: 这里需要做一些处理，做吸附操作
      let targetData: { [key: string]: any } = collectChildData(
        target as HTMLElement,
      );
      const comparesData: { [key: string]: any }[] = collectChildrenData(
        compares,
      );

      // console.log({
      //   width,
      //   height,
      //   targetW: targetData.width,
      //   targetH: targetData.height,
      // });

      // const { x: targetNodeX, y: targetNodeY } = targetData;
      // console.log({ x, y, targetNodeX, targetNodeY, deltaX, deltaY });

      // if (targetData.x < 0) targetData.x = 0;
      // else if (targetData)
      // console.log({ targetData, comparesData });
      // console.log({
      //   targetData: targetData[direction],
      //   comparesData: comparesData.map((item) => item[direction]),
      // });

      // 处理吸附逻辑开始
      // const _target = targetData[direction];
      // const magnetic = {
      //   distance: MagneticThreshold,
      //   x: targetData.x + deltaX,
      //   y: targetData.y + deltaY,
      // };
      // comparesData.map((item) => {
      //   const _compare = item[direction];
      //   const _distance = Math.abs(_compare - _target);
      //   if (_distance < magnetic.distance) {
      //     magnetic.distance = _distance;
      //     targetData[direction] = _compare;
      //     switch (direction) {
      //       case 'left':
      //         magnetic.x = _compare;
      //         break;
      //       case 'right':
      //         magnetic.x = _compare - _target.width;
      //         break;
      //       case 'top':
      //         magnetic.y = _compare;
      //       case 'bottom':
      //         magnetic.y = _compare - _target.height;
      //     }
      //   }
      // });

      // if (magnetic.distance !== MagneticThreshold) {
      //   debugger;
      // }

      // targetData.x = magnetic.x;
      // targetData.y = magnetic.y;

      this.setState({ target: targetData, compares: comparesData });

      return { adjustX, adjustY };
    };
  };

  // wrapChildren 为子元素包裹一层
  wrapChildren = (child: any, uid: any) => {
    const { selects } = this.state;

    return (
      <ChildWrapper
        key={uid}
        uid={uid}
        selected={selects.includes(uid)}
        onClick={(e) => {
          this.onChildrenClick(e, uid);
        }}
        onDragStart={this.onChildDragStart}
        onDragging={this.onChildDragging(uid)}
        // handleClick={this.onChildrenClick}
        handleStateUpdate={() => {}}
      >
        {child}
      </ChildWrapper>
    );
  };

  // renderChildren 渲染子元素
  renderChildren = () => {
    colorLog('green', `[MagicLayout]`, `renderChildren`);
    const { children, autoWrapChildren } = this.props;
    const { selects } = this.state;

    if (Array.isArray(children)) {
      return children.map((child: any, index) => {
        const { uid, 'data-uid': dataUID } = child.props;
        const uniqueKey = uid || dataUID || `child_${index}`;

        if (!autoWrapChildren) {
          return cloneElement(child, {
            uid: uniqueKey,
            key: uniqueKey,
            onClick: (e) => {
              this.onChildrenClick(e, uniqueKey);
            },
            onDragStart: this.onChildDragStart,
            onDragging: this.onChildDragging(uniqueKey),
            selected: selects.includes(uniqueKey),
            handleStateUpdate: () => {},
          });
        } else {
          return this.wrapChildren(child, uniqueKey);
        }
      });
    } else {
      return children;
    }
  };

  render() {
    const { layout } = this.props;
    const { target, compares } = this.state;

    return (
      <div className={classNames(['re-magic-layout', `layout-${layout}`])}>
        <div
          className={'re-magic-layout-children'}
          ref={this.$ref}
          onClick={this.unsetLayout}
        >
          {this.renderChildren()}
        </div>
        <div className={'re-magic-layout-tools'}>
          <GuideLines target={target} compares={compares}></GuideLines>
        </div>
      </div>
    );
  }
}
