import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  const canvasReference = useRef(null);

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");

    //set properties of the canvas component
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context.fillStyle = "white";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    const mapImage = new Image();
    mapImage.src = "./images/dimensionalDungeonStartingIsland.png";
    console.log(mapImage);
    mapImage.onload = () => {
      context.drawImage(mapImage, 0, 0);
    };

    //set all the properties again if the window is resized
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.fillStyle = "white";
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(mapImage, 0, 0);
    });
  }, []);

  return <canvas ref={canvasReference} />;
};
export default Canvas;
