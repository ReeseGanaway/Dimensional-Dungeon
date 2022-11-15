import { manhattanDist } from "../functions/manhattanDist";

function Astar(
  rows,
  cols,
  startX,
  startY,
  moveRange,
  destination,
  playerTeam,
  enemyTeam
) {
  let obstacleGrid = Array(10)
    .fill()
    .map(() => Array(10).fill(0));
  for (const [key, value] of Object.entries(playerTeam)) {
    obstacleGrid[value.position.y / 48][value.position.x / 48] = 1;
  }
  for (const [key, value] of Object.entries(enemyTeam)) {
    obstacleGrid[value.position.y / 48][value.position.x / 48] = 1;
  }
  obstacleGrid[startY][startX] = 0;

  let newDest = {
    x: destination.x - (destination.x % 48),
    y: destination.y - (destination.y % 48),
  };
  destination = { ...destination, ...newDest };

  function removeFromArray(arr, elem) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elem) {
        arr.splice(i, 1);
      }
    }
  }

  function heuristic(a, b) {
    let d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
    return d;
  }

  let grid = new Array(cols);

  let openSet = [];
  let closedSet = [];
  let objectPath = {};
  let start;
  let end;
  let checkBreak = false;

  function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = null;
    this.wall = false;

    this.addNeighbors = function (grid) {
      let i = this.i;
      let j = this.j;
      if (i < cols - 1) {
        this.neighbors.push(grid[i + 1][j]);
      }
      if (i > 0) {
        this.neighbors.push(grid[i - 1][j]);
      }
      if (j < rows - 1) {
        this.neighbors.push(grid[i][j + 1]);
      }
      if (j > 0) {
        this.neighbors.push(grid[i][j - 1]);
      }
    };
  }

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
      if (obstacleGrid[j][i]) {
        grid[i][j].wall = true;
      }
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[startX][startY];

  end = grid[destination.x / 48][destination.y / 48];

  openSet.push(start);

  //while we havent reacted our destination

  while (current !== end) {
    if (openSet.length > 0) {
      //keep going
      var winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];

      if (
        !manhattanDist(
          startX * 48,
          startY * 48,
          current.i * 48,
          current.j * 48,
          moveRange
        )
      ) {
        break;
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      let neighbors = current.neighbors;
      for (let i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (neighbor === end && neighbor.wall) {
          checkBreak = true;
        }
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          let tempG = current.g + 1;

          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
            }
          } else {
            neighbor.g = tempG;
            openSet.push(neighbor);
          }

          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    } else {
      console.log("returning {}");
      return {};
      //no solution
    }
    if (checkBreak) {
      break;
    }
  }

  //create the path that we will return to main canvas component
  let temp = current;

  if (
    manhattanDist(
      startX * 48,
      startY * 48,
      current.i * 48,
      current.j * 48,
      moveRange
    )
  ) {
    //path.push(temp);
    objectPath = {
      ...objectPath,
      [[`${temp.i * 48},${temp.j * 48}`]]: { x: temp.i * 48, y: temp.j * 48 },
    };
  }

  //while there are still tiles to be added
  //and the destination is within character's range

  while (
    temp.previous
    // &&
    // manhattanDist(
    //   startX * 48,
    //   startY * 48,
    //   destination.x,
    //   destination.y,
    //   moveRange
    //)
  ) {
    objectPath = {
      ...objectPath,
      [`${temp.previous.i * 48},${temp.previous.j * 48}`]: {
        x: temp.previous.i * 48,
        y: temp.previous.j * 48,
      },
    };

    temp = temp.previous;
  }

  return objectPath;
}

export default Astar;
