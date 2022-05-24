import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  const canvasReference = useRef(null);

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");

    //set properties of the canvas component
    canvas.width = 1024;
    canvas.height = 576;
    context.fillStyle = "white";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }, []);

  return <canvas ref={canvasReference} {...props} />;
};
export default Canvas;
