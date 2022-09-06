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

  const updateXY = (hero) => {
    dispatch(rosterActions.updateXY(hero));
  };

  const handleClick1 = () => {
    let batman = {
      name: "batman",
      displayName: "Batman (Prime Earth)",
      imgLink: "/images/batman/batmanDown2.png",
      x: 0,
      y: 0,
    };
    addHero(batman);
  };

  const handleClick2 = () => {
    let batman = {
      name: "batman",
      x: 4,
    };
  };

  return (
    <Fragment>
      <Link to="/game">
        Game
        <input
          type="image"
          onClick={handleClick1}
          src="/images/batman/batmanDown2.png"
        ></input>
      </Link>

      <button onClick={handleClick2}>Update X</button>
    </Fragment>
  );
};

export default RosterCreation;
