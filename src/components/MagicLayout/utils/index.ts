/**
 * Utils
 */

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

export const classNames = (target: any) => {
  if (isObject(target)) {
    return Object.entries(target)
      .filter((item) => item[1])
      .map((item) => item[0])
      .join(' ');
  } else if (isArray(target)) {
    return target.join(' ').trim();
  }
  return target;
};
