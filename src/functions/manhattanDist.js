//function to calculate the distance between two tiles
//and returns true/false depending if it fits in the range given

export function manhattanDistBool(sx, sy, ex, ey, range) {
  sx /= 48;
  sy /= 48;

  ex = (ex - (ex % 48)) / 48;
  ey = (ey - (ey % 48)) / 48;

  let result = Math.abs(ex - sx) + Math.abs(ey - sy) <= range;

  return result;
}

//function to calculate the distance between two tiles
//and returns the distance

export function manhattanDistInt(sx, sy, ex, ey) {
  sx /= 48;
  sy /= 48;

  ex = (ex - (ex % 48)) / 48;
  ey = (ey - (ey % 48)) / 48;

  return Math.abs(ex - sx) + Math.abs(ey - sy);
}
