import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { rosterActions } from "../redux/slices/roster";
import { modeActions } from "../redux/slices/mode";
import { Link } from "react-router-dom";

const RosterCreation = () => {
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();

  const addHero = (hero) => {
    dispatch(rosterActions.addHero(hero));
  };

  const resetRoster = (hero) => {
    dispatch(rosterActions.resetRoster());
  };

  const updateXY = (hero) => {
    dispatch(rosterActions.updateXY(hero));
  };

  const handleClick1 = () => {
    let batman = {
      name: "batman",
      displayName: "Batman (Prime Earth)",
      displayIcon: "/images/batman/batmanDown2.png",
      spriteSheet: "/images/batman/batmanSpriteSheet.png",
      x: 0,
      y: 0,
    };
    addHero(batman);
  };

  const handleClick2 = () => {
    let robin = {
      name: "robin",
      displayName: "Robin (Dick Grayson)(Prime Earth)",
      displayIcon: "/images/robin/robinDown2.png",
      spriteSheet: "/images/robin/robinNightwingSpriteSheet.png",
      x: 48,
      y: 0,
    };
    addHero(robin);
  };

  return (
    <Fragment>
      <Link to="/game">Game</Link>

      <input
        type="image"
        onClick={handleClick1}
        src="/images/batman/batmanDown2.png"
      ></input>

      <input
        type="image"
        onClick={handleClick2}
        src="/images/robin/robinDown2.png"
      ></input>

      <button onClick={() => resetRoster()}>here</button>
    </Fragment>
  );
};

export default RosterCreation;
