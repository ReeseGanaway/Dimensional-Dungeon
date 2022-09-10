import React, { Component, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { modeActions } from "../redux/slices/mode";
import { rosterActions } from "../redux/slices/roster";

const TeamSelection = (props) => {
  const dispatch = useDispatch();
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);

  const collection = roster.collection;

  const setTeamSelectionHero = (hero) => {
    dispatch(modeActions.setTeamSelectionHero(hero));
  };

  const setSelectedHero = (hero) => {
    dispatch(modeActions.setSelectedHero(hero));
  };

  const addHeroActive = (hero) => {
    dispatch(rosterActions.addHeroActive(hero));
  };

  const displayHero = () => {
    return Object.keys(collection).map((key) => {
      return (
        <img
          key={collection[key].name}
          id={collection[key].name}
          src={collection[key].displayIcon}
          alt={collection[key].displayName}
          onClick={() => addToTeam(collection[key])}
        />
      );
    });
  };

  const addToTeam = (hero) => {
    addHeroActive(hero);
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
