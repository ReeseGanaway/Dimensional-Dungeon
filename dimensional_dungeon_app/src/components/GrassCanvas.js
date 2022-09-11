import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { rosterActions } from "../redux/slices/roster";
import { modeActions } from "../redux/slices/mode";
import "./Canvas.css";
import TeamSelection from "./TeamSelection";

const GrassCanvas = (props) => {
  //redux state variables

  //full states
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);

  //individual data in states
  const selectedHero = mode.selectedHero;
  const activeRoster = roster.activeRoster;

  const dispatch = useDispatch();

  const [playerTeam, setPlayerTeam] = useState({});
  const [firstRender, setFirstRender] = useState(true);

  //state used to limit where players can place heroes during team select
  const [teamSelectTiles, setTeamSelectTiles] = useState({
    1: { x1: 0, x2: 47, y1: 0, y2: 47 },
    2: { x1: 48, x2: 95, y1: 0, y2: 47 },
    3: { x1: 0, x2: 47, y1: 48, y2: 95 },
    2: { x1: 48, x2: 95, y1: 48, y2: 95 },
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

  const toggleMovement = (movement) => {
    dispatch(modeActions.toggleMovement(movement));
  };

  const endMovement = (movement) => {
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
      const teamSelectIcon = document.getElementById(key);
      teamSelectIcon.className = "";
    }
    dispatch(rosterActions.resetActiveHeroes());
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
      if (selectedHero.hero) {
        setNewHero(x, y);
      }

      //if user has selected a hero that is already on the canvas, but they want to move it
      else if (!selectedHero.hero && checkTileForHero(x, y)) {
        const currentHero = checkTileForHero(x, y);
        moveHeroDuringTeamSelect(currentHero);
      }
    }
    //movement mode is active (last click was a click on an ally character)
    else if (mode.movement.active) {
      moveCharacter(x, y);
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
          const newMovement = {
            active: true,
            currentHero: activeRoster[key].name,
          };

          //put us in movement mode
          toggleMovement(newMovement);

          break;
        }
      }
    }
  }

  //different functions for handling clicks based on current mode

  //function to check if a character is on the tile clicked by user
  function checkTileForHero(x, y) {
    for (const [key, value] of Object.entries(activeRoster)) {
      //if the coordinates of the click are on the same 48 x 48 tile as one of the ally characters
      if (
        x >= value.x &&
        x <= value.x + 47 &&
        y >= value.y &&
        y <= value.y + 47
      ) {
        return value.name;
      }
    }
    return null;
  }

  function moveHeroDuringTeamSelect(name) {
    const tempHero = { ...activeRoster[name] };
    setSelectedHero(tempHero);
    delete playerTeam[name];
    let canvas = document.getElementById("canvas-div");
    canvas.style.cursor = 'url("' + tempHero.displayIcon + '") 25 15, auto';
    setTeamSelectionHero(name);
  }

  //function for setting character coords when in tem selection mode
  function setNewHero(x, y) {
    const newPosition = {
      name: selectedHero.hero.name,
      x: x - (x % 48),
      y: y - (y % 48),
    };
    updateXY(newPosition);
    let newTeamSprites = { ...playerTeam };
    let sprite = new Image();
    sprite.src = selectedHero.hero.spriteSheet;

    newTeamSprites[selectedHero.hero.name] = sprite;

    setPlayerTeam(newTeamSprites);
    setTeamSelectionHero(null);
    let canvas = document.getElementById("canvas-div");
    canvas.style.cursor = "";
    setSelectedHero(null);
  }

  //function for moving the character
  function moveCharacter(x, y) {
    //update redux state (necessary to save player positions on refresh)
    updateXY({
      name: selectedHero.hero.name,
      x: x - (x % 48),
      y: y - (y % 48),
    });

    //turn off movement mode
    endMovement();
  }

  useEffect(() => {
    setFirstRender(false);
    if (!mode.battle.active) {
      activateTeamSelection();

      for (const [key] of Object.entries(activeRoster)) {
        const teamSelectIcon = document.getElementById(key);
        if (teamSelectIcon !== null) {
          teamSelectIcon.className = "team-select-icon selected";
        }
      }
    }
    setSelectedHero(null);

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

    const canvasDiv = document.getElementById("canvas-div");
    const oldCanvas = document.getElementById("newCanvas");
    const newCanvas = document.createElement("canvas");

    newCanvas.addEventListener("mousedown", function (e) {
      handleClick.bind(this)(newCanvas, e);
    });
    //const context = canvas.getContext("2d");

    mapImage.onload = () => {
      newCanvas.width = mapImage.width;
      newCanvas.height = mapImage.height;
      newCanvas.id = "newCanvas";

      const context = newCanvas.getContext("2d");
      context.drawImage(mapImage, 0, 0);

      if (Object.keys(playerTeam).length > 0) {
        for (const [key, value] of Object.entries(playerTeam)) {
          if (!value.complete) {
            value.onload = () => {
              context.drawImage(
                value,
                48,
                0,
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
              48,
              0,
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

      if (oldCanvas) {
        oldCanvas.remove();
      }
      canvasDiv.appendChild(newCanvas);
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
        <div id="canvas-div" className="canvas-div col-md-auto"></div>
        <div id="hero-info" className="hero-info col-4">
          <div className="row">
            {selectedHero.hero ? (
              <>
                <div className="row hero-info-row">
                  <div className="col current-hero-display-icon">
                    <h5>{selectedHero.hero.displayName}</h5>
                  </div>
                  <div className="col-md-auto current-hero-display-icon">
                    <img src={selectedHero.hero.displayIcon} />
                  </div>
                </div>
                <div className="row hero-info-row">
                  <div className="row hero-info--sub-row">
                    <h5>Current Tile (Coordinates)</h5>
                  </div>
                  <div className="row hero-info-sub-row">
                    <div className="col">
                      x:
                      {selectedHero.hero.x !== null
                        ? selectedHero.hero.x
                        : //playerTeam[selectedHero.hero.name]
                          //? playerTeam[selectedHero.hero.name].x
                          //? playerTeam[selectedHero.hero.name].x / 48 + 1
                          // : " N/A"
                          // : " N/A"
                          " N/A"}
                    </div>
                    <div className="col">
                      y:
                      {selectedHero.hero.y !== null
                        ? selectedHero.hero.y
                        : //playerTeam[selectedHero.hero.name]
                          //? playerTeam[selectedHero.hero.name].x
                          //? playerTeam[selectedHero.hero.name].x / 48 + 1
                          // : " N/A"
                          // : " N/A"
                          " N/A"}
                      {/* {Object.keys(playerTeam).length > 0
                        ? playerTeam[selectedHero.hero.name]
                          ? playerTeam[selectedHero.hero.name].y
                            ? playerTeam[selectedHero.hero.name].y / 48 + 1
                            : " N/A"
                          : " N/A"
                        : " N/A"} */}
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
          />
        ) : null}
      </div>
    </div>
  );
};
export default GrassCanvas;
