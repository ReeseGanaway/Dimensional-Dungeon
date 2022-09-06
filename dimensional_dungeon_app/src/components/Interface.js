import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { rosterActions } from "../redux/slices/roster";
import { modeActions } from "../redux/slices/mode";
import RosterCreation from "./RosterCreation";
import Canvas from "./Canvas";

const Interface = () => {
  const mode = useSelector((state) => state.mode);
  const roster = useSelector((state) => state.roster);
  const dispatch = useDispatch();

  const battle = () => {
    dispatch(modeActions.battle());
  };

  const rosterCreation = () => {
    dispatch(modeActions.rosterCreation());
  };

  if (mode === "") {
    rosterCreation();
  }
  while (mode === "rosterCreation") {
    return <RosterCreation />;
  }
  while (mode === "battle") {
    return <Canvas />;
  }
};

export default Interface;
