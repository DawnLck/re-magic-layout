/**
 * Utils
 */

const COLORS: { [key: string]: string } = {
  red: '#e98288',
  green: '#a8cc8c',
  yellow: '#dbab79',
  blue: '#357edd',
  magenta: '#bf83d0',
  cyan: '#66c2cd',
};

export const colorLog = (color: string, title: string, value?: any) => {
  // @ts-ignore
  console.log(
    `%c${title}: `,
    `color: #000; background:${COLORS[color]}`,
    value,
  );
};

function checkObjectType(target: any, type: string) {
  return Object.prototype.toString.call(target) === `[object ${type}]`;
}

export const isObject = (target: any): boolean => {
  return checkObjectType(target, 'Object');
};

export const isArray = (target: any): boolean => {
  return Array.isArray(target);
};

export const isString = (target: any): boolean => {
  return checkObjectType(target, 'String');
};

export const isFunction = (target: any): boolean => {
  return checkObjectType(target, 'Function');
};

export const classNames = (...props: any[]) => {
  return props.reduce((prev, curr) => {
    if (isObject(curr)) {
      return Object.entries(curr)
        .filter((item) => item[1])
        .map((item) => item[0])
        .join(' ');
    } else if (isArray(curr)) {
      return curr.join(' ').trim();
    }
  }, '');
};

export const debounce = (fn: (...args: any) => any, delay: number = 1000) => {
  let timeHandler: any = null;
  return (...args: any) => {
    let that = this;
    if (timeHandler) clearTimeout(timeHandler);
    timeHandler = setTimeout(() => {
      fn.apply(that, args);
      clearTimeout(timeHandler);
    }, delay);
  };
};

// 驼峰转换连线
export function camelToLine(name: string | undefined) {
  return name && name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// 无意义函数，用于占位
export const noop = () => {};

// Math.between, 取两值范围内的值
export const mathBetween = (target: number, min: number, max: number) => {
  return Math.min(max, Math.max(target, min));
};

export const buildBoundaries = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  return { top: y, right: x + width, bottom: y + height, left: x };
};
export const clearEvent = (e: Event | MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
