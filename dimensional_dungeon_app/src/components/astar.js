import { manhattanDist } from "../functions/manhattanDist";

function Astar(rows, cols, startX, startY, movement, destination, canvas) {
  let newDest = {
    x: (destination.x - (destination.x % 48)) / 48,
    y: (destination.y - (destination.y % 48)) / 48,
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
  let path = [];
  let objectPath = {};
  let start;
  let end;

  function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = null;

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
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[startX][startY];

  end = grid[destination.x][destination.y];

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

      if (current === end) {
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      let neighbors = current.neighbors;
      for (let i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (!closedSet.includes(neighbor)) {
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
      //no solution
    }
  }

  //create the path that we will return to main canvas component
  path = [];
  let temp = current;
  path.push(temp);
  objectPath = {
    ...objectPath,
    [[`${temp.i * 48},${temp.j * 48}`]]: { x: temp.i * 48, y: temp.j * 48 },
  };
  //while there are still tiles to be added
  //and the destination is within character's range
  console.log(startX, startY);
  while (
    temp.previous &&
    manhattanDist(
      startX * 48,
      startY * 48,
      destination.x * 48,
      destination.y * 48,
      movement
    )
  ) {
    path.push(temp.previous);
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
