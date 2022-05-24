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

    //set all the properties again if the window is resized
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.fillStyle = "white";
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    });
  }, []);

  return <canvas ref={canvasReference} {...props} />;
};
export default Canvas;
