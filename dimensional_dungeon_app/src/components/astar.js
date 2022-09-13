import React from "react";
import { modeActions } from "../redux/slices/mode";

function Astar(rows, cols, startX, startY, destination, canvas) {
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

  let grid = new Array(cols);

  let openSet = [];
  let closedSet = [];
  let path = [];
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

    this.show = function (color) {
      //canvas.rect(this.x * 48, this.y * 48, 48, 48);
      canvas.fillStyle = color;
      canvas.fillRect(this.i * 48, this.j * 48, 48, 48);

      //console.log(this.i * 48, this.j * 48);
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

  console.log(grid);

  start = grid[startX][startY];
  console.log(destination);
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
        console.log("DONE");
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
      console("no sol");
    }
  }

  // for (let i = 0; i<cols; i++ ){
  //     for (let j = 0 ; j <rows; j++){
  //         grid[i][j].show();
  //     }
  // }

  for (let i = 0; i < closedSet.length; i++) {
    console.log(closedSet);
    closedSet[i].show("rgb(255, 0, 0, .3)");
  }
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show("rgb(0, 255, 0, .3)");
  }

  path = [];
  let temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show("rgb(0, 0, 255, 0.3)");
  }

  return openSet;
}

export default Astar;
