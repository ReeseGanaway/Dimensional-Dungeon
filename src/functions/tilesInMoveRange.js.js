export default function tilesInMoveRange(
  x,
  y,
  cols,
  rows,
  movement,
  playerTeam,
  enemyTeam
) {
  let neighbors = { [[`${x},${y}`]]: { x: x, y: y } };
  let neighborsAdded = { [x + y]: { x: x, y: y } };
  let count = 0;
  let obstacleGrid = Array(10)
    .fill()
    .map(() => Array(10).fill(0));
  for (const [key, value] of Object.entries(playerTeam)) {
    obstacleGrid[value.position.y / 48][value.position.x / 48] = 1;
  }
  for (const [key, value] of Object.entries(enemyTeam)) {
    obstacleGrid[value.position.y / 48][value.position.x / 48] = 1;
  }

  while (count < movement) {
    let tempNeighborsAdded = neighborsAdded;
    neighborsAdded = {};

    for (const [key, value] of Object.entries(tempNeighborsAdded)) {
      let w = value.x;
      let l = value.y;
      if (w > 0) {
        if (!obstacleGrid[l / 48][(w - 48) / 48])
          neighborsAdded = {
            ...neighborsAdded,
            [`${w - 48},${l}`]: { x: w - 48, y: l },
          };
      }
      if (w / 48 < cols - 1) {
        if (!obstacleGrid[l / 48][(w + 48) / 48])
          neighborsAdded = {
            ...neighborsAdded,
            [`${w + 48},${l}`]: { x: w + 48, y: l },
          };
      }
      if (l / 48 < rows - 1) {
        if (!obstacleGrid[(l + 48) / 48][w / 48])
          neighborsAdded = {
            ...neighborsAdded,
            [`${w},${l + 48}`]: { x: w, y: l + 48 },
          };
      }
      if (l > 0) {
        if (!obstacleGrid[(l - 48) / 48][w / 48])
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
