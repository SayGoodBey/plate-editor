const isEqual = (arr1: number[], arr2: number[]) => {
  return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
};

// point1 在 point2之前
export function isMinPoint(point1: Point, point2: Point) {
  if (isEqual(point1.path, point2.path)) {
    return point1.offset < point2.offset;
  }

  const len = Math.min(point1.path.length, point2.path.length);
  for (let i = 0; i < len; i++) {
    if (point1.path[i] < point2.path[i]) {
      return true;
    } else if (point1.path[i] > point2.path[i]) {
      return false;
    }
  }

  return point1.path.length < point2.path.length;
}
