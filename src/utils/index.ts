export const pick = (props: string[], obj: Record<string, any> = {}) => {
  const newObj: Record<string, any> = {};
  props.forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};
