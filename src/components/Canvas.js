import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { rosterActions } from "../redux/slices/roster";
import RosterCreation from "./RosterCreation";
import { modeActions } from "../redux/slices/mode";

const Canvas = (props) => {
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();

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
    console.log("Beginning of handleclick, movement is:", mode.movement);

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
            character: roster[key].name,
          };

          //put us in movement mode
          toggleMovement(newMovement);

          console.log("Batman: ", mode.movement);

          break;
        }
      }
    }
  }

  //function for moving the character
  function moveCharacter(x, y) {
    console.log("here");
    let newTeam = playerTeam;
    updateXY({
      name: mode.movement.currentHero,
      x: x - (x % 48),
      y: y - (y % 48),
    });
    // roster[movement.currentHero].x = x - (x % 48);
    // roster[movement.currentHero].y = y - (y % 48);
    setPlayerTeam(newTeam);
    let exitMovement = { active: false, character: null };
    toggleMovement(exitMovement);
    console.log(mode, roster["batman"]);
  }

  // function getCursorPosition(canvas, e) {
  //   let rect = canvas.getBoundingClientRect();
  //   let x = e.clientX - rect.left;
  //   let y = e.clientY - rect.top;
  //   console.log(movement);

  //   if (movement["active"]) {
  //     let newTeam = playerTeam;
  //     newTeam[movement.character].x = x - (x % 48);
  //     newTeam[movement.character].y = y - (y % 48);
  //     setPlayerTeam(newTeam);
  //     const updated = true;
  //     setCharacterUpdate(updated);

  //     let newMovement = { active: false, character: null };
  //     setMovement(newMovement);

  //     console.log(movement, playerTeam["batman"], characterUpdate);
  //     return;
  //   }

  //   for (const [key, value] of Object.entries(playerTeam)) {
  //     if (
  //       x >= playerTeam[key].x &&
  //       x <= playerTeam[key].x + 47 &&
  //       y >= playerTeam[key].y &&
  //       y <= playerTeam[key].y + 47
  //     ) {
  //       console.log("Batman!");
  //       //playerTeam[key].move = true;

  //       setMovement(() => {
  //         movement.active = true;
  //         movement.character = playerTeam[key].name;
  //         return movement;
  //       });
  //       console.log(movement);
  //       console.log(playerTeam["batman"]);

  //       //setCharacterUpdate(true);
  //       return;
  //     }
  //   }
  //   console.log("Coordinate x: " + x, "Coordinate y: " + y);
  // }

  const canvasReference = useRef(null);

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");

    console.log("here");
    const spriteImages = [];
    // if (roster) {
    //   for (const [key, value] of Object.entries(roster)) {
    //     //const spriteObj = { ...roster[key] };
    //     //const name = spriteObj.name;
    //     //spriteObj.spriteImg = new Image();

    //     //spriteObj.spriteImg.src = roster[key].imgLink;

    //     // setPlayerTeam(() => {
    //     //   playerTeam[name] = spriteObj;
    //     //   return playerTeam;
    //     // });

    // }
    //}

    canvas.addEventListener("mousedown", function (e) {
      handleClick.bind(this)(canvas, e);
    });

    //when map loads, perform these actions
    // mapImage.onload = () => {
    //   canvas.width = mapImage.width;
    //   canvas.height = mapImage.height;

    //   context.drawImage(mapImage, 0, 0);
    // };

    // //set all the properties again if the window is resized
    // window.addEventListener("resize", () => {

    //   mapImage.onload = () => {
    //     context.drawImage(mapImage, 0, 0);
    //     context.drawImage(playerSprite, canvas.width / 2, canvas.height / 2);
    //   };
    // });
  }, []);

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");
    console.log(
      "At beginning of useeffect, here is the movement",
      mode.movement
    );

    mapImage.onload = () => {
      canvas.width = mapImage.width;
      canvas.height = mapImage.height;
      context.drawImage(mapImage, 0, 0);

      for (const [key, value] of Object.entries(roster)) {
        console.log("here");
        let sprite = new Image();
        sprite.src = roster[key].imgLink;
        context.drawImage(sprite, roster[key].x, roster[key].y);
      }
    };

    console.log("At end of Useeffect, here is the movement:", mode.movement);
  }, [playerTeam, roster, mode]);

  return <canvas ref={canvasReference} />;
};
export default Canvas;
