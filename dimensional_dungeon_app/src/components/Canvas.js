import React, { useRef, useEffect } from "react";

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
    mapImage.src = "/images/Pellet Town.png";
    mapImage.onload = () => {
      context.drawImage(mapImage, -785, -650);
    };

    //set all the properties again if the window is resized
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.fillStyle = "white";
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      // mapImage.src = "/images/dimesionalDungeonStartingIslandSmaller.png";
      // mapImage.onload = () => {
      context.drawImage(mapImage, -785, -650);
      //};
    });
  }, []);

  return <canvas ref={canvasReference} {...props} />;
};
export default Canvas;
