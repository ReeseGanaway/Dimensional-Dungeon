export default function tilesInMoveRange(x, y, cols, rows, movement) {
  let neighbors = { [[`${x},${y}`]]: { x: x, y: y } };
  let neighborsAdded = { [x + y]: { x: x, y: y } };
  let count = 0;

  while (count < movement) {
    let tempNeighborsAdded = neighborsAdded;
    neighborsAdded = {};

    for (const [key, value] of Object.entries(tempNeighborsAdded)) {
      let w = value.x;
      let l = value.y;
      if (w > 0) {
        neighborsAdded = {
          ...neighborsAdded,
          [`${w - 48},${l}`]: { x: w - 48, y: l },
        };
      }
      if (w / 48 < cols - 1) {
        neighborsAdded = {
          ...neighborsAdded,
          [`${w + 48},${l}`]: { x: w + 48, y: l },
        };
      }
      if (l / 48 < rows - 1) {
        neighborsAdded = {
          ...neighborsAdded,
          [`${w},${l + 48}`]: { x: w, y: l + 48 },
        };
      }
      if (l > 0) {
        neighborsAdded = {
          ...neighborsAdded,
          [`${w},${l - 48}`]: { x: w, y: l - 48 },
        };
      }
    }
    count++;
    neighbors = { ...neighbors, ...neighborsAdded };
  }

  return neighbors;
}
