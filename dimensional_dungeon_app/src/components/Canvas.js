import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { rosterActions } from "../redux/slices/roster";
import RosterCreation from "./RosterCreation";
import { modeActions } from "../redux/slices/mode";
import "./Canvas.css";

const Canvas = (props) => {
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  const [canvas, setCanvas] = useState(document.createElement("canvas"));
  const canvasRef = useRef(null);

  const [characterUpdate, setCharacterUpdate] = useState(false);
  const [playerTeam, setPlayerTeam] = useState({});

  const mapImage = new Image();
  mapImage.src = "/images/grassMap.png";

  const addHero = (hero) => {
    dispatch(rosterActions.addHero(hero));
  };

  const updateXY = (newPosition) => {
    dispatch(rosterActions.updateXY(newPosition));
  };

  const clearRoster = () => {
    dispatch(rosterActions.clearRoster());
  };

  const toggleMovement = (movement) => {
    dispatch(modeActions.toggleMovement(movement));
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
      for (const [key, value] of Object.entries(roster)) {
        //if the coordinates of the click are on the same 48 x 48 tile as one of the ally characters
        if (
          x >= roster[key].x &&
          x <= roster[key].x + 47 &&
          y >= roster[key].y &&
          y <= roster[key].y + 47
        ) {
          const newMovement = {
            active: true,
            currentHero: roster[key].name,
          };

          //put us in movement mode
          toggleMovement(newMovement);

          break;
        }
      }
    }
  }

  //function for moving the character
  function moveCharacter(x, y) {
    let newTeam = playerTeam;
    updateXY({
      name: mode.movement.currentHero,
      x: x - (x % 48),
      y: y - (y % 48),
    });
    // roster[movement.currentHero].x = x - (x % 48);
    // roster[movement.currentHero].y = y - (y % 48);
    setPlayerTeam(newTeam);
    let exitMovement = { active: false, currentHero: null };
    toggleMovement(exitMovement);
    //console.log(mode, roster["batman"]);
  }

  useEffect(() => {
    const canvasDiv = document.getElementById("canvas-div");
    const oldCanvas = document.getElementById("newCanvas");
    const newCanvas = document.createElement("canvas");
    setCanvas(newCanvas);

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
      setCanvas(newCanvas);
      //console.log(newCanvas);

      for (const [key, value] of Object.entries(roster)) {
        let sprite = new Image();
        sprite.src = roster[key].imgLink;
        sprite.onload = () => {
          context.drawImage(sprite, roster[key].x, roster[key].y);
        };
      }
      if (oldCanvas) {
        oldCanvas.remove();
      }
      canvasDiv.appendChild(newCanvas);
    };
  }, [roster, mode]);

  return (
    <div id="full-ui" className="full-ui row">
      <div id="canvas-div" className="canvas-div col-md-auto"></div>
      <div id="hero-info" className="hero-info col-md-auto">
        <div className="row">
          <h6>Round 1</h6>
        </div>
        <div className="row">
          {mode.movement.currentHero ? (
            <>
              <div className="col">
                {roster[mode.movement.currentHero].displayName}
              </div>
              <div className="col">
                <img src={roster[mode.movement.currentHero].imgLink} />
              </div>
            </>
          ) : (
            "Select a hero"
          )}
        </div>
      </div>
    </div>
  );
};
export default Canvas;
