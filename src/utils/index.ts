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
