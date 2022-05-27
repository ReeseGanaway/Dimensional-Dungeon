import React, { useRef, useEffect } from "react";
import PlayerSprite from "./PlayerSprite";

const Canvas = (props) => {
  const canvasReference = useRef(null);

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");

    //console.log(mapImage);

    //set properties of the canvas component
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.fillStyle = "white";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    const mapImage = new Image();
    mapImage.src = "/images/Pellet Town (Grid lines).png";
    const playerSprite = new Image();
    playerSprite.src = "/images/batman/batmanDown.png";
    mapImage.onload = () => {
      context.drawImage(mapImage, -750, -550);
      context.drawImage(playerSprite, canvas.width / 2, canvas.height / 2);
    };

    //set all the properties again if the window is resized
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.fillStyle = "white";
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(mapImage, -750, -550);
    });
  }, []);

  return <canvas ref={canvasReference} {...props} />;
};
export default Canvas;
