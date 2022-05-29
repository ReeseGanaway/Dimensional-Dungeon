import React, { useRef, useEffect } from "react";
import Tile from "../classes/Tile";

const Canvas = (props) => {
  const canvasReference = useRef(null);

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");

    //set map image
    const mapImage = new Image();
    mapImage.src = "/images/Pellet Town (Grid lines).png";

    //set player sprite
    const playerSprite = new Image();
    playerSprite.src = "/images/batman/batmanDown.png";

    //when map loads, perform these actions
    mapImage.onload = () => {
      canvas.width = mapImage.width;
      canvas.height = mapImage.height;

      let tileMap = [];
      for (let y = 0; y * 48 < canvas.height; y++) {
        let tileRow = [];
        for (let x = 0; x * 48 < canvas.width; x++) {
          let newTile = new Tile(x, y);
          tileRow.push(newTile);
        }
        tileMap.push(tileRow);
      }

      context.drawImage(mapImage, 0, 0);
      context.drawImage(playerSprite, canvas.width / 2, canvas.height / 2);

      context.fillStyle = "rgba(255,0,0,0.5)";
      for (let i = 0; i < tileMap.length; i++) {
        for (let j = 0; j < tileMap[i].length; j++) {
          context.fillRect(
            tileMap[i][j].x * 48,
            tileMap[i][j].y * 48,
            tileMap[i][j].width,
            tileMap[i][j].height
          );
        }
      }
      console.log(tileMap);
    };

    // //set all the properties again if the window is resized
    // window.addEventListener("resize", () => {

    //   mapImage.onload = () => {
    //     context.drawImage(mapImage, 0, 0);
    //     context.drawImage(playerSprite, canvas.width / 2, canvas.height / 2);
    //   };
    // });
  }, []);

  return <canvas ref={canvasReference} {...props} />;
};
export default Canvas;
