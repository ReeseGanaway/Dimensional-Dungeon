import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { rosterActions } from "../redux/slices/roster";
import { modeActions } from "../redux/slices/mode";
import "./Canvas.css";
import TeamSelection from "./TeamSelection";

const GrassCanvas = (props) => {
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();

  const [playerTeam, setPlayerTeam] = useState({});
  const [firstRender, setFirstRender] = useState(true);

  const mapImage = new Image();
  mapImage.src = "/images/grassMap.png";

  const addHero = (hero) => {
    dispatch(rosterActions.addHero(hero));
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
    dispatch(modeActions.resetMode);
  };

  function handleClick(canvas, e) {
    //get the coordinates of the user's curson on click
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    //movement mode is active (last click was a click on an ally character)
    if (mode.movement.active) {
      moveCharacter(x, y);
    }
    //if we arent in movement mode...
    else {
      //cycle through player's team
      for (const [key, value] of Object.entries(playerTeam)) {
        //if the coordinates of the click are on the same 48 x 48 tile as one of the ally characters
        if (
          x >= value.x &&
          x <= value.x + 47 &&
          y >= value.y &&
          y <= value.y + 47
        ) {
          const newMovement = {
            active: true,
            currentHero: playerTeam[key].name,
          };

          //put us in movement mode
          toggleMovement(newMovement);
          console.log(playerTeam);

          break;
        }
      }
    }
  }

  //function for moving the character
  function moveCharacter(x, y) {
    //update component playerTeam state
    let newTeam = playerTeam;
    newTeam[mode.movement.currentHero].x = x - (x % 48);
    newTeam[mode.movement.currentHero].y = y - (y % 48);
    setPlayerTeam(newTeam);

    //update redux state (necessary to save player positions on refresh)
    updateXY({
      name: mode.movement.currentHero,
      x: x - (x % 48),
      y: y - (y % 48),
    });

    //turn off movement mode
    endMovement();
  }

  useEffect(() => {
    let newTeam = {};
    for (const [key, value] of Object.entries(roster)) {
      let sprite = new Image();
      sprite.src = roster[key].spriteSheet;
      let newObj = { ...roster[key] };
      newObj.spriteSheet = sprite;
      newTeam = { ...newTeam, [newObj.name]: newObj };
    }
    setPlayerTeam(newTeam);
    setFirstRender(false);
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

      for (const [key, value] of Object.entries(playerTeam)) {
        const hero = value;

        let spriteSheet = hero.spriteSheet;

        if (!hero.spriteSheet.complete) {
          spriteSheet.onload = () => {
            context.drawImage(
              spriteSheet,
              48,
              0,
              48,
              48,
              hero.x,
              hero.y,
              48,
              48
            );
          };
        } else {
          context.drawImage(spriteSheet, 48, 0, 48, 48, hero.x, hero.y, 48, 48);
        }
      }

      if (oldCanvas) {
        oldCanvas.remove();
      }
      canvasDiv.appendChild(newCanvas);
    };
  }, [roster, mode, playerTeam]);

  return (
    <div className="container-lg">
      <div className="row reset-roster">
        <button className="btn reset-button" onClick={() => resetRoster()}>
          Reset
        </button>
      </div>
      <div id="full-ui" className="full-ui row justify-content-center">
        <div id="canvas-div" className="canvas-div col-md-auto"></div>
        <div id="hero-info" className="hero-info col-4">
          <div className="row">
            {mode.movement.currentHero && Object.keys(playerTeam).length > 0 ? (
              <>
                <div className="row hero-info-row">
                  <div className="col current-hero-display-icon">
                    <h5>{playerTeam[mode.movement.currentHero].displayName}</h5>
                  </div>
                  <div className="col-md-auto current-hero-display-icon">
                    <img
                      src={playerTeam[mode.movement.currentHero].displayIcon}
                    />
                  </div>
                </div>
                <div className="row hero-info-row">
                  <div className="row hero-info--sub-row">
                    <h5>Current Tile (Coordinates)</h5>
                  </div>
                  <div className="row hero-info-sub-row">
                    <div className="col">
                      x:{playerTeam[mode.movement.currentHero].x / 48 + 1}
                    </div>
                    <div className="col">
                      y:{playerTeam[mode.movement.currentHero].y / 48 + 1}
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
        <TeamSelection playerTeam={playerTeam} setPlayerTeam={setPlayerTeam} />
      </div>
    </div>
  );
};
export default GrassCanvas;
