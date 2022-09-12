import React, { Component, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { modeActions } from "../redux/slices/mode";
import { rosterActions } from "../redux/slices/roster";

const TeamSelection = (props) => {
  const dispatch = useDispatch();
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);

  const collection = roster.collection;
  const activeRoster = roster.activeRoster;
  const selectedHero = mode.selectedHero.hero;

  const setSelectedHero = (hero) => {
    dispatch(modeActions.setSelectedHero(hero));
  };

  const addHeroActive = (hero) => {
    dispatch(rosterActions.addHeroActive(hero));
  };

  const removeActiveHero = (name) => {
    dispatch(rosterActions.deleteActiveHero(name));
  };

  const updateXY = (newPosition) => {
    dispatch(rosterActions.updateXY(newPosition));
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

  //function adds hero to active roster, but removes if the hero is already on the active roster
  const addToTeam = (hero) => {
    let canvas = document.getElementById("canvas-div");
    //if hero is not currently in active roster
    if (!activeRoster.hasOwnProperty(hero.name)) {
      addHeroActive(hero);
      updateXY({ name: hero.name, x: null, y: null });
      setSelectedHero(hero);
      canvas.style.cursor = 'url("' + hero.displayIcon + '") 25 15, auto';
      const teamSelectIcon = document.getElementById(hero.name);
      teamSelectIcon.className = "team-select-icon selected";
    }
    //if hero is currently in active roster
    else {
      const teamSelectIcon = document.getElementById(hero.name);
      teamSelectIcon.className = "";
      removeActiveHero(hero.name);
      if (selectedHero && hero.name === selectedHero.name) {
        setSelectedHero(null);
      }
      canvas.style.cursor = "";
    }

    if (props.playerTeam[hero.name]) {
      delete props.playerTeam[hero.name];
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col user-all-heroes">{displayHero()}</div>
    </div>
  );
};

export default TeamSelection;
