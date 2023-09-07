import { Value } from '@udecode/slate';

export * from './serialize';

export const pick = (props: string[], obj: Record<string, any> = {}) => {
  const newObj: Record<string, any> = {};
  props.forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

export function getImageCount(nodes: Value) {
  let count = 0;

  for (const node of nodes) {
    if (node.type === 'img') {
      count++;
    }

    if (node.children) {
      count += getImageCount(node.children as Value);
    }
  }

  return count;
}

export function styleStringToObject(styleString: string) {
  const styleObj: Record<string, string> = {};

  // 将样式字符串切割为数组
  const styles = styleString.split(';');

  // 遍历数组,获取样式键值对
  styles.forEach((style) => {
    // 去掉空格
    const trimmed = style.trim();

    // 分割关键字和值
    const [key, value] = trimmed.split(':');

    // 赋值到对象
    styleObj[key] = value;
  });

  return styleObj;
}
