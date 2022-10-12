import { current } from "@reduxjs/toolkit";
import React, { Component, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { convertToChar } from "../functions/characterConversions";
import { modeActions } from "../redux/slices/mode";
import { rosterActions } from "../redux/slices/roster";

const TeamSelection = (props) => {
  const dispatch = useDispatch();
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);

  const collection = roster.collection;
  const activeRoster = roster.activeRoster;
  const selectedHero = mode.selectedHero.hero;

  const currentChar = props.currentChar;
  const setCurrentChar = props.setCurrentChar;
  const playerTeam = props.playerTeam;
  const setPlayerTeam = props.setPlayerTeam;
  const charLimit = props.charLimit;
  const defaultDir = props.defaultDir;

  const setSelectedHero = (char) => {
    dispatch(modeActions.setSelectedHero(char));
  };

  const addActiveChar = (char) => {
    dispatch(rosterActions.addActiveChar(char));
  };

  const deleteActiveChar = (id) => {
    dispatch(rosterActions.deleteActiveChar(id));
  };

  const updateXY = (newPosition) => {
    dispatch(rosterActions.updateXY(newPosition));
  };

  const displayChar = () => {
    return Object.keys(collection).map((key) => {
      return (
        <img
          key={collection[key].id}
          id={collection[key].id}
          src={collection[key].icon}
          alt={collection[key].name}
          onClick={() => addToTeam(collection[key])}
        />
      );
    });
  };

  //function adds char to active roster, but removes if the char is already on the active roster
  const addToTeam = (char) => {
    let canvas = document.getElementById("canvas-div");
    //if char is not currently in active roster
    if (
      !playerTeam.hasOwnProperty(char.id) &&
      currentChar.id !== char.id &&
      Object.keys(playerTeam).length < charLimit
    ) {
      let tempCurr = convertToChar(char, defaultDir);
      tempCurr.updatePos(null, null);

      setCurrentChar(tempCurr);
      canvas.style.cursor = 'url("' + char.icon + '") 25 15, auto';
      const teamSelectIcon = document.getElementById(char.id);
      teamSelectIcon.className = "team-select-icon selected";
    }
    //if char is currently in active roster
    else if (playerTeam.hasOwnProperty(char.id) || currentChar.id === char.id) {
      const teamSelectIcon = document.getElementById(char.id);
      teamSelectIcon.className = "";
      if (currentChar && char.id === currentChar.id) {
        setCurrentChar({});
      }
      canvas.style.cursor = "";
      delete playerTeam[char.id];
      setPlayerTeam({ ...playerTeam });
    } else {
      window.alert(
        "You can't have more than 4 characters on this map! Please deselect a character if you wish to add another."
      );
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col user-all-heroes">{displayChar()}</div>
    </div>
  );
};

export default TeamSelection;
