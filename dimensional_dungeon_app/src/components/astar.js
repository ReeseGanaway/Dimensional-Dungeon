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
    //let d = Math.sqrt(Math.pow(a.i - a.j, 2) + Math.pow(b.i - b.j, 2));
    let d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
    return d;
  }

  ///////////////////////////////////////////////  ///////////////////////////////////////////////

  //   var bez1 = {
  //     sx: 22,
  //     sy: 0,
  //     cx1: 22,
  //     cy1: 22,
  //     cx2: 22,
  //     cy2: 22,
  //     ex: 48,
  //     ey: 22
  // };

  // drawCurvedArrow(bez1);

  // function drawCurvedArrow(bez) {

  //     // calculate the ending angle of the curve

  //     var pointNearEnd = getCubicBezierXYatT({
  //         x: bez.sx,
  //         y: bez.sy
  //     }, {
  //         x: bez.cx1,
  //         y: bez.cy1
  //     }, {
  //         x: bez.cx2,
  //         y: bez.cy2
  //     }, {
  //         x: bez.ex,
  //         y: bez.ey
  //     }, 0.99);
  //     var dx = bez.ex - pointNearEnd.x;
  //     var dy = bez.ey - pointNearEnd.y;
  //     var endingAngle = Math.atan2(dy, dx);

  //     // draw the arrow shaft

  //     ctx.moveTo(bez.sx, bez.sy);
  //     ctx.bezierCurveTo(bez.cx1, bez.cy1, bez.cx2, bez.cy2, bez.ex, bez.ey);
  //     ctx.lineWidth = 10;
  //     ctx.stroke();

  //     // draw the arrow head

  //     var size = ctx.lineWidth/1.5;

  //     ctx.beginPath();
  //     ctx.save();
  //     ctx.translate(bez.ex, bez.ey);
  //     ctx.rotate(endingAngle);
  //     ctx.moveTo(0, 0);
  //     ctx.lineTo(0, -size * 2);
  //     ctx.lineTo(size * 3, 0);
  //     ctx.lineTo(0, size * 2);
  //     ctx.lineTo(0, 0);
  //     ctx.closePath();
  //     ctx.fill();
  //     ctx.restore();

  // }

  // // helper functions

  // function getCubicBezierXYatT(startPt, controlPt1, controlPt2, endPt, T) {
  //     var x = CubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
  //     var y = CubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
  //     return ({
  //         x: x,
  //         y: y
  //     });
  // }

  // // cubic helper formula at T distance
  // function CubicN(T, a, b, c, d) {
  //     var t2 = T * T;
  //     var t3 = t2 * T;
  //     return a + (-a * 3 + T * (3 * a - a * T)) * T + (3 * b + T * (-6 * b + b * 3 * T)) * T + (c * 3 - c * 3 * T) * t2 + d * t3;
  // }

  ///////////////////////////////////////////////  ///////////////////////////////////////////////

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

    this.show = function (color, index) {
      //canvas.rect(this.x * 48, this.y * 48, 48, 48);
      //console.log(this.i, this.j);
      canvas.fillStyle = color;
      canvas.fillRect(this.i * 48, this.j * 48, 48, 48);
    };

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
        //console.log("DONE");
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

  // for (let i = 0; i < closedSet.length; i++) {
  //   closedSet[i].show("rgb(255, 0, 0, .3)");
  // }
  // for (let i = 0; i < openSet.length; i++) {
  //   openSet[i].show("rgb(0, 255, 0, .3)");
  // }

  path = [];

  let temp = current;
  path.push(temp);
  objectPath = {
    ...objectPath,
    [[`${temp.i * 48},${temp.j * 48}`]]: { x: temp.i * 48, y: temp.j * 48 },
  };
  while (
    temp.previous &&
    Math.abs(start.i - destination.x) + Math.abs(start.j - destination.y) <=
      movement
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

  for (let i = 0; i < path.length; i++) {
    if (
      i >= 1 &&
      Math.abs(path[path.length - 1].i - destination.x) +
        Math.abs(path[path.length - 1].j - destination.y) <=
        movement
    ) {
      //path[i - 1].show("rgb(255, 255, 255, 0.7)", i - 1);
    }
  }

  return objectPath;
}

export default Astar;
