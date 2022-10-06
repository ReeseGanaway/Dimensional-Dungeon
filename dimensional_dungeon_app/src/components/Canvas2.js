import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const Canvas2 = () => {
  const canvasRef = useRef();

  //state variables

  const [playerTeam, setPlayerTeam] = useState({});
  const [firstRender, setFirstRender] = useState(true);
  const [heroLimit, setHeroLimit] = useState(4);
  const [stepCount, setStepCount] = useState(0);
  const [pathState, setPathState] = useState([]);

  //redux states
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);

  useEffect(() => {
    console.log("mounting");

    return function storeGame() {
      console.log("unmounting");
    };
  }, []);

  window.onbeforeunload = (event) => {
    console.log("Would you like to save your game?");
  };

  return (
    <div className="container">
      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default Canvas2;
