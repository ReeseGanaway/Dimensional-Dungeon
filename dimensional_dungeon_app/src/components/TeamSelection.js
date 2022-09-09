import React, { Component, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { modeActions } from "../redux/slices/mode";

const TeamSelection = (props) => {
  const dispatch = useDispatch();
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);

  const setTeamSelectionHero = (hero) => {
    dispatch(modeActions.setTeamSelectionHero(hero));
  };

  const setSelectedHero = (hero) => {
    dispatch(modeActions.setSelectedHero(hero));
  };

  const displayHero = () => {
    return Object.keys(roster).map((key) => {
      return (
        <img
          key={roster[key].name}
          id={roster[key].name}
          src={roster[key].displayIcon}
          alt={roster[key].displayName}
          onClick={() => addToTeam(roster[key])}
        />
      );
    });
  };

  const addToTeam = (hero) => {
    if (props.playerTeam[hero.name]) {
      delete props.playerTeam[hero.name];
    }
    setTeamSelectionHero(hero.name);
    setSelectedHero(hero);

    let canvas = document.getElementById("canvas-div");
    canvas.style.cursor = 'url("' + hero.displayIcon + '") 25 15, auto';
  };

  return (
    <div className="row justify-content-center">
      <div className="col user-all-heroes">{displayHero()}</div>
    </div>
  );
};

export default TeamSelection;
