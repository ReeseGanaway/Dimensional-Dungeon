//function to calculate the distance between two tiles

export function manhattanDist(sx, sy, ex, ey, range) {
  sx /= 48;
  sy /= 48;
  ex = (ex - (ex % 48)) / 48;
  ey = (ey - (ey % 48)) / 48;
  console.log({ sx, sy, ex, ey });
  console.log(Math.abs(sx - ex) + Math.abs(sy - ey));
  let result = Math.abs(ex - sx) + Math.abs(ey - sy) <= range;
  return result;
}
