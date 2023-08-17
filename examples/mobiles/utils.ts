export const rgbToHex16DomFormatString = (dom: string, color?: string) => {
  if (dom.indexOf('rgb') >= 0) {
    return `${dom}`
      .replace(/rgb\(223,\s+59,\s+8\)/g, color || '#df3b08')
      .replace(/rgb\(35,\s+35,\s+35\)/g, color || '#232323');
  }
  return dom;
};

export const textFormat = (text: string) => {
  return text.replace(/[\u200B-\u200D\uFEFF]/g, '') || '';
};

export const setRgbTo16 = (color: string) => {
  const reg = /^(rgb|RGB)/;
  if (!reg.test(color)) {
    return color;
  }
  // 将str中的数字提取出来放进数组中
  const arr = color.slice(4, color.length - 1).split(',');
  let c = '#';
  for (let i = 0; i < arr.length; i++) {
    // Number() 函数把对象的值转换为数字
    // toString(16) 将数字转换为十六进制的字符表示
    let t = Number(arr[i]).toString(16);
    //如果小于16，需要补0操作,否则只有5位数
    if (Number(arr[i]) < 16) {
      t = '0' + t;
    }
    c += t;
  }
  return c;
};
