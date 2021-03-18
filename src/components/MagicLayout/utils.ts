/**
 * Utils
 */

export const isObject = (target: any): boolean => {
  return Object.prototype.toString.call(target) === '[object Object]';
};

export const isArray = (target: any): boolean => {
  return Array.isArray(target);
};

export const classNames = (target: any) => {
  const result = '';
  if (isObject(target)) {
    return Object.entries(target)
      .filter((item) => item[1])
      .map((item) => item[0])
      .join(' ');
  } else if (isArray(target)) {
    return target.join(' ');
  }
  return target;
};
