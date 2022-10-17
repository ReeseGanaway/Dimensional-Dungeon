import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { rosterActions } from "../redux/slices/roster";
import { modeActions } from "../redux/slices/mode";
import "./Canvas.css";
import TeamSelection from "./TeamSelection";
import astar from "./astar";
import checkTileForHero from "../functions/checkTileForHero";
import tilesInMoveRange from "../functions/tilesInMoveRange.js";
import { debounce } from "lodash";
import { manhattanDist } from "../functions/manhattanDist";
import { Character } from "../classes/Character";
import {
  activeRosterToPlayerTeam,
  playerTeamToActiveRoster,
} from "../functions/characterConversions";
import { saveDataActions } from "../redux/slices/saveData";
import TeamSidebar from "./TeamSidebar";

const GrassCanvas = (props) => {
  const canvasRef = useRef();
  const canvas = document.getElementById("canvas");
  const mapName = "grassCanvas";
  const startingTeam = "ally";
  let direction;
  let defaultDir = "down";
  let path;

  //redux state variables

  //redux states
  const mode = useSelector((state) => state.mode);
  const saveData = useSelector((state) => state.saveData);
  const roster = useSelector((state) => state.roster);

  //individual data in states

  const collection = roster.collection;

  const dispatch = useDispatch();

  const [moving, setMoving] = useState(false);

  const [playerTeam, setPlayerTeam] = useState(
    activeRosterToPlayerTeam(saveData.maps[mapName].allyTeam)
  );

  const [enemyTeam, setEnemyTeam] = useState(() => {
    if (Object.keys(saveData.maps[mapName].enemyTeam).length === 0) {
      return activeRosterToPlayerTeam({
        penguin: {
          ...collection["penguin"],
          x: 432,
          y: 432,
          dir: "up",
          used: false,
        },
        twoFace: {
          ...collection["twoFace"],
          x: 384,
          y: 432,
          dir: "up",
          used: false,
        },
      });
    } else {
      return activeRosterToPlayerTeam(saveData.maps[mapName].enemyTeam);
    }
  });

  const [currentChar, setCurrentChar] = useState({});
  const [currentEnemy, setCurrentEnemy] = useState({});
  const [sideBarChar, setSideBarChar] = useState({});
  const [firstRender, setFirstRender] = useState(true);
  const [charLimit, setCharLimit] = useState(4);
  const [openSet, setOpenSet] = useState({});
  const [destination, setDestination] = useState({});
  const [turnInfo, setTurnInfo] = useState({
    ...saveData["maps"][mapName]["turnInfo"],
  });

  //state used to limit where players can place heroes during team select
  const [teamSelectTiles, setTeamSelectTiles] = useState({
    1: { x: 0, y: 0 },
    2: { x: 48, y: 0 },
    3: { x: 0, y: 48 },
    4: { x: 48, y: 48 },
  });

  const mapImage = new Image();
  mapImage.src = "/images/grassMap.png";

  const updateXY = (newPosition) => {
    dispatch(rosterActions.updateXY(newPosition));
  };

  const resetRoster = () => {
    dispatch(rosterActions.resetRoster());
  };

  const activateMovement = () => {
    dispatch(modeActions.activateMovement());
  };

  const endMovement = () => {
    dispatch(modeActions.endMovement());
  };

  const resetMode = () => {
    setOpenSet({});
    dispatch(modeActions.resetMode());
  };

  const activateTeamSelection = () => {
    dispatch(modeActions.activateTeamSelection());
  };

  const deactivateTeamSelection = () => {
    dispatch(modeActions.deactivateTeamSelection());
  };

  const setTeamSelectionHero = (hero) => {
    dispatch(modeActions.setTeamSelectionHero(hero));
  };

  const activateBattle = () => {
    dispatch(modeActions.activateBattle());
  };

  const deactivateBattle = () => {
    dispatch(modeActions.deactivateBattle());
  };

  const clearSave = () => {
    dispatch(saveDataActions.clearSave());
  };

  const setSave = (sessionInfo) => {
    dispatch(saveDataActions.setSave(sessionInfo));
  };

  function resetGame() {
    clearSave();
    resetMode();
    turnInfo.turnNum = 0;
    turnInfo.team = startingTeam;
    setTurnInfo({ ...turnInfo });
    setPlayerTeam({});
    setEnemyTeam(
      activeRosterToPlayerTeam({
        penguin: {
          ...collection["penguin"],
          x: 432,
          y: 432,
          dir: "up",
          used: false,
        },
        twoFace: {
          ...collection["twoFace"],
          x: 384,
          y: 432,
          dir: "up",
          used: false,
        },
      })
    );

    for (const [key, value] of Object.entries(playerTeam)) {
      if (mode.teamSelection.active) {
        const teamSelectIcon = document.getElementById(key);
        teamSelectIcon.className = "";
      }
    }
  }

  function startGame() {
    deactivateTeamSelection();
    activateBattle();
    turnInfo.turnNum = 1;
    setTurnInfo({ ...turnInfo });
  }

  //Make sure user meant to leave page
  window.onbeforeunload = function () {
    console.log("Would you like to save your game?");

    setSave({
      map: mapName,
      save: {
        turnInfo: turnInfo,
        enemyTeam: playerTeamToActiveRoster(enemyTeam, roster),
        allyTeam: playerTeamToActiveRoster(playerTeam, roster),
      },
    });
    return "Would you like to save your game?";
  };

  //function to determine and handle what should be happening when the canvas is clicked
  function handleClick(canvas, e) {
    //get the coordinates of the user's cursor on click
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    //if user is still in process of choosing team
    if (mode.teamSelection.active) {
      //if user has selected a hero to use, but hasnt placed them on the canvas yet
      if (Object.keys(currentChar).length !== 0) {
        if (
          checkTileForHero(x, y, playerTeam) &&
          checkTileForHero(x, y, playerTeam) !== currentChar.id
        ) {
          window.alert("There is already a character on this tile!");
        } else if (!checkTeamSelectTile(x, y)) {
          window.alert(
            "Please place your character on one of the tiles highlighted blue!"
          );
        } else if (checkTeamSelectTile(x, y)) {
          setNewHero(x, y);
        }
      }

      //if user has selected a hero that is already on the canvas, but they want to move it
      else if (
        Object.keys(currentChar).length !== 0 &&
        checkTileForHero(x, y, playerTeam)
      ) {
        moveCharDuringTeamSelect(checkTileForHero(x, y, playerTeam));
      }
    } else if (mode.battle.active) {
      //there is currently a current character/ a character is active
      if (Object.keys(currentChar).length !== 0) {
        //if current character has not been assigned an action
        if (!currentChar.waiting) {
          //if there is no character on the tile that was clicked

          if (!checkTileForHero(x, y, playerTeam)) {
            //and the tile is within character range, move character
            if (
              Object.keys(openSet).includes(`${x - (x % 48)},${y - (y % 48)}`)
              // manhattanDist(
              //   currentChar.position.x,
              //   currentChar.position.y,
              //   destination.x,
              //   destination.y,
              //   currentChar.currentStats.moveRange
              // )
            ) {
              moveCharacter(x, y);
            }
            //if the click is outside the range, deselect the current character
            else {
              if (currentChar === sideBarChar) setSideBarChar({});
              setCurrentChar({});
              endMovement();
              setOpenSet({});
            }
          }
          //if the tile that was clicked contains the current character
          else if (checkTileForHero(x, y, playerTeam) === currentChar.id) {
            endMovement();
            currentChar.toggleUsed();
            setPlayerTeam({ ...playerTeam });
            if (currentChar === sideBarChar) setSideBarChar({});
            setCurrentChar({});
            setOpenSet({});
            incrementTurn();
            setTurnInfo({ ...turnInfo });
          } else {
            let key = checkTileForHero(x, y, playerTeam);
            setCurrentChar(playerTeam[key]);
            setSideBarChar(playerTeam[key]);
            setOpenSet(
              tilesInMoveRange(
                playerTeam[key].position.x,
                playerTeam[key].position.y,
                10,
                10,
                playerTeam[key].currentStats.moveRange,
                playerTeam,
                enemyTeam
              )
            );
          }
        }
        //character was already given a action and is waiting for confirmation
        else if (currentChar.waiting) {
          //if tile clicked contains currentChar
          if (checkTileForHero(x, y, playerTeam) === currentChar.id) {
            currentChar.toggleWaiting();

            currentChar.toggleUsed();
            currentChar.updatePrevPos(
              currentChar.position.x,
              currentChar.position.y,
              currentChar.position.dir
            );
            setPlayerTeam({ ...playerTeam });
            if (currentChar === sideBarChar) setSideBarChar({});
            setCurrentChar({});
            setOpenSet({});
            incrementTurn();
          } else if (checkTileForHero(x, y, playerTeam) === null) {
            currentChar.revertPos();
            currentChar.toggleWaiting();
            setPlayerTeam({ ...playerTeam });
            setDestination({});
            if (currentChar === sideBarChar) setSideBarChar({});
            setCurrentChar({});
            setOpenSet({});
          }
        }
      }
      //if we arent in movement mode...
      else {
        //cycle through player's team
        for (const [key, value] of Object.entries(playerTeam)) {
          const position = value.position;
          //if the coordinates of the click are on the same 48 x 48 tile as one of the ally characters
          if (
            x >= position.x &&
            x <= position.x + 47 &&
            y >= position.y &&
            y <= position.y + 47
          ) {
            path = null;
            setDestination({});
            setCurrentChar(playerTeam[key]);
            setSideBarChar(playerTeam[key]);
            setOpenSet(
              tilesInMoveRange(
                position.x,
                position.y,
                10,
                10,
                playerTeam[key].currentStats.moveRange,
                playerTeam,
                enemyTeam
              )
            );

            //put us in movement mode
            activateMovement();

            break;
          }
        }
      }
    }
  }

  //different functions for handling clicks based on current mode

  function checkTeamSelectTile(x, y) {
    for (const [key, value] of Object.entries(teamSelectTiles)) {
      //if the coordinates of the click are on the same 48 x 48 tile as one of the ally characters
      if (
        x >= value.x &&
        x <= value.x + 47 &&
        y >= value.y &&
        y <= value.y + 47
      ) {
        return true;
      }
    }
    return false;
  }

  function moveCharDuringTeamSelect(id) {
    const { name, spriteSheet, icon, position, maxStats } = playerTeam[id];
    const tempCurr = new Character(
      id,
      name,
      spriteSheet.src,
      icon,
      position,
      false,
      maxStats
    );
    setCurrentChar(tempCurr);
    setSideBarChar({ tempCurr });
    delete playerTeam[id];
    let canvasDiv = document.getElementById("canvas-div");
    canvasDiv.style.cursor = 'url("' + tempCurr.icon + '") 25 15, auto';
  }

  //function for setting character coords when in team selection mode
  function setNewHero(x, y) {
    x = x - (x % 48);
    y = y - (y % 48);
    const { id, name, spriteSheet, icon, position, maxStats } = currentChar;
    const tempCurr = new Character(
      id,
      name,
      spriteSheet.src,
      icon,
      {
        x: x,
        y: y,
        dir: position.dir,
      },
      false,
      maxStats
    );

    const newTeam = { ...playerTeam, [tempCurr.id]: tempCurr };
    setPlayerTeam(newTeam);
    setCurrentChar({});
    setSideBarChar({});

    let canvasDiv = document.getElementById("canvas-div");
    canvasDiv.style.cursor = "";
  }

  //function for moving the character
  function moveCharacter(x, y) {
    const char = playerTeam[currentChar.id];
    if (path) {
      let pathArray = Object.entries(path).reverse();
      char.updatePrevPos(char.position.x, char.position.y, char.position.dir);
      simulateAllyMovement(pathArray);
    }

    //set current character to waiting
    char.toggleWaiting();
    setPlayerTeam({ ...playerTeam });

    //turn off movement mode
    endMovement();
  }

  function getDirection(prev, curr) {
    if (curr.x > prev.x) {
      return "right";
    } else if (curr.x < prev.x) {
      return "left";
    } else if (curr.y > prev.y) {
      return "down";
    } else if (curr.y < prev.y) {
      return "up";
    }
  }

  function simulateAllyMovement(pathArray) {
    setMoving(true);
    const char = currentChar;
    let countTo48 = 0;

    if (pathArray.length === 1) {
      setMoving(false);
    } else {
      //character is moving right
      if (pathArray[0][1].x < pathArray[1][1].x) {
        while (pathArray[0][1].x + countTo48 < pathArray[1][1].x) {
          const tempCountTo48 = countTo48;

          setTimeout(() => {
            char.updatePos(char.position.x + 1, char.position.y);
            char.setDirection("right");

            setPlayerTeam({ ...playerTeam });
          }, 10 * tempCountTo48);

          countTo48++;
        }

        setTimeout(() => {
          simulateAllyMovement(pathArray.slice(1));
        }, 10 * countTo48);
      }

      //character is moving left
      else if (pathArray[0][1].x > pathArray[1][1].x) {
        while (pathArray[0][1].x - countTo48 > pathArray[1][1].x) {
          const tempCountTo48 = countTo48;

          setTimeout(() => {
            char.updatePos(char.position.x - 1, char.position.y);
            char.setDirection("left");

            setPlayerTeam({ ...playerTeam });
          }, 10 * tempCountTo48);

          countTo48++;
        }

        setTimeout(() => {
          simulateAllyMovement(pathArray.slice(1));
        }, 10 * countTo48);
      }
      //character is moving down
      else if (pathArray[0][1].y < pathArray[1][1].y) {
        while (pathArray[0][1].y + countTo48 < pathArray[1][1].y) {
          const tempCountTo48 = countTo48;

          setTimeout(() => {
            char.updatePos(char.position.x, char.position.y + 1);
            char.setDirection("down");
            console.log("HERE");

            setPlayerTeam({ ...playerTeam });
          }, 10 * tempCountTo48);

          countTo48++;
        }

        setTimeout(() => {
          simulateAllyMovement(pathArray.slice(1));
        }, 10 * countTo48);
      }

      //character is moving up
      else if (pathArray[0][1].y > pathArray[1][1].y) {
        char.setDirection("up");
        while (pathArray[0][1].y - countTo48 > pathArray[1][1].y) {
          const tempCountTo48 = countTo48;

          setTimeout(() => {
            char.updatePos(char.position.x, char.position.y - 1);

            setPlayerTeam({ ...playerTeam });
          }, 10 * tempCountTo48);

          countTo48++;
        }

        setTimeout(() => {
          simulateAllyMovement(pathArray.slice(1));
        }, 10 * countTo48);
      }
    }
  }

  function simulateEnemyMovement(pathArray) {
    const char = currentEnemy;
    let countTo48 = 0;

    if (pathArray.length === 1) {
      currentEnemy.toggleUsed();
      currentEnemy.updatePrevPos(
        currentEnemy.position.x,
        currentEnemy.position.y,
        currentEnemy.position.dir
      );
      setEnemyTeam({ ...enemyTeam });
      for (const [key, value] of Object.entries(enemyTeam)) {
        if (!value.used) {
          setCurrentEnemy(enemyTeam[key]);
          return;
        }
      }

      incrementTurn();
    } else {
      //character is moving right
      if (pathArray[0][1].x < pathArray[1][1].x) {
        while (pathArray[0][1].x + countTo48 < pathArray[1][1].x) {
          const tempCountTo48 = countTo48;

          setTimeout(() => {
            char.updatePos(char.position.x + 1, char.position.y);
            char.setDirection("right");

            setEnemyTeam({ ...enemyTeam });
          }, 10 * tempCountTo48);

          countTo48++;
        }

        setTimeout(() => {
          simulateEnemyMovement(pathArray.slice(1), char);
        }, 10 * countTo48);
      }

      //character is moving left
      else if (pathArray[0][1].x > pathArray[1][1].x) {
        while (pathArray[0][1].x - countTo48 > pathArray[1][1].x) {
          const tempCountTo48 = countTo48;

          setTimeout(() => {
            char.updatePos(char.position.x - 1, char.position.y);
            char.setDirection("left");

            setEnemyTeam({ ...enemyTeam });
          }, 10 * tempCountTo48);

          countTo48++;
        }

        setTimeout(() => {
          simulateEnemyMovement(pathArray.slice(1), char);
        }, 10 * countTo48);
      }
      //character is moving down
      else if (pathArray[0][1].y < pathArray[1][1].y) {
        while (pathArray[0][1].y + countTo48 < pathArray[1][1].y) {
          const tempCountTo48 = countTo48;

          setTimeout(() => {
            char.updatePos(char.position.x, char.position.y + 1);
            char.setDirection("down");

            setEnemyTeam({ ...enemyTeam });
          }, 10 * tempCountTo48);

          countTo48++;
        }

        setTimeout(() => {
          simulateEnemyMovement(pathArray.slice(1), char);
        }, 10 * countTo48);
      }

      //character is moving up
      else if (pathArray[0][1].y > pathArray[1][1].y) {
        char.setDirection("up");
        while (pathArray[0][1].y - countTo48 > pathArray[1][1].y) {
          const tempCountTo48 = countTo48;

          setTimeout(() => {
            char.updatePos(char.position.x, char.position.y - 1);

            setEnemyTeam({ ...enemyTeam });
          }, 10 * tempCountTo48);

          countTo48++;
        }

        setTimeout(() => {
          simulateEnemyMovement(pathArray.slice(1), char);
        }, 10 * countTo48);
      }
    }
  }

  function incrementTurn() {
    switch (turnInfo.team) {
      case "ally":
        for (const [key, value] of Object.entries(playerTeam)) {
          if (!value.used) {
            return;
          }
        }
        for (const [key, value] of Object.entries(playerTeam)) {
          playerTeam[key].toggleUsed();
        }

        setCurrentEnemy(Object.entries(enemyTeam)[0][1]);
        if (turnInfo.team !== startingTeam) turnInfo.turnNum++;
        turnInfo.team = "enemy";
        setTurnInfo({ ...turnInfo });
        break;
      case "enemy":
        for (const [key, value] of Object.entries(enemyTeam)) {
          if (!value.used) {
            return;
          }
          if (turnInfo.team !== startingTeam) turnInfo.turnNum++;
          turnInfo.team = "ally";
          setTurnInfo({ ...turnInfo });
          setCurrentEnemy({});
          for (const [key, value] of Object.entries(enemyTeam)) {
            enemyTeam[key].toggleUsed();
          }
        }
    }
  }

  const debounceDrawPath = debounce(async (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    setDestination({ x: x, y: y });
  }, 5);

  async function drawPath(e) {
    debounceDrawPath(e);
  }

  function drawCurvedArrow(
    sx,
    sy,
    cx1,
    cy1,
    cx2,
    cy2,
    ex,
    ey,
    last,
    newDirection
  ) {
    // pathArray, index) {
    let context = canvasRef.current.getContext("2d");

    context.lineWidth = 10;
    if (!last) {
      // draw the arrow shaft
      context.moveTo(sx, sy);

      context.bezierCurveTo(cx1, cy1, cx2, cy2, ex, ey);
      context.stroke();
    }
    // draw the arrow head
    else {
      var size = context.lineWidth / 1.5;

      context.beginPath();
      context.save();
      if (newDirection === "right") {
        context.translate(sx + 48, sy + 24);
      } else if (newDirection === "left") {
        context.translate(sx, sy + 24);
        context.rotate((180 * Math.PI) / 180);
      } else if (newDirection === "up") {
        context.translate(sx + 24, sy);
        context.rotate((270 * Math.PI) / 180);
      } else if (newDirection === "down") {
        context.translate(sx + 24, sy + 48);
        context.rotate((90 * Math.PI) / 180);
      }

      context.fillStyle = "black";
      context.moveTo(0, 0);
      context.lineTo(10, 0);
      context.stroke();
      context.lineTo(10, -size * 2);
      context.lineTo(size * 3 + 10, 0);
      context.lineTo(10, size * 2);
      context.lineTo(10, 0);
      context.lineTo(0, 0);
      context.closePath();
      context.fill();
      context.restore();
    }
  }

  //function to draw path of character
  function drawFullPath(pathArray) {
    let sx, sy, ex, ey, newDirection, prevDirection;

    for (let i = 0; i < pathArray.length; i++) {
      if (i === 0) {
        if (pathArray.length > 1) {
          direction = getDirection(pathArray[i][1], pathArray[i + 1][1]);
        }
      } else if (i === pathArray.length - 1) {
        switch (direction) {
          case "up":
            sx = pathArray[i][1].x + 24;
            sy = pathArray[i][1].y + 48;
            drawArrow(
              sx,
              sy,
              null,
              null,
              null,
              null,
              null,
              null,
              true,
              direction
            );

            break;
          case "down":
            sx = pathArray[i][1].x + 24;
            sy = pathArray[i][1].y;
            drawArrow(
              sx,
              sy,
              null,
              null,
              null,
              null,
              null,
              null,
              true,
              direction
            );

            break;
          case "left":
            sx = pathArray[i][1].x + 48;
            sy = pathArray[i][1].y + 24;

            drawArrow(
              sx,
              sy,
              null,
              null,
              null,
              null,
              null,
              null,
              true,
              direction
            );

            break;
          case "right":
            sx = pathArray[i][1].x;
            sy = pathArray[i][1].y + 24;

            drawArrow(
              sx,
              sy,
              null,
              null,
              null,
              null,
              null,
              null,
              true,
              direction
            );

            break;
        }
        return;
      } else {
        newDirection = getDirection(pathArray[i][1], pathArray[i + 1][1]);
        //if straight line/same direction as the previos move

        if (direction === newDirection) {
          switch (newDirection) {
            //going up
            case "up":
              sx = pathArray[i][1].x + 24;
              sy = pathArray[i][1].y + 48;
              drawArrow(sx, sy, sx, sy - 24, sx, sy - 24, sx, sy - 48, false);
              direction = "up";
              break;
            //going down
            case "down":
              sx = pathArray[i][1].x + 24;
              sy = pathArray[i][1].y;
              drawArrow(sx, sy, sx, sy + 24, sx, sy + 24, sx, sy + 48, false);
              direction = "down";
              break;
            //going left
            case "left":
              sx = pathArray[i][1].x + 48;
              sy = pathArray[i][1].y + 24;
              drawArrow(sx, sy, sx - 24, sy, sx - 24, sy, sx - 48, sy, false);
              direction = "left";
              break;
            //going right
            case "right":
              sx = pathArray[i][1].x;
              sy = pathArray[i][1].y + 24;
              drawArrow(sx, sy, sx + 24, sy, sx + 24, sy, sx + 48, sy, false);
              direction = "right";
              break;
          }
        }
        //if curve/different diretion than the last move
        else {
          switch (newDirection) {
            //new tile/new direction is up
            case "up":
              switch (direction) {
                //last move was to the left
                case "left":
                  sx = pathArray[i][1].x + 48;
                  sy = pathArray[i][1].y + 24;
                  drawArrow(
                    sx,
                    sy,
                    sx - 24,
                    sy,
                    sx - 24,
                    sy,
                    sx - 24,
                    sy - 24,
                    false
                  );
                  direction = "up";
                  break;
                //last move was to the right
                case "right":
                  sx = pathArray[i][1].x;
                  sy = pathArray[i][1].y + 24;
                  drawArrow(
                    sx,
                    sy,
                    sx + 24,
                    sy,
                    sx + 24,
                    sy,
                    sx + 24,
                    sy - 24,
                    false
                  );
                  direction = "up";
                  break;
              }
              break;
            //new tile/new direction is down
            case "down":
              switch (direction) {
                //last move was to the left
                case "left":
                  sx = pathArray[i][1].x + 48;
                  sy = pathArray[i][1].y + 24;
                  drawArrow(
                    sx,
                    sy,
                    sx - 24,
                    sy,
                    sx - 24,
                    sy,
                    sx - 24,
                    sy + 24,
                    false
                  );
                  direction = "down";
                  break;
                //last move was to the right
                case "right":
                  sx = pathArray[i][1].x;
                  sy = pathArray[i][1].y + 24;
                  drawArrow(
                    sx,
                    sy,
                    sx + 24,
                    sy,
                    sx + 24,
                    sy,
                    sx + 24,
                    sy + 24,
                    false
                  );
                  direction = "down";
                  break;
              }
              break;
            //new tile/new direction is left
            case "left":
              switch (direction) {
                //last move was up
                case "up":
                  sx = pathArray[i][1].x + 24;
                  sy = pathArray[i][1].y + 48;
                  drawArrow(
                    sx,
                    sy,
                    sx,
                    sy - 24,
                    sx,
                    sy - 24,
                    sx - 24,
                    sy - 24,
                    false
                  );
                  direction = "left";
                  break;
                //last move was to down
                case "down":
                  sx = pathArray[i][1].x + 24;
                  sy = pathArray[i][1].y;
                  drawArrow(
                    sx,
                    sy,
                    sx,
                    sy + 24,
                    sx,
                    sy + 24,
                    sx - 24,
                    sy + 24,
                    false
                  );
                  direction = "left";
                  break;
              }
              break;
            //new tile/new direction is right
            case "right":
              switch (direction) {
                //last move was up
                case "up":
                  sx = pathArray[i][1].x + 24;
                  sy = pathArray[i][1].y + 48;
                  drawArrow(
                    sx,
                    sy,
                    sx,
                    sy - 24,
                    sx,
                    sy - 24,
                    sx + 24,
                    sy - 24,
                    false
                  );
                  direction = "right";
                  break;
                //last move was down
                case "down":
                  sx = pathArray[i][1].x + 24;
                  sy = pathArray[i][1].y;
                  drawArrow(
                    sx,
                    sy,
                    sx,
                    sy + 24,
                    sx,
                    sy + 24,
                    sx + 24,
                    sy + 24,
                    false
                  );
                  direction = "right";
                  break;
              }
              break;
          }
        }
      }
    }
  }

  function drawArrow(
    sx,
    sy,
    cx1,
    cy1,
    cx2,
    cy2,
    ex,
    ey,
    last,
    newDirection = null
  ) {
    // pathArray, index) {
    let context = canvasRef.current.getContext("2d");

    context.lineWidth = 10;
    if (!last) {
      // draw the arrow shaft
      context.moveTo(sx, sy);

      context.bezierCurveTo(cx1, cy1, cx2, cy2, ex, ey);
      context.stroke();
    }
    // draw the arrow head
    else {
      var size = context.lineWidth / 1.5;

      context.beginPath();
      context.save();
      if (newDirection === "right") {
        context.translate(sx, sy);
      } else if (newDirection === "left") {
        context.translate(sx, sy);
        context.rotate((180 * Math.PI) / 180);
      } else if (newDirection === "up") {
        context.translate(sx, sy);
        context.rotate((270 * Math.PI) / 180);
      } else if (newDirection === "down") {
        context.translate(sx, sy);
        context.rotate((90 * Math.PI) / 180);
      }
      context.fillStyle = "black";
      context.moveTo(0, 0);
      context.lineTo(10, 0);
      context.stroke();
      context.lineTo(10, -size * 2);
      context.lineTo(size * 3 + 10, 0);
      context.lineTo(10, size * 2);
      context.lineTo(10, 0);
      context.lineTo(0, 0);
      context.closePath();
      context.fill();
      context.restore();
    }
  }

  //only first render
  useEffect(() => {
    if (turnInfo.turnNum === 0) {
      turnInfo.team = startingTeam;
      setTurnInfo({ ...turnInfo });
    }
    if (mode.movement.active) {
      endMovement();
    }
    setFirstRender(false);
    if (!mode.battle.active) {
      setCurrentChar({});
      setSideBarChar({});

      for (const [key] of Object.entries(playerTeam)) {
        const teamSelectIcon = document.getElementById(key);
        if (teamSelectIcon !== null) {
          teamSelectIcon.className = "team-select-icon selected";
        }
      }
    }
  }, []);

  useEffect(() => {
    if (firstRender) {
      return;
    }

    mapImage.onload = () => {
      canvas.width = mapImage.width;
      canvas.height = mapImage.height;

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(mapImage, 0, 0);

      if (mode.teamSelection.active) {
        context.fillStyle = "rgba(0,0,255,0.3)";
        for (const [key, value] of Object.entries(teamSelectTiles)) {
          context.fillRect(value.x, value.y, 48, 48);
        }
      }

      //if a character was selected and there is a set of open tiles,
      //draw the tiles they can move to
      if (openSet) {
        for (const [key, value] of Object.entries(openSet)) {
          if (
            checkTileForHero(value.x, value.y, playerTeam) &&
            checkTileForHero(value.x, value.y, playerTeam) !== currentChar.id
          ) {
            context.fillStyle = "rgba(255,0,0,0.5)";
            context.fillRect(value.x, value.y, 48, 48);
          } else {
            context.fillStyle = "rgba(0,0,255,0.3)";
            context.fillRect(value.x, value.y, 48, 48);
          }
        }
      }

      //if movement mode is active
      if (mode.movement.active) {
        if (destination.x && destination.y) {
          //get the path the character would take to get to the destination
          path = astar(
            10,
            10,
            currentChar.position.x / 48,
            currentChar.position.y / 48,
            currentChar.currentStats.moveRange,
            destination,
            playerTeam,
            enemyTeam
          );

          let pathArray = Object.entries(path).reverse();

          drawFullPath(pathArray);
        }
      }

      if (Object.keys(playerTeam).length > 0) {
        for (const [key, value] of Object.entries(playerTeam)) {
          value.draw();
        }
      }

      if (Object.keys(enemyTeam).length > 0) {
        for (const [key, value] of Object.entries(enemyTeam)) {
          value.draw();
        }
      }
    };
  }, [mapImage, mode.teamSelection.active, enemyTeam]);

  useEffect(() => {
    let tempCurr;
    if (turnInfo.team === "enemy") {
      if (Object.keys(currentEnemy.length === 0)) {
        for (const [key, value] of Object.entries(enemyTeam)) {
          if (!value.used) {
            console.log(key);
            setCurrentEnemy(enemyTeam[key]);
            break;
          }
        }
      }

      let highestDmg = Object.entries(playerTeam)[0][1];
      for (const [key, value] of Object.entries(playerTeam)) {
        if (value.maxStats.dmg > highestDmg.maxStats.dmg) {
          highestDmg = playerTeam[key];
        }
      }

      if (Object.entries(currentEnemy).length !== 0) {
        path = astar(
          10,
          10,
          currentEnemy.position.x / 48,
          currentEnemy.position.y / 48,
          currentEnemy.currentStats.moveRange,
          highestDmg.position,
          playerTeam,
          enemyTeam
        );

        let pathArray = Object.entries(path).reverse();

        if (pathArray.length > 0) {
          simulateEnemyMovement(pathArray);
        } else {
          currentEnemy.toggleUsed();

          setEnemyTeam({ ...enemyTeam });
          for (const [key, value] of Object.entries(enemyTeam)) {
            if (!value.used) {
              setCurrentEnemy(enemyTeam[key]);
              return;
            }
          }

          incrementTurn();
          console.log("no path");
        }
      }
    }
  }, [turnInfo, currentEnemy]);

  return (
    <div className="container-lg justify-content-center">
      <div
        id="full-ui"
        className="full-ui row justify-content-center text-center"
      >
        <div className="col-md-auto text-center">
          <div className="row">
            <div className="col-md-auto turn-info">
              <h3>
                Turn:{turnInfo.turnNum}{" "}
                {turnInfo.team.charAt(0).toUpperCase() + turnInfo.team.slice(1)}
              </h3>
            </div>
          </div>
          <div className="row  justify-content-center text-center">
            <div id="canvas-div" className="canvas-div col-md-auto">
              <canvas
                id="canvas"
                className="canvas"
                ref={canvasRef}
                onClick={(e) => {
                  if (turnInfo.team === "ally" && !moving)
                    handleClick.bind(this)(canvas, e);
                }}
                onMouseMove={(e) => {
                  if (mode.movement.active) {
                    drawPath(e);
                  }
                }}
              ></canvas>
            </div>

            <TeamSidebar
              playerTeam={playerTeam}
              enemyTeam={enemyTeam}
              currentChar={currentChar}
              currentEnemy={currentEnemy}
              collection={collection}
              sideBarChar={sideBarChar}
              setSideBarChar={setSideBarChar}
              turnInfo={turnInfo}
            />

            <div className="row">
              {!mode.battle.active && mode.teamSelection.active ? (
                <TeamSelection
                  playerTeam={playerTeam}
                  setPlayerTeam={setPlayerTeam}
                  currentChar={currentChar}
                  setCurrentChar={setCurrentChar}
                  charLimit={charLimit}
                  defaultDir={defaultDir}
                  sideBarChar={sideBarChar}
                  setSideBarChar={setSideBarChar}
                />
              ) : null}
              <div>
                {mode.battle.active && !mode.teamSelection.active ? (
                  <div>
                    <button onClick={() => console.log(playerTeam)}>
                      playerTeam
                    </button>
                    <button onClick={() => console.log(enemyTeam)}>
                      enemyTeam
                    </button>
                    <button onClick={() => console.log(turnInfo)}>
                      turnInfo
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="row justify-content-center reset-redux-states">
              <div className="col-md-auto">
                <button
                  className="btn reset-button"
                  onClick={() => {
                    resetRoster();
                    setPlayerTeam({});
                  }}
                >
                  Reset Roster
                </button>
              </div>
              <div className="col-md-auto">
                <button
                  className="btn reset-button"
                  onClick={() => resetGame()}
                >
                  Reset Game
                </button>
              </div>
              <div className="col-md-auto">
                <button
                  className="btn reset-button"
                  onClick={() => {
                    startGame();
                  }}
                >
                  Start Game
                </button>
              </div>
              <div className="col-md-auto">
                <button
                  className="btn reset-active-heroes"
                  onClick={() => {
                    clearSave();
                  }}
                >
                  Clear Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GrassCanvas;
