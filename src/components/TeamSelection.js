import { current } from "@reduxjs/toolkit";
import React, { Component, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { convertToChar } from "../functions/characterConversions";
import { CharacterFactory } from "../functions/characterFactory";
import { modeActions } from "../redux/slices/mode";
import { rosterActions } from "../redux/slices/roster";

const TeamSelection = (props) => {
  const dispatch = useDispatch();
  const roster = useSelector((state) => state.roster);

  const collection = roster.collection;
  const activeRoster = roster.activeRoster;

  const sideBarChar = props.sideBarChar;
  const setSideBarChar = props.setSideBarChar;
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
    const characterFactory = new CharacterFactory();
    let canvas = document.getElementById("canvas-div");
    //if char is not currently in active roster
    if (
      !playerTeam.hasOwnProperty(char.id) &&
      currentChar.id !== char.id &&
      Object.keys(playerTeam).length < charLimit
    ) {
      let tempCurr = characterFactory.create(
        char.id,
        char.name,
        char.spriteSheet,
        char.icon,
        { x: char.x, y: char.y, dir: defaultDir },
        char.used,
        char.maxStats
      );
      tempCurr.updatePos(null, null);
      if (Object.keys(currentChar).length) {
        let oldCurr = document.getElementById(currentChar.id);
        oldCurr.className = "";
      }
      setCurrentChar(tempCurr);
      setSideBarChar({ [tempCurr.id]: tempCurr });
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
        setSideBarChar({});
        console.log("here");
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
