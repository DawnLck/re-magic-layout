/**
 * Magic Layout
 */

import React, { cloneElement, Component, createRef, ReactNode } from 'react';

import './index.less';

import { classNames, colorLog, mathBetween } from '@/utils';
import { collectChildrenData, collectChildData, getDirection } from './handle';

import { MagicLayoutProps, MagicState, ChildNode } from './interface';
import { MagicDraggingData } from '../typings';

import ChildWrapper, { ChildData } from '../ChildWrapper';
import GuideLines from '../GuideLines';

const MagneticThreshold = 20.1;

export default class MagicLayout extends Component<
  MagicLayoutProps,
  MagicState,
  any
> {
  public $ref: any;
  public $compares: {
    nodes: any;
    data: any[];
  };

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
    this.$compares = {
      nodes: null,
      data: [],
    };
  }

  element: HTMLDivElement | null = null;

  config: any = {
    layout: '',
    mode: '',
    children: {},
  };

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
  onChildDragStart = (uid: string) => {
    return () => {
      colorLog('yellow', `[MagicLayout]`, `onDragStart`);
      const { childNodes } = this.$ref.current;

      // 获取并缓存对比节点的数据
      const nodesArray = Array.from(childNodes);
      const _compareNodes = nodesArray.filter(
        (node: any) => node.dataset.uid !== uid,
      );
      this.$compares = {
        nodes: _compareNodes,
        data: collectChildrenData(_compareNodes),
      };
    };
  };

  // 把范围限制在画布以内
  limitDragRange = (x: number, y: number, width: number, height: number) => {
    const { scrollHeight: boundBottom, scrollWidth: boundRight } = this.$ref
      .current as HTMLElement;
    return {
      x: mathBetween(x, 0, boundRight - width),
      y: mathBetween(y, 0, boundBottom - height),
    };
  };

  // onChildDragging 拖拽时计算辅助参考线和吸附
  onChildDragging = (uid: string) => {
    return (data: MagicDraggingData) => {
      colorLog('yellow', `[MagicLayout]`, `onDragging ${uid}`);
      const {
        x: targetX,
        y: targetY,
        deltaX,
        deltaY,
        lastX,
        lastY,
        width,
        height,
      } = data;

      const directionData = getDirection(deltaX, deltaY);

      let { x: adjustX, y: adjustY } = this.limitDragRange(
        lastX,
        lastY,
        width,
        height,
      );

      const comparesData = this.$compares.data;

      // 处理吸附逻辑开始
      const {
        related: relatedBounds,
        delta: directionDelta,
        standardDelta,
        towards,
      } = directionData;
      let magneticArray: any = [];

      const _target = data[towards];
      comparesData.forEach((item) => {
        relatedBounds.forEach((bound) => {
          const _compare = item[bound];
          const _distance = Math.abs(_compare - _target);
          magneticArray.push({ distance: _distance, bound, value: _compare });
        });
      });

      magneticArray = magneticArray.sort(
        (a: any, b: any) => a.distance - b.distance,
      );

      const _adjust = magneticArray[0];

      if (_adjust && _adjust.distance < MagneticThreshold) {
        // debugger;
        const { bound, value } = _adjust;
        switch (towards) {
          case 'right':
            data.x = value - data.width;
            data.right = value;
            data.left = value - data.width;
            adjustX = value - data.width;
            break;
          case 'left':
            data.x = value;
            data.right = value + data.width;
            data.left = value;
            adjustX = value;
            break;
          case 'top':
            data.y = value;
            data.top = value;
            data.bottom = value + data.height;
            adjustY = value;
            break;
          case 'bottom':
            data.y = value - data.height;
            data.top = value - data.height;
            data.bottom = value;
            adjustY = value - data.height;
            break;
        }
      }

      console.log({ magneticArray, adjustX, adjustY });

      this.setState({ target: data, compares: comparesData });

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
        _click={(e) => {
          this.onChildrenClick(e, uid);
        }}
        _dragStart={this.onChildDragStart(uid)}
        _dragging={this.onChildDragging(uid)}
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
            _click: (e: any) => {
              this.onChildrenClick(e, uniqueKey);
            },
            _dragStart: this.onChildDragStart(uniqueKey),
            _dragging: this.onChildDragging(uniqueKey),
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
