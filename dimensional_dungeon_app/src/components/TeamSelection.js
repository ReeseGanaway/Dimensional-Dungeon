import React, { Component, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const TeamSelection = (props) => {
  const roster = useSelector((state) => state.roster);
  const mode = useSelector((state) => state.mode);

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

    //const heroes = displayHero();
    //console.log(heroes);

    //return (<img src={hero.displayIcon} onClick = {() => addToTeam(hero)}/>);
  };

  const addToTeam = (hero) => {
    let newHero = { ...hero };
    const name = newHero.name;
    let sprite = new Image();
    sprite.src = newHero.spriteSheet;
    newHero.spriteSheet = sprite;
    props.setPlayerTeam({ ...props.playerTeam, [name]: newHero });
    console.log(props.playerTeam);
  };

  const renderRoster = () => {
    for (const [key, value] of Object.entries(roster)) {
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col user-all-heroes">
        {displayHero()}
        {/* {Object.keys(roster).map((key) => {
          return (
            <img
              key={roster[key].name}
              src={roster[key].displayIcon}
              alt={roster[key].displayName}
              onClick={() => addToTeam(roster[key])}
            />
          );
        })} */}
      </div>
    </div>
  );
};

export default TeamSelection;
