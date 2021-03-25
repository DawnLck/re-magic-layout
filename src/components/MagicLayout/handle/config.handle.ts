/**
 * Config Handle ts
 */

import { isString } from '@/utils';

export function getConfigFromChildElement(ele: any) {
  const { type, props, key } = ele;
  const { className, width: attrWidth, height: attrHeight, style } = props;
  const name = isString(type) ? type : type.name;
  const width = attrWidth || style.width || '100%';
  const height = attrHeight || style.height || '100%';
  return { key, name, width, height, className };
}

export function updateLocalConfig(data: any) {
  window.localStorage.setItem('currConfig', JSON.stringify(data, null, 2));
}

export function buildConfig(props: any): any {
  const { layout, children } = props;

  const childrenConfig = (children as any).map((element: any) => {
    const childConfig = getConfigFromChildElement(element);
    return childConfig;
  });

  const config = {
    layout: layout,
    children: childrenConfig,
  };
  updateLocalConfig(config);
  return config;
}
