import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { rosterActions } from "../redux/slices/roster";
import { modeActions } from "../redux/slices/mode";
import "./Canvas.css";
import TeamSelection from "./TeamSelection";
import astar from "./astar";
import checkTileForHero from "../functions/checkTileForHero";
import tilesInMoveRange from "../functions/tilesInMoveRange.js";

const GrassCanvas = (props) => {
  const canvasRef = useRef();
  const canvas = document.getElementById("canvas");

  //redux state variables

  //full states
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);

  //individual data in states
  const selectedHero = mode.selectedHero.hero;
  const destination = mode.movement.destination;
  const openSet = mode.movement.openSet;
  const activeRoster = roster.activeRoster;
  const collection = roster.collection;

  const dispatch = useDispatch();

  const [playerTeam, setPlayerTeam] = useState({});
  const [firstRender, setFirstRender] = useState(true);
  const [heroLimit, setHeroLimit] = useState(4);

  //state used to limit where players can place heroes during team select
  const [teamSelectTiles, setTeamSelectTiles] = useState({
    1: { x: 0, y: 0 },
    2: { x: 48, y: 0 },
    3: { x: 0, y: 48 },
    4: { x: 48, y: 48 },
  });

  const mapImage = new Image();
  mapImage.src = "/images/grassMap.png";

  const addHeroActive = (hero) => {
    dispatch(rosterActions.addHeroActive(hero));
  };

  const updateXY = (newPosition) => {
    dispatch(rosterActions.updateXY(newPosition));
  };

  // const clearRoster = () => {
  //   dispatch(rosterActions.clearRoster());
  // };

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

  const setSelectedHero = (hero) => {
    dispatch(modeActions.setSelectedHero(hero));
  };

  const resetActiveHeroes = () => {
    for (const [key, value] of Object.entries(activeRoster)) {
      if (mode.teamSelection.active) {
        const teamSelectIcon = document.getElementById(key);
        teamSelectIcon.className = "";
      }
    }
    dispatch(rosterActions.resetActiveHeroes());
  };

  const setDestination = (destination) => {
    dispatch(modeActions.setDestination(destination));
  };

  const setOpenSet = (openSet) => {
    dispatch(modeActions.setOpenSet(openSet));
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
      if (selectedHero) {
        if (
          checkTileForHero(x, y, activeRoster) &&
          checkTileForHero(x, y, activeRoster) !== selectedHero.name
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
      else if (!selectedHero && checkTileForHero(x, y, activeRoster)) {
        moveHeroDuringTeamSelect(checkTileForHero(x, y, activeRoster));
      }
    } else if (mode.battle.active) {
      //movement mode is active (last click was a click on an ally character)
      if (mode.movement.active) {
        if (!checkTileForHero(x, y, activeRoster)) {
          moveCharacter(x, y);
        } else {
          window.alert("There is already a character in this tile!");
        }
      }
      //if we arent in movement mode...
      else {
        //cycle through player's team
        for (const [key, value] of Object.entries(activeRoster)) {
          //if the coordinates of the click are on the same 48 x 48 tile as one of the ally characters
          if (
            x >= value.x &&
            x <= value.x + 47 &&
            y >= value.y &&
            y <= value.y + 47
          ) {
            setSelectedHero(activeRoster[key]);
            setOpenSet(
              tilesInMoveRange(
                activeRoster[key].x,
                activeRoster[key].y,
                10,
                10,
                activeRoster[key].movement
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

  function moveHeroDuringTeamSelect(name) {
    const tempHero = { ...activeRoster[name] };
    setSelectedHero(tempHero);
    delete playerTeam[name];
    console.log(playerTeam);
    let canvasDiv = document.getElementById("canvas-div");
    canvasDiv.style.cursor = 'url("' + tempHero.displayIcon + '") 25 15, auto';
  }

  //function for setting character coords when in team selection mode
  function setNewHero(x, y) {
    const newPosition = {
      name: selectedHero.name,
      x: x - (x % 48),
      y: y - (y % 48),
    };
    updateXY(newPosition);
    let newTeamSprites = { ...playerTeam };
    let sprite = new Image();
    sprite.src = selectedHero.spriteSheet;

    newTeamSprites[selectedHero.name] = sprite;

    setPlayerTeam(newTeamSprites);
    setTeamSelectionHero(null);
    let canvasDiv = document.getElementById("canvas-div");
    canvasDiv.style.cursor = "";
    setSelectedHero(null);
  }

  //function for moving the character
  function moveCharacter(x, y) {
    setDestination({ x: (x - (x % 48)) / 48, y: (y - (y % 48)) / 48 });

    // astar(
    //   10,
    //   10,
    //   selectedHero.x / 48,
    //   selectedHero.y / 48,
    //   { x: (x - (x % 48)) / 48, y: (y - (y % 48)) / 48 },
    //   canvasRef.current.getContext("2d")
    // );

    //update redux state (necessary to save player positions on refresh)

    updateXY({
      name: selectedHero.name,
      x: x - (x % 48),
      y: y - (y % 48),
    });
    setOpenSet(null);

    //turn off movement mode
    endMovement();
    setSelectedHero(null);
  }

  //only first render
  useEffect(() => {
    setFirstRender(false);
    if (!mode.battle.active) {
      setSelectedHero(null);
      activateTeamSelection();

      for (const [key] of Object.entries(activeRoster)) {
        const teamSelectIcon = document.getElementById(key);
        if (teamSelectIcon !== null) {
          teamSelectIcon.className = "team-select-icon selected";
        }
      }
    }

    let newTeamSprites = {};
    if (Object.keys(roster.activeRoster).length > 0) {
      for (const [key, value] of Object.entries(roster.activeRoster)) {
        let sprite = new Image();
        sprite.src = value.spriteSheet;

        newTeamSprites = { ...newTeamSprites, [value.name]: sprite };
      }
      setPlayerTeam(newTeamSprites);
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

      if (openSet) {
        for (const [key, value] of Object.entries(openSet)) {
          if (
            checkTileForHero(value.x, value.y, activeRoster) &&
            checkTileForHero(value.x, value.y, activeRoster) !==
              selectedHero.name
          ) {
            context.fillStyle = "rgba(255,0,0,0.5)";
            context.fillRect(value.x, value.y, 48, 48);
          } else {
            context.fillStyle = "rgba(0,0,255,0.3)";
            context.fillRect(value.x, value.y, 48, 48);
          }
        }
      }

      if (Object.keys(playerTeam).length > 0) {
        for (const [key, value] of Object.entries(playerTeam)) {
          if (!value.complete) {
            value.onload = () => {
              context.drawImage(
                value,
                collection[key].x,
                collection[key].y,
                48,
                48,
                activeRoster[key].x,
                activeRoster[key].y,
                48,
                48
              );
            };
          } else {
            context.drawImage(
              value,
              collection[key].x,
              collection[key].y,
              48,
              48,
              activeRoster[key].x,
              activeRoster[key].y,
              48,
              48
            );
          }
        }
      }
    };
  }, [roster, playerTeam, mapImage, mode.teamSelection.active]);

  return (
    <div className="container-lg">
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
          <button className="btn reset-button" onClick={() => resetMode()}>
            Reset Mode
          </button>
        </div>
        <div className="col-md-auto">
          <button
            className="btn reset-button"
            onClick={() => {
              deactivateTeamSelection();
              activateBattle();
            }}
          >
            Start Game
          </button>
        </div>
        <div className="col-md-auto">
          <button
            className="btn reset-active-heroes"
            onClick={() => {
              resetActiveHeroes();
              setPlayerTeam({});
            }}
          >
            Reset Active Heroes
          </button>
        </div>
      </div>
      <div id="full-ui" className="full-ui row justify-content-center">
        <div id="canvas-div" className="canvas-div col-md-auto">
          <canvas
            id="canvas"
            ref={canvasRef}
            onClick={(e) => handleClick.bind(this)(canvas, e)}
          ></canvas>
        </div>
        <div id="hero-info" className="hero-info col-4">
          <div className="row">
            {selectedHero ? (
              <>
                <div className="row hero-info-row">
                  <div className="col current-hero-display-icon">
                    <h5>{selectedHero.displayName}</h5>
                  </div>
                  <div className="col-md-auto current-hero-display-icon">
                    <img src={selectedHero.displayIcon} />
                  </div>
                </div>
                <div className="row hero-info-row">
                  <div className="row hero-info--sub-row">
                    <h5>Current Tile (Coordinates)</h5>
                  </div>
                  <div className="row hero-info-sub-row">
                    <div className="col">
                      x:
                      {activeRoster[selectedHero.name].x !== null
                        ? activeRoster[selectedHero.name].x
                        : " N/A"}
                    </div>
                    <div className="col">
                      y:
                      {activeRoster[selectedHero.name].y !== null
                        ? activeRoster[selectedHero.name].y
                        : " N/A"}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="col">
                <h5>Select a hero</h5>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col"></div>
        {!mode.battle.active && mode.teamSelection.active ? (
          <TeamSelection
            playerTeam={playerTeam}
            setPlayerTeam={setPlayerTeam}
            heroLimit={heroLimit}
          />
        ) : null}
      </div>
    </div>
  );
};
export default GrassCanvas;
